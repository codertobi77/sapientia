import { requireAdminOrRedirect } from "@/lib/auth-admin";
import { getSettingsAdmin } from "@/lib/data-admin-settings";
import { PageHeader } from "@/components/blocks/admin/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SettingsIdentityForm } from "@/components/blocks/admin/forms/settings-identity-form";
import { SettingsSocialsForm } from "@/components/blocks/admin/forms/settings-socials-form";
import { SettingsStatsForm } from "@/components/blocks/admin/forms/settings-stats-form";
import { SettingsNavForm } from "@/components/blocks/admin/forms/settings-nav-form";
import { SettingsLogoForm } from "@/components/blocks/admin/forms/settings-logo-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Paramètres du site",
  description: "Identité, contacts, réseaux sociaux, chiffres clés, navigation et logo.",
};

/**
 * /admin/parametres — modules d'édition des paramètres globaux du site.
 * Chaque section (identity, socials, stats, nav, logo) a son formulaire client,
 * tous postent sur PATCH /api/admin/settings { section, value }.
 */
export default async function AdminParametresPage() {
  await requireAdminOrRedirect("/admin/parametres");
  const data = await getSettingsAdmin();

  return (
    <section className="space-y-6">
      <PageHeader
        title="Paramètres du site"
        description="Modifiez l'identité, les contacts, les réseaux sociaux, les chiffres clés, le menu et le logo. Les changements sont appliqués immédiatement sur le site public."
      />

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="flex-wrap">
          <TabsTrigger value="identity">Identité & contacts</TabsTrigger>
          <TabsTrigger value="socials">Réseaux sociaux</TabsTrigger>
          <TabsTrigger value="stats">Chiffres clés</TabsTrigger>
          <TabsTrigger value="nav">Menu de navigation</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="identity">
          <SettingsIdentityForm initial={data.identity} />
        </TabsContent>
        <TabsContent value="socials">
          <SettingsSocialsForm initial={data.socials} />
        </TabsContent>
        <TabsContent value="stats">
          <SettingsStatsForm initial={data.stats} />
        </TabsContent>
        <TabsContent value="nav">
          <SettingsNavForm initial={data.nav} />
        </TabsContent>
        <TabsContent value="logo">
          <SettingsLogoForm initial={data.logo} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
