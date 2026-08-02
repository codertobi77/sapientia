-- ============================================================
-- EFES-SAPIENTIA — Correctif production :
--   1. Ajoute la colonne demandes_inscription.type_formation (manquante en prod)
--      -> corrige l'erreur 42703 "column demandes_inscription.type_formation
--         does not exist" sur /admin (liste des inscriptions).
--   2. Met à jour le libellé de nav "Qui sommes-nous" -> "Qui sommes-nous ?"
--      dans site_settings (la ligne avait été seedée avant l'ajout du « ? »,
--      et on conflict do nothing ne la mettait pas à jour).
-- Migration : 20260802000001_fix_type_formation_and_nav_label.sql
-- ============================================================
-- Idempotent : ré-exécutable sans effet si déjà appliqué.
-- À exécuter dans le SQL Editor du dashboard Supabase (projet de production).
-- ============================================================

-- 1) Colonne type_formation sur demandes_inscription
alter table public.demandes_inscription
  add column if not exists type_formation text;

comment on column public.demandes_inscription.type_formation is
  'Mode de formation choisi par le candidat : PRESENTIEL ou DISTANCE.';

-- 2) Libellé de nav "Qui sommes-nous ?" (avec le point d'interrogation).
--    On reconstruit le tableau en remplaçant uniquement le label de l'entrée
--    /qui-sommes-nous quand il vaut encore "Qui sommes-nous" (sans écraser
--    une nav déjà personnalisée par l'admin).
update public.site_settings
  set value = (
    select coalesce(jsonb_agg(
      case
        when el #>> '{href}' = '/qui-sommes-nous' and el #>> '{label}' = 'Qui sommes-nous'
          then jsonb_set(el, '{label}', '"Qui sommes-nous ?"', true)
        else el
      end
    ), '[]'::jsonb)
    from jsonb_array_elements(value) as el
  )
  where key = 'nav'
    and exists (
      select 1
      from jsonb_array_elements(value) as el
      where el #>> '{href}' = '/qui-sommes-nous'
        and el #>> '{label}' = 'Qui sommes-nous'
    );

update public.site_settings
  set updated_at = now()
  where key = 'nav'
    and exists (
      select 1
      from jsonb_array_elements(value) as el
      where el #>> '{href}' = '/qui-sommes-nous'
        and el #>> '{label}' = 'Qui sommes-nous ?'
    );
