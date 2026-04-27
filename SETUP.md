# RunForge Setup

Supabase Auth + Database · Strava Sync · GPS · Light/Dark

## Setup steps

1. **Supabase**: supabase.com → New project → Copy URL + anon key into `src/config.js`
2. Run the SQL schema below in the Supabase SQL Editor
3. **Strava**: developers.strava.com → Create API app → Set callback to `https://YOUR_USER.github.io/runforge` → Copy Client ID into `src/config.js`
4. **Cloudflare Worker**: Deploy the token exchange worker, set `STRAVA_TOKEN_WORKER_URL` in `src/config.js`
5. `npm install` → `npm run deploy`

## Supabase SQL schema

```sql
-- Profiles (auto-created on signup)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for all using (auth.uid() = id);

-- Training plans
create table public.plans (
  id text not null,
  user_id uuid references auth.users on delete cascade not null,
  data jsonb not null,
  updated_at timestamptz default now(),
  primary key (id, user_id)
);
alter table public.plans enable row level security;
create policy "Users own plans" on public.plans
  for all using (auth.uid() = user_id);

-- Runs
create table public.runs (
  id bigint not null,
  user_id uuid references auth.users on delete cascade not null,
  data jsonb not null,
  date timestamptz,
  primary key (id, user_id)
);
alter table public.runs enable row level security;
create policy "Users own runs" on public.runs
  for all using (auth.uid() = user_id);

-- Completed workouts
create table public.progress (
  user_id uuid references auth.users on delete cascade primary key,
  completed jsonb default '[]'::jsonb
);
alter table public.progress enable row level security;
create policy "Users own progress" on public.progress
  for all using (auth.uid() = user_id);

-- Strava integration tokens
create table public.integrations (
  user_id uuid references auth.users on delete cascade primary key,
  strava jsonb
);
alter table public.integrations enable row level security;
create policy "Users own integrations" on public.integrations
  for all using (auth.uid() = user_id);
```
