-- ============================================================
-- EFES « SAPIENTIA » — Schéma initial (migration Supabase)
-- ============================================================

-- Activer les extensions nécessaires
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- Enums
-- ============================================================
create type user_role as enum ('ADMIN', 'ETUDIANT', 'ENSEIGNANT');
create type formation_type as enum ('PRESENTIEL', 'DISTANCE', 'LES_DEUX');
create type actualite_type as enum ('EVENEMENT', 'SEMINAIRE', 'CONCOURS', 'PARTENARIAT', 'NOUVELLE_FORMATION', 'COMMUNIQUE');
create type galerie_type as enum ('PHOTO', 'VIDEO');
create type galerie_categorie as enum ('CAMPUS', 'PEDAGOGIQUE', 'DIPLOMES');
create type demande_statut as enum ('EN_ATTENTE', 'TRAITEE', 'REFUSEE');

-- ============================================================
-- Table : profiles (lié à auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'ETUDIANT',
  name text,
  telephone text,
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Tables de contenu
-- ============================================================
create table if not exists public.formations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titre text not null,
  description text,
  objectifs text,
  debouches text,
  conditions_admission text,
  modalites_inscription text,
  type formation_type not null default 'LES_DEUX',
  icone text,
  ordre int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.actualites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titre text not null,
  extrait text,
  contenu text,
  image_url text,
  date date not null default current_date,
  type actualite_type not null default 'COMMUNIQUE',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.galerie_items (
  id uuid primary key default gen_random_uuid(),
  titre text,
  type galerie_type not null default 'PHOTO',
  url text not null,
  vignette_url text,
  categorie galerie_categorie not null default 'CAMPUS',
  date date not null default current_date,
  ordre int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.temoignages (
  id uuid primary key default gen_random_uuid(),
  auteur text not null,
  role text,
  contenu text not null,
  photo_url text,
  ordre int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.partenaires (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  logo_url text,
  url text,
  ordre int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.campus (
  id uuid primary key default gen_random_uuid(),
  ville text not null,
  adresse text,
  telephone text,
  email text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  image_url text,
  description text,
  ordre int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Tables de demandes (soumises par le public)
-- ============================================================
create table if not exists public.demandes_inscription (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid references public.formations(id) on delete set null,
  nom text not null,
  prenom text not null,
  email text not null,
  telephone text,
  date_naissance date,
  adresse text,
  niveau text,
  documents_paths text[] default '{}',
  statut demande_statut not null default 'EN_ATTENTE',
  note_admin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demandes_devis (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid references public.formations(id) on delete set null,
  type_formation text not null,
  niveau text,
  duree text,
  nom text not null,
  email text not null,
  telephone text,
  message text,
  statut demande_statut not null default 'EN_ATTENTE',
  note_admin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text not null,
  sujet text,
  message text not null,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  desinscrit boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Trigger : créer un profil automatiquement à l'inscription
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Index utiles
-- ============================================================
create index if not exists idx_formations_ordre on public.formations(ordre);
create index if not exists idx_actualites_date on public.actualites(date desc);
create index if not exists idx_demandes_inscription_statut on public.demandes_inscription(statut);
create index if not exists idx_demandes_devis_statut on public.demandes_devis(statut);
create index if not exists idx_contact_messages_lu on public.contact_messages(lu);
