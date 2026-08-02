import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { devisSchema } from "@/lib/validators";
import { sendMail, notifyAdmin, confirmationEmail, escapeHtml } from "@/lib/mail";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = devisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("demandes_devis").insert({
    formation_id: parsed.data.formation_id || null,
    type_formation: parsed.data.type_formation,
    niveau: parsed.data.niveau,
    duree: parsed.data.duree,
    nom: parsed.data.nom,
    email: parsed.data.email,
    telephone: parsed.data.telephone || null,
    message: parsed.data.message || null,
    statut: "EN_ATTENTE",
  });

  if (error) {
    return NextResponse.json({ error: "Erreur d'enregistrement" }, { status: 500 });
  }

  await Promise.all([
    sendMail({
      to: parsed.data.email,
      subject: "Confirmation de votre demande de devis — EFES-SAPIENTIA",
      html: confirmationEmail(
        parsed.data.nom,
        `<p>Nous confirmons la bonne réception de votre demande de devis.</p>
        <p>Notre équipe prépare une proposition personnalisée et reviendra vers vous par e-mail dans les meilleurs délais.</p>
        <p style="color:#64748b">Merci de votre confiance.</p>`,
      ),
      replyTo: process.env.CONTACT_EMAIL ?? undefined,
    }),
    notifyAdmin(
      "Nouvelle demande de devis",
      `<p><strong>${escapeHtml(parsed.data.nom)}</strong> (${escapeHtml(parsed.data.email)} — ${escapeHtml(parsed.data.telephone ?? "—")})</p>
       <p><strong>Formation :</strong> ${escapeHtml(parsed.data.formation_id ?? "non précisée")}</p>
       <p><strong>Type :</strong> ${escapeHtml(parsed.data.type_formation)} · <strong>Niveau :</strong> ${escapeHtml(parsed.data.niveau)} · <strong>Durée :</strong> ${escapeHtml(parsed.data.duree)}</p>
       <p>${parsed.data.message ? escapeHtml(parsed.data.message).replace(/\n/g, "<br/>") : ""}</p>`,
    ),
  ]);

  return NextResponse.json({ ok: true });
}
