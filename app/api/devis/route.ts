import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { devisSchema } from "@/lib/validators";
import { notifyAdmin } from "@/lib/mail";

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

  await notifyAdmin(
    "Nouvelle demande de devis",
    `<p><strong>${parsed.data.nom}</strong> (${parsed.data.email} — ${parsed.data.telephone ?? "—"})</p>
     <p><strong>Formation :</strong> ${parsed.data.formation_id ?? "non précisée"}</p>
     <p><strong>Type :</strong> ${parsed.data.type_formation} · <strong>Niveau :</strong> ${parsed.data.niveau} · <strong>Durée :</strong> ${parsed.data.duree}</p>
     <p>${parsed.data.message?.replace(/\n/g, "<br/>") ?? ""}</p>`,
  );

  return NextResponse.json({ ok: true });
}
