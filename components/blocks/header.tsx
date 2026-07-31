import { getSettings } from "@/lib/settings";
import { ClientHeader } from "@/components/blocks/client-header";

/**
 * En-tête public (Server Component asynchrone).
 * Lit les paramètres du site (identité, nav, réseaux, logo) via lib/settings
 * (cache unstable_cache tag "site-settings") puis délègue l'interactivité
 * (scroll, menu mobile, route active) au ClientHeader.
 */
export async function Header() {
  const { identity, nav, socialLinks, logo } = await getSettings();
  return (
    <ClientHeader
      identity={identity}
      nav={nav}
      socialLinks={socialLinks}
      logo={logo}
    />
  );
}
