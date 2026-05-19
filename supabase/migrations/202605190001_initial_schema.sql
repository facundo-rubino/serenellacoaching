create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'user' check (role in ('admin', 'editor', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)),
    case
      when new.raw_app_meta_data ->> 'role' = 'admin' then 'admin'
      when new.raw_app_meta_data ->> 'role' = 'editor' then 'editor'
      else 'user'
    end
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(public.profiles.display_name, excluded.display_name),
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'site-media',
  path text not null,
  public_url text not null,
  alt text not null default '',
  title text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('therapy', 'course')),
  slug text not null,
  title text not null,
  summary text not null,
  meta text,
  image_url text not null,
  image_alt text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);

create table if not exists public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.content_items(id) on delete cascade,
  block_type text not null check (block_type in ('paragraph', 'heading', 'image')),
  content text not null default '',
  image_url text,
  image_alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null,
  quote text not null,
  image_url text not null,
  image_alt text not null,
  source text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  seo_title text,
  seo_description text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  section_key text not null,
  eyebrow text,
  title text,
  accent text,
  body text,
  image_url text,
  image_alt text,
  cta_label text,
  cta_href text,
  settings jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, section_key)
);

create table if not exists public.site_settings (
  id boolean primary key default true,
  name text not null,
  title text not null,
  description text not null,
  analytics_id text,
  metadata_base text not null default 'https://serenellacoaching.com',
  logo_url text not null default '/assets/img/logo.png',
  favicon_url text not null default '/assets/img/favicon.ico',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_settings (
  id boolean primary key default true,
  email text not null,
  phone text not null,
  address text not null,
  map_embed_url text not null,
  form_url text not null,
  updated_at timestamptz not null default now(),
  constraint contact_settings_singleton check (id)
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  status text not null default 'published' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_items_public_idx on public.content_items (status, type, sort_order);
create index if not exists content_blocks_item_idx on public.content_blocks (item_id, sort_order);
create index if not exists reviews_public_idx on public.reviews (status, sort_order);
create index if not exists faq_items_public_idx on public.faq_items (status, sort_order);
create index if not exists page_sections_page_idx on public.page_sections (page_id, status, sort_order);
create index if not exists navigation_public_idx on public.navigation_items (status, sort_order);
create index if not exists social_links_public_idx on public.social_links (status, sort_order);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_media_assets_updated_at on public.media_assets;
create trigger set_media_assets_updated_at before update on public.media_assets
for each row execute function public.set_updated_at();

drop trigger if exists set_content_items_updated_at on public.content_items;
create trigger set_content_items_updated_at before update on public.content_items
for each row execute function public.set_updated_at();

drop trigger if exists set_content_blocks_updated_at on public.content_blocks;
create trigger set_content_blocks_updated_at before update on public.content_blocks
for each row execute function public.set_updated_at();

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at before update on public.reviews
for each row execute function public.set_updated_at();

drop trigger if exists set_faq_items_updated_at on public.faq_items;
create trigger set_faq_items_updated_at before update on public.faq_items
for each row execute function public.set_updated_at();

drop trigger if exists set_pages_updated_at on public.pages;
create trigger set_pages_updated_at before update on public.pages
for each row execute function public.set_updated_at();

drop trigger if exists set_page_sections_updated_at on public.page_sections;
create trigger set_page_sections_updated_at before update on public.page_sections
for each row execute function public.set_updated_at();

drop trigger if exists set_navigation_items_updated_at on public.navigation_items;
create trigger set_navigation_items_updated_at before update on public.navigation_items
for each row execute function public.set_updated_at();

drop trigger if exists set_social_links_updated_at on public.social_links;
create trigger set_social_links_updated_at before update on public.social_links
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.media_assets enable row level security;
alter table public.content_items enable row level security;
alter table public.content_blocks enable row level security;
alter table public.reviews enable row level security;
alter table public.faq_items enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.site_settings enable row level security;
alter table public.navigation_items enable row level security;
alter table public.contact_settings enable row level security;
alter table public.social_links enable row level security;

drop policy if exists "Users can read own profile or admins can read profiles" on public.profiles;
create policy "Users can read own profile or admins can read profiles"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published media assets are readable" on public.media_assets;
create policy "Published media assets are readable"
on public.media_assets for select to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage media assets" on public.media_assets;
create policy "Admins can manage media assets"
on public.media_assets for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published content items are readable" on public.content_items;
create policy "Published content items are readable"
on public.content_items for select to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage content items" on public.content_items;
create policy "Admins can manage content items"
on public.content_items for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published content blocks are readable" on public.content_blocks;
create policy "Published content blocks are readable"
on public.content_blocks for select to anon, authenticated
using (
  exists (
    select 1
    from public.content_items
    where public.content_items.id = content_blocks.item_id
      and (public.content_items.status = 'published' or public.is_admin())
  )
);

drop policy if exists "Admins can manage content blocks" on public.content_blocks;
create policy "Admins can manage content blocks"
on public.content_blocks for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published reviews are readable" on public.reviews;
create policy "Published reviews are readable"
on public.reviews for select to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage reviews" on public.reviews;
create policy "Admins can manage reviews"
on public.reviews for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published faq items are readable" on public.faq_items;
create policy "Published faq items are readable"
on public.faq_items for select to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage faq items" on public.faq_items;
create policy "Admins can manage faq items"
on public.faq_items for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published pages are readable" on public.pages;
create policy "Published pages are readable"
on public.pages for select to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage pages" on public.pages;
create policy "Admins can manage pages"
on public.pages for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published page sections are readable" on public.page_sections;
create policy "Published page sections are readable"
on public.page_sections for select to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.pages
    where public.pages.id = page_sections.page_id
      and public.pages.status = 'published'
  )
  or public.is_admin()
);

drop policy if exists "Admins can manage page sections" on public.page_sections;
create policy "Admins can manage page sections"
on public.page_sections for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Site settings are readable" on public.site_settings;
create policy "Site settings are readable"
on public.site_settings for select to anon, authenticated
using (true);

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
on public.site_settings for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published navigation is readable" on public.navigation_items;
create policy "Published navigation is readable"
on public.navigation_items for select to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage navigation" on public.navigation_items;
create policy "Admins can manage navigation"
on public.navigation_items for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Contact settings are readable" on public.contact_settings;
create policy "Contact settings are readable"
on public.contact_settings for select to anon, authenticated
using (true);

drop policy if exists "Admins can update contact settings" on public.contact_settings;
create policy "Admins can update contact settings"
on public.contact_settings for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Published social links are readable" on public.social_links;
create policy "Published social links are readable"
on public.social_links for select to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins can manage social links" on public.social_links;
create policy "Admins can manage social links"
on public.social_links for all to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site media" on storage.objects;
create policy "Public can read site media"
on storage.objects for select to anon, authenticated
using (bucket_id = 'site-media');

drop policy if exists "Admins can upload site media" on storage.objects;
create policy "Admins can upload site media"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can update site media" on storage.objects;
create policy "Admins can update site media"
on storage.objects for update to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can delete site media" on storage.objects;
create policy "Admins can delete site media"
on storage.objects for delete to authenticated
using (bucket_id = 'site-media' and public.is_admin());
