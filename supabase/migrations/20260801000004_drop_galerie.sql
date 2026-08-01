-- ============================================================
-- EFES « SAPIENTIA » — Suppression de la galerie
-- Migration : 20260801000004_drop_galerie.sql
-- ============================================================
--
-- La galerie ne sert plus : on supprime la table `galerie_items`
-- et les enums associés (`galerie_type`, `galerie_categorie`).
-- Idempotent : ré-exécutable sans effet si les objets n'existent plus.
--
-- PROCÉDURE : exécutez ce script dans le SQL Editor du dashboard Supabase.
-- ============================================================

-- 1. Policies RLS (indépendantes de la table) puis table elle-même.
alter table public.galerie_items disable row level security;
drop policy if exists "lecture publique galerie" on public.galerie_items;
drop policy if exists "admin galerie" on public.galerie_items;
drop table if exists public.galerie_items;

-- 2. Enums devenus orphelins.
drop type if exists public.galerie_type;
drop type if exists public.galerie_categorie;
