import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/api-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Upload d'un fichier (image back-office) vers le bucket « medias » via la
 * service role key côté serveur. Le navigateur admin n'a jamais la clé.
 *
 * Reçoit : FormData { file, bucket?, path? }
 * Renvoie : { url } (URL publique du fichier).
 */
export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "FormData attendu" }, { status: 400 });
  }

  const file = form.get("file");
  const bucket = (form.get("bucket") as string) || "medias";
  const sub = (form.get("path") as string) || "";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  const client = createAdminClient();
  if (!client) {
    return NextResponse.json(
      { error: "Client admin indisponible : SUPABASE_SERVICE_ROLE_KEY manquante" },
      { status: 503 },
    );
  }

  // Construit un chemin propre et unique.
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const prefix = sub ? `${sub.replace(/^\/+|\/+$/g, "")}/` : "";
  const path = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

  const { error } = await client.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
      contentType: file.type || undefined,
      cacheControl: "3600",
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
