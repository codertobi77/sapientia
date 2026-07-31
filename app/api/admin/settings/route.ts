import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdminOrResponse, parseJson } from "@/lib/api-admin";
import {
  getSettingsAdmin,
  updateSettingsSection,
  type SettingsSection,
} from "@/lib/data-admin-settings";
import {
  settingsIdentitySchema,
  settingsSocialsSchema,
  settingsStatsSchema,
  settingsNavSchema,
  settingsLogoSchema,
} from "@/lib/validators";

export const dynamic = "force-dynamic";

// Schemas par section (clé => validateur Zod)
const SCHEMAS: Record<SettingsSection, unknown> = {
  identity: settingsIdentitySchema,
  socials: settingsSocialsSchema,
  stats: settingsStatsSchema,
  nav: settingsNavSchema,
  logo: settingsLogoSchema,
};

const SECTIONS = Object.keys(SCHEMAS) as SettingsSection[];

/** GET /api/admin/settings — renvoie toutes les sections (avec defaults). */
export async function GET() {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;
  try {
    const data = await getSettingsAdmin();
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur de lecture" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/settings
 * Body: { section: SettingsSection, value: unknown }
 * Valide `value` via le Zod schema de la section, upsert, puis revalidateTag.
 */
export async function PATCH(request: Request) {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  const { data, response } = await parseJson<{
    section: SettingsSection;
    value: unknown;
  }>(request);
  if (response) return response;
  if (!data || !data.section || !SECTIONS.includes(data.section)) {
    return NextResponse.json({ error: "Section invalide" }, { status: 400 });
  }

  const schema = SCHEMAS[data.section] as {
    safeParse: (v: unknown) => {
      success: boolean;
      data?: unknown;
      error?: { issues: { message: string }[] };
    };
  };
  const parsed = schema.safeParse(data.value);
  if (!parsed.success) {
    const msgs = parsed.error?.issues.map((i) => i.message).join(", ") ?? "Valeur invalide";
    return NextResponse.json({ error: msgs }, { status: 400 });
  }

  try {
    const updated = await updateSettingsSection(data.section, parsed.data);
    // Invalidation du cache public (lib/settings). Profil "max" : contenu stable
    // jusqu'à la prochaine édition manuelle.
    revalidateTag("site-settings", "max");
    return NextResponse.json({ data: updated });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur d'enregistrement" },
      { status: 500 },
    );
  }
}
