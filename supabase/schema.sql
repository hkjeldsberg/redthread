-- Run this in Supabase SQL editor

create schema if not exists mens;

create table if not exists mens.profiles (
  id uuid references auth.users on delete cascade primary key,
  age int,
  has_given_birth boolean default false,
  cycle_length int default 28,
  period_length int default 5,
  other_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists mens.cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  start_date date not null,
  end_date date,
  notes text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table mens.profiles enable row level security;
alter table mens.cycles enable row level security;

create policy "Users can manage own profile"
  on mens.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can manage own cycles"
  on mens.cycles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Grants
grant usage on schema mens to anon, authenticated;
grant all on all tables in schema mens to authenticated;
grant all on all sequences in schema mens to authenticated;
alter default privileges in schema mens grant all on tables to authenticated;
alter default privileges in schema mens grant all on sequences to authenticated;

-- Auto-create profile on signup
create or replace function mens.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into mens.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure mens.handle_new_user();
