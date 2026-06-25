-- ============================================================
--  Aline & Julie · 30 ans — Schéma Supabase
--  À coller dans : Supabase → votre projet → SQL Editor → New query → Run
-- ============================================================

-- 1) RSVP (réponses à l'invitation)
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  presence text not null,            -- 'oui' ou 'non'
  diet text,
  message text,
  created_at timestamptz not null default now()
);

-- 2) Livre d'or
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  created_at timestamptz not null default now()
);

-- 3) Mur de photos (métadonnées ; les fichiers vont dans le Storage)
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  author text not null default 'Invité·e',
  label text,
  tag text default 'en direct',
  url text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
--  Sécurité (RLS) — site d'invitation public
-- ============================================================
alter table public.rsvps enable row level security;
alter table public.guestbook enable row level security;
alter table public.photos enable row level security;

-- RSVP : tout le monde peut envoyer sa réponse, mais PERSONNE ne peut les lire
-- publiquement (vous les consultez dans le tableau Supabase). Plus privé.
drop policy if exists "rsvps insert public" on public.rsvps;
create policy "rsvps insert public" on public.rsvps
  for insert to anon with check (true);

-- Livre d'or : lecture + écriture publiques
drop policy if exists "guestbook read public" on public.guestbook;
create policy "guestbook read public" on public.guestbook
  for select to anon using (true);
drop policy if exists "guestbook insert public" on public.guestbook;
create policy "guestbook insert public" on public.guestbook
  for insert to anon with check (true);

-- Mur de photos : lecture + écriture publiques
drop policy if exists "photos read public" on public.photos;
create policy "photos read public" on public.photos
  for select to anon using (true);
drop policy if exists "photos insert public" on public.photos;
create policy "photos insert public" on public.photos
  for insert to anon with check (true);

-- ============================================================
--  Storage : bucket "photos" pour les fichiers du mur de photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Lecture publique des fichiers + upload public
drop policy if exists "photos bucket read" on storage.objects;
create policy "photos bucket read" on storage.objects
  for select to anon using (bucket_id = 'photos');
drop policy if exists "photos bucket insert" on storage.objects;
create policy "photos bucket insert" on storage.objects
  for insert to anon with check (bucket_id = 'photos');
