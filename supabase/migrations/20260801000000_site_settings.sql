-- ============================================================
-- EFES « SAPIENTIA » — Paramètres du site éditables depuis l'admin
-- Migration : 20260801000000_site_settings.sql
-- ============================================================
--
-- Crée une table générique `site_settings` (clé primaire simple, valeur JSONB).
-- Chaque ligne = une section de configuration (identity, socials, stats, nav, logo).
-- Les valeurs sont stockées en JSONB pour rester souples (listes dynamiques).
--
-- RLS :
--   - Lecture publique (front + anon) : SELECT pour tous
--   - Écriture réservée aux ADMIN (is_admin())
--
-- SEED : insère les valeurs actuelles (hardcodées dans lib/site.ts) pour que
-- le site reste identique avant toute édition depuis /admin/parametres.
--
-- PROCÉDURE : exécutez ce script dans le SQL Editor du dashboard Supabase.
-- Idempotent : ré-exécutable sans effet si les lignes existent déjà.
-- ============================================================

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Lecture publique (front anonyme + authentifié)
drop policy if exists "lecture publique site settings" on public.site_settings;
create policy "lecture publique site settings" on public.site_settings
  for select using (true);

-- Écriture admin uniquement
drop policy if exists "admin site settings" on public.site_settings;
create policy "admin site settings" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- updated_at géré côté app ; pas de trigger nécessaire.

-- ============================================================
-- SEED — valeurs canoniques (match lib/site-defaults.ts)
-- ============================================================

insert into public.site_settings (key, value) values
  ('identity', '{"name":"EFES SAPIENTIA","shortName":"SAPIENTIA","subtitle":"L''excellence dans la formation des enseignants","email":"efesapientia@yahoo.fr","phones":["+229 0160600376","+229 06060385","+229 95428013","+229 06060372"],"address":"Porto-Novo, Bénin","whatsapp":"229016000376"}'::jsonb)
on conflict (key) do nothing;

insert into public.site_settings (key, value) values
  ('socials', '{"facebook":"https://facebook.com","instagram":"https://instagram.com","linkedin":"https://linkedin.com","youtube":"https://youtube.com"}'::jsonb)
on conflict (key) do nothing;

insert into public.site_settings (key, value) values
  ('stats', '[{"value":"+500","label":"Étudiants formés","icon":"student"},{"value":"+100","label":"Formateurs qualifiés","icon":"graduation"},{"value":"20+","label":"Programmes de formation","icon":"book"},{"value":"2","label":"Sites actuels","sublabel":"(Porto-Novo, Parakou)","icon":"map"},{"value":"2","label":"Nouveaux sites en cours","sublabel":"(Savè, Calavi)","icon":"pin"}]'::jsonb)
on conflict (key) do nothing;

insert into public.site_settings (key, value) values
  ('nav', '[{"label":"Accueil","href":"/"},{"label":"Qui sommes-nous","href":"/qui-sommes-nous"},{"label":"Nos formations","href":"/formations"},{"label":"Formation à distance","href":"/formation-distance"},{"label":"Formation en présentiel","href":"/formation-presentiel"},{"label":"Actualités","href":"/actualites"},{"label":"Galerie","href":"/galerie"},{"label":"Contact","href":"/contact"}]'::jsonb)
on conflict (key) do nothing;

insert into public.site_settings (key, value) values
  ('logo', '{"imageUrl":"/logo.jpeg","alt":"EFES SAPIENTIA","text":"EFES SAPIENTIA","subtitle":"Établissement privé de formation des enseignants"}'::jsonb)
on conflict (key) do nothing;

-- 'Exécutez dans le SQL Editor Supabase. Les valeurs par défaut sont déjà en place.';
