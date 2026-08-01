import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { inscriptionSchema } from "@/lib/validators";
import { sendMail, notifyAdmin, confirmationEmail, escapeHtml } from "@/lib/mail";
import { getFormationById } from "@/lib/data";

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const parsed = inscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("demandes_inscription").insert({
    formation_id: parsed.data.formation_id,
    nom: parsed.data.nom,
    prenom: parsed.data.prenom,
    email: parsed.data.email,
    telephone: parsed.data.telephone || null,
    date_naissance: parsed.data.date_naissance || null,
    adresse: parsed.data.adresse || null,
    niveau: parsed.data.niveau || null,
    documents_paths: parsed.data.documents_paths,
    statut: "EN_ATTENTE",
  });

  if (error) {
    return NextResponse.json({ error: "Erreur d'enregistrement" }, { status: 500 });
  }

  const formation = await getFormationById(parsed.data.formation_id);
  const formationTitre = formation?.titre ?? "formation choisie";

  const fTitre = escapeHtml(formationTitre);

  await Promise.all([
    sendMail({
      to: parsed.data.email,
      subject: "Confirmation de votre demande d'inscription — EFES « SAPIENTIA »",
      html: confirmationEmail(
        `${parsed.data.prenom} ${parsed.data.nom}`,
        `<p>Nous confirmons la bonne réception de votre demande d'inscription pour la formation
        <strong>${fTitre}</strong>.</p>
        <p>Notre équipe administrative va examiner votre dossier et reviendra vers vous par e-mail
        dans les meilleurs délais.</p>
        <p style="color:#64748b">Merci de votre confiance.</p>`,
      ),
    }),
    notifyAdmin(
      "Nouvelle demande d'inscription",
      `<p><strong>${escapeHtml(parsed.data.prenom)} ${escapeHtml(parsed.data.nom)}</strong> (${escapeHtml(parsed.data.email)} — ${escapeHtml(parsed.data.telephone ?? "—")})</p>
       <p><strong>Formation :</strong> ${fTitre}</p>
       <p><strong>Pièces :</strong> ${parsed.data.documents_paths.length} fichier(s) téléversé(s).</p>
       <p>Niveau : ${escapeHtml(parsed.data.niveau ?? "—")} · Date de naissance : ${escapeHtml(parsed.data.date_naissance ?? "—")}</p>`,
    ),
  ]);

  return NextResponse.json({ ok: true });
}
