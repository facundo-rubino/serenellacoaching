create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(trim(full_name)) > 0),
  phone text,
  email text,
  city text,
  area text,
  country text default 'AR',
  birth_date date,
  referral_source text check (referral_source in
    ('recomendacion','instagram','facebook','google','sitio_web','otro')),
  referred_by uuid references public.clients(id) on delete set null,
  first_visit_date date,
  consent_at timestamptz,
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_name_idx on public.clients (lower(full_name));
create index clients_city_idx on public.clients (city);

create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

alter table public.clients enable row level security;

create policy "Admins read clients" on public.clients
for select to authenticated using (public.is_admin());

create policy "Admins insert clients" on public.clients
for insert to authenticated with check (public.is_admin());

create policy "Admins update clients" on public.clients
for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins delete clients" on public.clients
for delete to authenticated using (public.is_admin());

revoke all on public.clients from anon;
