import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// Expéditeur (from) utilisé pour tous les envois Resend.
// IMPORTANT : Resend n'autorise que les domaines vérifiés. Avant d'avoir
// vérifié votre propre domaine (ex: efes-sapientia.bj) dans le dashboard
// Resend, vous pouvez utiliser l'adresse de test fournie par Resend :
//   onboarding@resend.dev
// ⚠️ Avec onboarding@resend.dev, Resend livre UNIQUEMENT les e-mails à
// l'adresse e-mail associée à votre compte Resend. Tout envoi vers une
// autre adresse échouera silencieusement (erreur 422 / non autorisé).
// De plus, onboarding@resend.dev ne peut PAS envoyer vers @gmail.com etc.
// Une fois votre domaine vérifié, supprimez RESEND_FROM_EMAIL du .env
// pour retomber sur votre CONTACT_EMAIL brandé.
const FROM = process.env.RESEND_FROM_EMAIL ?? process.env.CONTACT_EMAIL ?? "onboarding@resend.dev";
const ADMIN = process.env.ADMIN_EMAIL ?? "admin@efes-sapientia.bj";

type SendArgs = { to: string | string[]; subject: string; html: string; replyTo?: string };

export async function sendMail({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    // En dev sans clé Resend, on logge pour faciliter les tests.
    if (process.env.NODE_ENV !== "production") {
      console.log("[mail] (mode dev — Resend non configuré)", { to, subject });
    }
    return false;
  }
  // Mode temporaire : si on utilise onboarding@resend.dev, Resend ne livre
  // qu'à l'e-mail du compte Resend. On le signale clairement en dev.
  if (process.env.NODE_ENV !== "production" && FROM === "onboarding@resend.dev") {
    console.warn(
      "[mail] Mode temporaire actif : from = onboarding@resend.dev. " +
        "Resend ne livrera QUE vers l'e-mail associé à votre compte Resend. " +
        "Vérifiez votre domaine dans le dashboard Resend puis retirez ce mode.",
    );
  }
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      replyTo: replyTo ?? (process.env.CONTACT_EMAIL ?? undefined),
    });
    return true;
  } catch (err) {
    console.error("[mail] erreur d'envoi", err);
    return false;
  }
}

export function notifyAdmin(subject: string, html: string) {
  return sendMail({ to: ADMIN, subject, html });
}

/**
 * Échappe les caractères HTML d'une chaîne pour éviter l'injection dans le
 * corps d'un e-mail (utilisé pour les valeurs saisies par l'utilisateur,
 * interpolées dans le HTML envoyé à l'admin ou au destinataire).
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&#38;")
    .replace(/</g, "&#60;")
    .replace(/>/g, "&#62;")
    .replace(/"/g, "&#34;")
    .replace(/'/g, "&#39;");
}

export function confirmationEmail(nom: string, contenuHtml: string) {
  const safeNom = escapeHtml(nom);
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6eaf0">
    <div style="background:#0A2345;padding:24px 32px;color:#fff">
      <p style="margin:0;font-size:20px;font-weight:700">EFES-SAPIENTIA</p>
      <p style="margin:4px 0 0;color:#d89a27;font-size:12px;letter-spacing:.1em;text-transform:uppercase">Établissement privé de formation des enseignants</p>
    </div>
    <div style="padding:32px;color:#0f172a;line-height:1.6">
      ${safeNom ? `<p>Bonjour ${safeNom},</p>` : ""}
      ${contenuHtml}
      <p style="margin-top:24px">Cordialement,<br/>L'équipe EFES-SAPIENTIA</p>
    </div>
    <div style="padding:16px 32px;background:#f8fafc;color:#64748b;font-size:12px;text-align:center">
      © ${new Date().getFullYear()} EFES-SAPIENTIA · Porto-Novo, Bénin
    </div>
  </div>`;
  return html;
}
