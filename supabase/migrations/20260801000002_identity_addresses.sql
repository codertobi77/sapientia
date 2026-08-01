-- ============================================================
-- Migration : `identity.address` (string) → `identity.addresses` (array)
-- ============================================================
-- Le schéma éditable `site_settings` stockait l'adresse comme une simple
-- chaîne (`address: "Porto-Novo, Bénin"`). On passe à un tableau d'adresses
-- (`addresses: ["Porto-Novo, Bénin"]`) pour une édition multi-adresses dans
-- /admin/parametres.
--
-- Cette migration transforme, de façon idempotente, toute ligne d'identité
-- existante qui a encore une clé `address` mais pas de `addresses`. L'ancienne
-- valeur (une adresse entière) devient l'unique élément du tableau. La clé
-- `address` est ensuite retirée du document JSON. Une chaîne vide/trognée
-- devient un tableau vide (l'application retombera alors sur
-- DEFAULT_IDENTITY.addresses).
--
-- Note : `lib/settings.ts` est aussi tolérant (normalizeAddresses) donc le
-- site fonctionne même si cette migration n'est pas exécutée ; cette étape
-- garantit juste un état propre en base.
-- ============================================================

with src as (
  select
    key,
    value,
    trim(both from (value ->> 'address')) as old_address
  from public.site_settings
  where key = 'identity'
    and value ? 'address'
    and not (value ? 'addresses')
),
-- Un tableau contenant l'ancienne adresse (si non vide), sinon tableau vide.
agg as (
  select
    s.key,
    case
      when s.old_address is null or s.old_address = '' then '[]'::jsonb
      else jsonb_build_array(s.old_address)
    end as addresses_json
  from src s
)
update public.site_settings ss
set value = jsonb_set(ss.value - 'address', '{addresses}', a.addresses_json)
from agg a
where ss.key = a.key;
