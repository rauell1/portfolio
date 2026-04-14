-- ============================================================
-- Testimonials table
-- Run this in your Supabase SQL editor to create the table
-- and seed it with the initial data.
-- ============================================================

create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text not null,
  company     text not null,
  content     text not null,
  image       text,                        -- optional avatar URL
  rating      integer not null default 5 check (rating between 1 and 5),
  sort_order  integer,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- RLS: public read, no anonymous writes
alter table public.testimonials enable row level security;

create policy "Public read testimonials"
  on public.testimonials for select
  using (published = true);

-- ── Seed data (the four testimonials previously hard-coded) ──────────────────

insert into public.testimonials (name, role, company, content, rating, sort_order) values
  (
    'Dr. Sarah Kamau',
    'Director of Sustainability',
    'Kenya Power & Lighting',
    'Roy''s expertise in renewable energy systems is exceptional. His work on our solar microgrid project exceeded expectations, delivering both technical excellence and sustainable impact for rural communities.',
    5, 1
  ),
  (
    'James Mwangi',
    'CEO',
    'EVChaja Kenya',
    'Working with Roy on EV charging infrastructure has been transformative. His deep understanding of e-mobility and passion for sustainable transport makes him an invaluable partner in building Africa''s EV future.',
    5, 2
  ),
  (
    'Prof. Elizabeth Odhiambo',
    'Research Lead',
    'JKUAT Energy Institute',
    'Roy''s research contributions to solar-powered cold chain solutions have directly impacted smallholder farmers. His innovative approach combines technical rigor with real-world applicability.',
    5, 3
  ),
  (
    'David Njoroge',
    'Operations Manager',
    'Roam Electric',
    'Roy''s analytical skills and dedication to sustainable mobility are outstanding. He played a key role in our feasibility studies, identifying optimal locations for EV hub deployment.',
    5, 4
  )
on conflict do nothing;
