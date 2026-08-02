-- ============================================================
-- EFES-SAPIENTIA — Champ « Type de formation » sur les inscriptions
-- Migration : 20260801000005_inscription_type_formation.sql
-- ============================================================
--
-- Ajoute une colonne `type_formation` à `demandes_inscription` pour
-- mémoriser le mode choisi par le candidat à l'étape 1 du formulaire
-- d'inscription (Présentiel ou E-learning). Reprend les mêmes valeurs
-- que `demandes_devis.type_formation` (texte libre, mais l'app envoie
-- 'PRESENTIEL' ou 'DISTANCE').
--
-- Idempotent : ré-exécutable sans effet si la colonne existe déjà.
-- ============================================================

alter table public.demandes_inscription
  add column if not exists type_formation text;

comment on column public.demandes_inscription.type_formation is
  'Mode de formation choisi par le candidat : PRESENTIEL ou DISTANCE.';
