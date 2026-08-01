import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validators";
import { sendMail, notifyAdmin, confirmationEmail, escapeHtml } from "@/lib/mail";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "E-mail invalide" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email: parsed.data.email, desinscrit: false },
      { onConflict: "email" },
    );

  if (error) {
    return NextResponse.json({ error: "Erreur d'enregistrement" }, { status: 500 });
  }

  await Promise.all([
    sendMail({
      to: parsed.data.email,
      subject: "Bienvenue dans la newsletter EFES « SAPIENTIA »",
      html: confirmationEmail(
        "",  // Pas de nom collecté pour la newsletter
        `<p>Merci de votre inscription à la newsletter de l'EFES « SAPIENTIA ».</p>
        <p>Vous recevrez désormais nos actualités, nos événements et nos offres de formation directement dans votre boîte mail.</p>
        <p style="color:#64748b">À très vite,<br/>L'équipe EFES « SAPIENTIA »</p>`,
      ),
    }),
    notifyAdmin(
      "Nouvelle inscription newsletter",
      `<p>Nouvelle inscription à la newsletter : <strong>${escapeHtml(parsed.data.email)}</strong></p>`,
    ),
  ]);

  return NextResponse.json({ ok: true });
}
