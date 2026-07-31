import { Resend } from "resend";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.CONTACT_EMAIL ?? "noreply@efes-sapientia.bj";
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
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      replyTo,
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

export function confirmationEmail(nom: string, contenuHtml: string) {
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6eaf0">
    <div style="background:#0A2345;padding:24px 32px;color:#fff">
      <p style="margin:0;font-size:20px;font-weight:700">EFES « SAPIENTIA »</p>
      <p style="margin:4px 0 0;color:#d89a27;font-size:12px;letter-spacing:.1em;text-transform:uppercase">Établissement privé de formation des enseignants</p>
    </div>
    <div style="padding:32px;color:#0f172a;line-height:1.6">
      <p>Bonjour ${nom},</p>
      ${contenuHtml}
      <p style="margin-top:24px">Cordialement,<br/>L'équipe EFES « SAPIENTIA »</p>
    </div>
    <div style="padding:16px 32px;background:#f8fafc;color:#64748b;font-size:12px;text-align:center">
      © ${new Date().getFullYear()} EFES « SAPIENTIA » · Porto-Novo, Bénin
    </div>
  </div>`;
  return html;
}
