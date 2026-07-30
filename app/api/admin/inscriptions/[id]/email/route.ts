import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { getInscription } from "@/lib/data-admin-inbox";
import { sendMail } from "@/lib/mail";
import { buildAdminReply } from "@/components/emails/admin-reply";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const b = (body ?? null) as Record<string, unknown> | null;
  const objet = typeof b?.objet === "string" ? b.objet.trim() : "";
  const message = typeof b?.message === "string" ? b.message.trim() : "";

  if (!objet || !message) {
    return NextResponse.json(
      { error: "Objet et message requis" },
      { status: 400 },
    );
  }

  let inscription;
  try {
    inscription = await getInscription(id);
  } catch (err) {
    console.error("[admin/inscriptions/email] fetch error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
  if (!inscription) {
    return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
  }

  const { subject, html } = buildAdminReply({
    destinataire: `${inscription.prenom} ${inscription.nom}`,
    objet,
    message,
    contexte: "Demande d'inscription",
    reference: inscription.formation_titre ?? undefined,
  });

  const sent = await sendMail({
    to: inscription.email,
    subject,
    html,
    replyTo: process.env.CONTACT_EMAIL ?? undefined,
  });

  if (!sent) {
    return NextResponse.json(
      { error: "E-mail non envoyé (Resend non configuré ou erreur)" },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
