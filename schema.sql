-- 1. Create Users Table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  company_name text not null default 'N/A',
  email text,
  created_at timestamp default now()
);

-- 2. Create Responses Table
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  yes_count integer not null,
  no_count integer not null,
  answers json not null,
  created_at timestamp default now()
);

-- 3. Enable RLS
alter table public.users enable row level security;
alter table public.responses enable row level security;

-- 4. Create Policies
-- Note: 'create policy if not exists' requires Postgres 10+ (Supabase uses 15+)
do $$ 
begin
  if not exists (select from pg_policies where policyname = 'Allow anon insert users') then
    create policy "Allow anon insert users" on public.users for insert to anon using (true);
  end if;
  
  if not exists (select from pg_policies where policyname = 'Allow anon insert responses') then
    create policy "Allow anon insert responses" on public.responses for insert to anon using (true);
  end if;

  if not exists (select from pg_policies where policyname = 'Enable read access for all users') then
      create policy "Enable read access for all users" on public.users for select using (true);
  end if;
end $$;
