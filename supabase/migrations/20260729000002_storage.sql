-- ============================================================
-- EFES-SAPIENTIA — Stockage des pièces d'inscription
-- ============================================================
-- Bucket public pour les documents téléversés par les candidats
-- lors de l'inscription en ligne (pièces justificatives).

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Lecture publique des fichiers (les pièces sont acessibles par lien).
drop policy if exists "documents_read" on storage.objects;
create policy "documents_read"
  on storage.objects for select
  using (bucket_id = 'documents');

-- Insertion publique : un visiteur peut téléverser ses pièces pour
-- constituer son dossier d'inscription (sans authentification).
drop policy if exists "documents_insert" on storage.objects;
create policy "documents_insert"
  on storage.objects for insert
  with check (bucket_id = 'documents');
