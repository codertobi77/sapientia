import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validators";
import { sendMail, notifyAdmin, confirmationEmail, escapeHtml } from "@/lib/mail";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    nom: parsed.data.nom,
    email: parsed.data.email,
    sujet: parsed.data.sujet,
    message: parsed.data.message,
  });

  if (error) {
    return NextResponse.json({ error: "Erreur d'enregistrement" }, { status: 500 });
  }

  const sujet = escapeHtml(parsed.data.sujet);
  const message = escapeHtml(parsed.data.message).replace(/\n/g, "<br/>");

  await Promise.all([
    notifyAdmin(
      `Nouveau message de contact — ${parsed.data.sujet}`,
      `<p><strong>${escapeHtml(parsed.data.nom)}</strong> (${escapeHtml(parsed.data.email)})</p>
       <p><strong>Sujet :</strong> ${sujet}</p>
       <p>${message}</p>`,
    ),
    sendMail({
      to: parsed.data.email,
      subject: "Nous avons bien reçu votre message — EFES-SAPIENTIA",
      html: confirmationEmail(
        parsed.data.nom,
        `<p>Nous avons bien reçu votre message et reviendrons vers vous très rapidement.</p>
         <p style="color:#64748b">Sujet : ${sujet}</p>`,
      ),
      replyTo: process.env.CONTACT_EMAIL ?? undefined,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
