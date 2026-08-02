// Template d'e-mail administratif (réponse à une demande / message).
//
// Conception : on génère une CHAÎNE HTML (et non un arbre React Email rendu)
// pour rester cohérent avec lib/mail.ts qui n'accepte que `html: string` et
// qui ne dépend pas de @react-email/render dans le lockfile. Ceci évite une
// nouvelle dépendance lourde, conformément aux décisions phase 2.

export type AdminReplyInput = {
  /** Prénom ou nom du destinataire */
  destinataire: string;
  /** Objet affiché dans l'e-mail */
  objet: string;
  /** Corps du message (texte simple ; les \n deviennent <br/>) */
  message: string;
  /** Mention du contexte de la demande (optionnel) — ex: "Demande d'inscription" */
  contexte?: string;
  /** Référence (optionnel) — ex: numéro de la demande */
  reference?: string;
};

export function renderAdminReplyHTML(input: AdminReplyInput): string {
  const corps = escapeHtml(input.message).replace(/\n/g, "<br/>");
  const contexteBlock = input.contexte
    ? `<p style="color:#64748b;font-size:13px;margin:0 0 16px">Contexte : ${escapeHtml(input.contexte)}${input.reference ? ` · ${escapeHtml(input.reference)}` : ""}</p>`
    : "";
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e6eaf0">
    <div style="background:#0A2345;padding:24px 32px;color:#fff">
      <p style="margin:0;font-size:20px;font-weight:700">EFES-SAPIENTIA</p>
      <p style="margin:4px 0 0;color:#d89a27;font-size:12px;letter-spacing:.1em;text-transform:uppercase">Établissement privé de formation des enseignants</p>
    </div>
    <div style="padding:32px;color:#0f172a;line-height:1.6">
      <p style="margin-top:0">Bonjour ${escapeHtml(input.destinataire)},</p>
      ${contexteBlock}
      <div style="margin:0">${corps}</div>
      <p style="margin-top:24px">Cordialement,<br/>L'équipe administrative EFES-SAPIENTIA</p>
    </div>
    <div style="padding:16px 32px;background:#f8fafc;color:#64748b;font-size:12px;text-align:center">
      © ${new Date().getFullYear()} EFES-SAPIENTIA · Porto-Novo, Bénin
    </div>
  </div>`;
}

export function buildAdminReply(input: AdminReplyInput): {
  subject: string;
  html: string;
} {
  return {
    subject: `${input.objet} — EFES-SAPIENTIA`,
    html: renderAdminReplyHTML(input),
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&#38;")
    .replace(/</g, "&#60;")
    .replace(/>/g, "&#62;")
    .replace(/"/g, "&#34;")
    .replace(/'/g, "&#39;");
}
