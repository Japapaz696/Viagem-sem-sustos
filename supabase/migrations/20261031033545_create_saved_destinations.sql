create table if not exists public.saved_destinations (
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  country_id text not null check (country_id ~ '^[a-z]{2}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, country_id)
);

alter table public.saved_destinations enable row level security;

revoke all on table public.saved_destinations from anon, authenticated;
grant select, insert, delete on table public.saved_destinations to authenticated;

drop policy if exists "Users can read their saved destinations" on public.saved_destinations;
drop policy if exists "Users can save their own destinations" on public.saved_destinations;
drop policy if exists "Users can remove their own saved destinations" on public.saved_destinations;

create policy "Users can read their saved destinations"
  on public.saved_destinations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can save their own destinations"
  on public.saved_destinations
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own saved destinations"
  on public.saved_destinations
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
