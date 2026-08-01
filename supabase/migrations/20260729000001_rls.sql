-- ============================================================
-- EFES « SAPIENTIA » — Row Level Security
-- ============================================================

-- Active RLS sur toutes les tables publiques
alter table public.profiles enable row level security;
alter table public.formations enable row level security;
alter table public.actualites enable row level security;
alter table public.temoignages enable row level security;
alter table public.partenaires enable row level security;
alter table public.campus enable row level security;
alter table public.demandes_inscription enable row level security;
alter table public.demandes_devis enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Helper : vérifie que l'utilisateur courant est admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN' and actif = true
  );
$$;

-- ============================================================
-- Contenu public : lecture ouverte à tous (anon + auth)
-- ============================================================
create policy "lecture publique formations" on public.formations
  for select using (true);
create policy "lecture publique actualites" on public.actualites
  for select using (true);
create policy "lecture publique temoignages" on public.temoignages
  for select using (true);
create policy "lecture publique partenaires" on public.partenaires
  for select using (true);
create policy "lecture publique campus" on public.campus
  for select using (true);

-- ============================================================
-- Demandes publiques : insert autorisé à tous (formulaire public)
-- ============================================================
create policy "insert public demandes inscription" on public.demandes_inscription
  for insert with check (true);
create policy "insert public demandes devis" on public.demandes_devis
  for insert with check (true);
create policy "insert public contact" on public.contact_messages
  for insert with check (true);
create policy "insert public newsletter" on public.newsletter_subscribers
  for insert with check (true);

-- ============================================================
-- Profils : chaque utilisateur lit/édite son propre profil
-- ============================================================
create policy "lecture propre profil" on public.profiles
  for select using (auth.uid() = id);
create policy "edition propre profil" on public.profiles
  for update using (auth.uid() = id);

-- ============================================================
-- Admin : lecture + écriture sur tout le contenu et les demandes
-- ============================================================
create policy "admin formations" on public.formations
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin actualites" on public.actualites
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin temoignages" on public.temoignages
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin partenaires" on public.partenaires
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin campus" on public.campus
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin demandes inscription" on public.demandes_inscription
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin demandes devis" on public.demandes_devis
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin contact messages" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin newsletter" on public.newsletter_subscribers
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin profiles" on public.profiles
  for select using (public.is_admin());
create policy "admin update profiles" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());
