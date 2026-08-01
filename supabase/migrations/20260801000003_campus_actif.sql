-- ============================================================
-- Migration : colonne `actif` sur la table `campus`
-- ============================================================
-- Permet de distinguer les campus actifs (affichés publiquement, notamment
-- sur la page "Formation en présentiel") des sites futurs/non ouverts
-- (Savè, Abomey-Calavi). Le drapeau est éditable depuis /admin/campus.
--
-- Par défaut, tous les campus existants sont marqués `actif = true`. Les deux
-- sites non ouverts (Savè, Abomey-Calavi) sont ensuite désactivés.
-- ============================================================

alter table public.campus
  add column if not exists actif boolean not null default true;

-- Désactive les sites non ouverts (conservés en base pour édition future).
update public.campus set actif = false
  where lower(ville) in ('savè', 'save', 'abomey-calavi');
