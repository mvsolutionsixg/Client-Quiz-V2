const { Client } = require('pg');

// Trying Direct Connection (Port 5432, db.project.supabase.co) instead of Pooler
// Project Ref: isvjqfwkylxukqvmxgsd
// Password: Br@1932002 (Encoded: Br%401932002)
const connectionString = 'postgresql://postgres:Br%401932002@db.isvjqfwkylxukqvmxgsd.supabase.co:5432/postgres';

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const initSQL = `
  -- 1. Create Tables
  create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    phone text not null,
    email text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  create table if not exists public.responses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id),
    yes_count integer not null,
    no_count integer not null,
    answers jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- 2. Enable RLS
  alter table public.users enable row level security;
  alter table public.responses enable row level security;

  -- 3. Create Policies
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
`;

async function run() {
    try {
        console.log('Connecting to database (Direct)...');
        await client.connect();
        console.log('Connected. Running Schema SQL...');
        await client.query(initSQL);
        console.log('Tables created successfully!');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await client.end();
    }
}

run();
