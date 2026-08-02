import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

/**
 * Route /icon — sert le logo configuré du site comme icône (favicon) moderne.
 * Le logo (site_settings → logo.imageUrl) peut être un fichier local
 * (/logo.jpeg dans public/) ou une URL distante (Supabase Storage). On rapatrie
 * les octets bruts de l'image et on les renvoie avec le bon Content-Type.
 *
 * Déclaré comme favicon via `metadata.icons` dans app/layout.tsx
 * (rel: 'icon'). Compatibilité : tous les navigateurs modernes. L'ancien
 * app/favicon.ico (binaire) reste disponible en repli pour les vieux UA.
 *
 * Stratégie de résolution de l'URL :
 *  - URL http(s) absolue : fetch direct.
 *  - Chemin absolu (/…) ou relatif : on le résout par rapport à l'origine du
 *    serveur (VERCEL_URL en production, localhost en dev) puis fetch.
 */
export async function GET(): Promise<Response> {
  const { logo } = await getSettings();
  const url = logo.imageUrl || "/logo.jpeg";
  const absolute = url.startsWith("http")
    ? url
    : new URL(url.startsWith("/") ? url : "/" + url, baseOrigin()).toString();

  try {
    const upstream = await fetch(absolute, { cache: "no-store" });
    if (upstream.ok && upstream.body) {
      const ct = upstream.headers.get("content-type") || guessContentType(absolute);
      return new Response(upstream.body, {
        headers: {
          "Content-Type": ct,
          "Cache-Control": "public, max-age=86400, immutable",
        },
      });
    }
  } catch {
    /* swallow : on renvoie le fallback ci-dessous */
  }

  return new Response(logoFallback(), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=600",
    },
  });
}

function baseOrigin(): string {
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

function guessContentType(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "ico":
      return "image/x-icon";
    case "gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

// Fallback SVG (initiale « E » sur fond navy) si le fetch du logo échoue.
function logoFallback(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="48" fill="#0e1f3d"/>
  <text x="128" y="172" font-size="150" font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#c9a227" text-anchor="middle">E</text>
</svg>`;
}
