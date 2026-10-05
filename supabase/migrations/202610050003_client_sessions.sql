create table public.client_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  therapy_id uuid references public.content_items(id) on delete set null,
  therapy_label text,
  session_date date not null default current_date,
  modality text not null default 'presencial' check (modality in ('presencial','online')),
  amount numeric(10,2),
  paid boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index client_sessions_client_idx on public.client_sessions (client_id, session_date desc);
create index client_sessions_date_idx on public.client_sessions (session_date desc);

create trigger client_sessions_set_updated_at
before update on public.client_sessions
for each row execute function public.set_updated_at();

alter table public.client_sessions enable row level security;

create policy "Admins read client sessions" on public.client_sessions
for select to authenticated using (public.is_admin());

create policy "Admins insert client sessions" on public.client_sessions
for insert to authenticated with check (public.is_admin());

create policy "Admins update client sessions" on public.client_sessions
for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins delete client sessions" on public.client_sessions
for delete to authenticated using (public.is_admin());

revoke all on public.client_sessions from anon;

create view public.client_summary with (security_invoker = true) as
select c.id as client_id,
       coalesce(least(c.first_visit_date, min(s.session_date)), c.first_visit_date, min(s.session_date)) as first_visit,
       max(s.session_date) as last_visit,
       count(s.id) as sessions_count,
       current_date - max(s.session_date) as days_since_last
from public.clients c
left join public.client_sessions s on s.client_id = c.id
group by c.id;

revoke all on public.client_summary from anon;
