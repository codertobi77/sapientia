-- ============================================================
-- Migration : `identity.phone` (string) → `identity.phones` (array)
-- ============================================================
-- Le schéma éditable `site_settings` stockait le téléphone comme une simple
-- chaîne (`phone: "+229 A / +229 B"`). On passe à un tableau de numéros
-- (`phones: ["+229 A", "+229 B"]`) pour une édition multi-numéros dans
-- /admin/parametres.
--
-- Cette migration transforme, de façon idempotente, toute ligne d'identité
-- existante qui a encore une clé `phone` mais pas de `phones`. La clé `phone`
-- est ensuite retirée du document JSON. Si `phone` est vide, on crée un
-- tableau vide (l'application retombera alors sur DEFAULT_IDENTITY.phones).
--
-- Note : `lib/settings.ts` est aussi tolérant (normalizePhones) donc le site
-- fonctionne même si cette migration n'est pas exécutée ; cette étape garantit
-- juste un état propre en base.
-- ============================================================

with src as (
  select
    key,
    value,
    value ->> 'phone' as old_phone
  from public.site_settings
  where key = 'identity'
    and value ? 'phone'
    and not (value ? 'phones')
),
-- Découpe sur '/' puis ',' (l'ancien format utilisait '/'), trim, non vide.
parts as (
  select
    s.key,
    trim(both from split_part(s.old_phone, sep.n, idx.n)) as part
  from src s
  cross join (values ('/'), (',')) as sep(n)
  cross join lateral generate_series(
    1,
    coalesce(array_length(string_to_array(s.old_phone, sep.n), 1), 0)
  ) as idx(n)
  where s.old_phone is not null
    and trim(both from split_part(s.old_phone, sep.n, idx.n)) <> ''
),
agg as (
  select
    p.key,
    coalesce(jsonb_agg(to_jsonb(p.part)), '[]'::jsonb) as phones_json
  from parts p
  group by p.key
)
update public.site_settings ss
set value = jsonb_set(ss.value - 'phone', '{phones}', a.phones_json)
from agg a
where ss.key = a.key;
