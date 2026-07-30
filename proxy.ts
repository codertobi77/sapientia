import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Next.js 16 : le middleware s'appelle désormais "proxy".
// 1. Rafraîchit la session Supabase à chaque requête (cookies).
// 2. Protège /admin (redirige vers /connexion si non authentifié).
// La vérification fine des rôles est faite côté DAL/Server Component (RLS).

const ADMIN_PATH = "/admin";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si les clés Supabase ne sont pas configurées (ex: dev sans .env complet),
  // on ne bloque pas toute l'application : on laisse passer les requêtes
  // publiques et on protège /admin en redirigeant vers la connexion.
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith(ADMIN_PATH);

  if (!supabaseUrl || !supabaseKey) {
    if (isAdminRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/connexion";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Important : ne pas ajouter de logique entre createServerClient et getUser.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protection /admin : utilisateur non authentifié -> redirection connexion.
  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Exclut les routes statiques, API et les fichiers statiques pour la perf.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
