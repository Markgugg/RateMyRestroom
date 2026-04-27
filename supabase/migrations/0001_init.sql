-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── schools ────────────────────────────────────────────────────────────────
create table public.schools (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  slug       text not null unique,
  city       text not null,
  state      text not null,
  domain     text,
  logo_url   text
);

alter table public.schools enable row level security;
create policy "schools: public read" on public.schools for select using (true);

-- ─── restrooms ──────────────────────────────────────────────────────────────
create table public.restrooms (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  school_id   uuid not null references public.schools(id) on delete cascade,
  building    text not null,
  floor       text not null,
  gender      text not null check (gender in ('men','women','all-gender','family')),
  description text,
  photo_url   text
);

alter table public.restrooms enable row level security;
create policy "restrooms: public read" on public.restrooms for select using (true);

-- ─── profiles ───────────────────────────────────────────────────────────────
create table public.profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  display_name text not null,
  school_id    uuid references public.schools(id),
  edu_verified boolean not null default false
);

alter table public.profiles enable row level security;
create policy "profiles: owner read/write" on public.profiles
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Public read of display_name only
create view public.profile_names as
  select user_id, display_name from public.profiles;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, display_name, edu_verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    (split_part(new.email, '@', 2) like '%.edu')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── reviews ────────────────────────────────────────────────────────────────
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  restroom_id  uuid not null references public.restrooms(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  cleanliness  smallint not null check (cleanliness between 1 and 5),
  privacy      smallint not null check (privacy between 1 and 5),
  amenities    smallint not null check (amenities between 1 and 5),
  body         text not null,
  unique (restroom_id, user_id)
);

alter table public.reviews enable row level security;
create policy "reviews: public read" on public.reviews for select using (true);
create policy "reviews: authed+verified insert" on public.reviews for insert
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.profiles
      where user_id = auth.uid() and edu_verified = true
    )
  );
create policy "reviews: author update/delete" on public.reviews
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Aggregate view: average ratings per restroom
create view public.restroom_ratings as
  select
    restroom_id,
    count(*)                                  as review_count,
    round(avg(cleanliness)::numeric, 1)       as avg_cleanliness,
    round(avg(privacy)::numeric, 1)           as avg_privacy,
    round(avg(amenities)::numeric, 1)         as avg_amenities,
    round(((avg(cleanliness) + avg(privacy) + avg(amenities)) / 3)::numeric, 1) as avg_overall
  from public.reviews
  group by restroom_id;

-- ─── forum_threads ───────────────────────────────────────────────────────────
create table public.forum_threads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  school_id  uuid not null references public.schools(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  body       text not null
);

alter table public.forum_threads enable row level security;
create policy "threads: public read" on public.forum_threads for select using (true);
create policy "threads: authed+verified insert" on public.forum_threads for insert
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.profiles
      where user_id = auth.uid() and edu_verified = true
    )
  );
create policy "threads: author update/delete" on public.forum_threads
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── forum_replies ───────────────────────────────────────────────────────────
create table public.forum_replies (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  thread_id  uuid not null references public.forum_threads(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  body       text not null
);

alter table public.forum_replies enable row level security;
create policy "replies: public read" on public.forum_replies for select using (true);
create policy "replies: authed+verified insert" on public.forum_replies for insert
  with check (
    auth.uid() is not null
    and exists (
      select 1 from public.profiles
      where user_id = auth.uid() and edu_verified = true
    )
  );
create policy "replies: author update/delete" on public.forum_replies
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
