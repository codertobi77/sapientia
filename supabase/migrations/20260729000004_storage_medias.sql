-- ============================================================
-- EFES « SAPIENTIA » — Bucket Storage « medias » (back-office)
-- ============================================================
-- Bucket public SÉPARÉ de « documents » pour les images du back-office
-- (actualités, galerie, logos partenaires, photos témoignages, campus).
-- L'upload se fait via la route /api/admin/upload en utilisant la
-- service role key côté serveur (createAdminClient), qui bypass le RLS.
-- Aucune policy INSERT publique n'est définie : le navigateur admin
-- n'a jamais la service role key et ne peut donc écrire directement.

-- 1. Création du bucket public (idempotent)
insert into storage.buckets (id, name, public)
values ('medias', 'medias', true)
on conflict (id) do nothing;

-- 2. Lecture publique des fichiers du bucket medias (téléchargeables par URL).
drop policy if exists "medias_read" on storage.objects;
create policy "medias_read"
  on storage.objects for select
  using (bucket_id = 'medias');

-- 3. Écriture réservée au service role.
--    La service role key bypass le RLS, donc aucune policy INSERT/UPDATE/DELETE
--    publique n'est nécessaire. On définit tout de même une policy d'écriture
--    restreinte au service role pour rester explicite et défensive.
drop policy if exists "medias_write" on storage.objects;
create policy "medias_write"
  on storage.objects for all
  using (bucket_id = 'medias' and auth.role() = 'service_role')
  with check (bucket_id = 'medias' and auth.role() = 'service_role');
