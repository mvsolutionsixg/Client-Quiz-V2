-- Run this script in your Supabase SQL Editor to update the database

-- 1. Add company_name column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS company_name text NOT NULL DEFAULT 'N/A';

-- 2. Update RLS policies to allow access to company_name
-- (Existing policies often cover all columns, but we ensure here)

-- Ensure the insert policy allows the new column (if specific columns were restricted, which is rare for 'using (true)')
-- Re-applying the policy isn't needed if it was simple "FOR INSERT TO anon USING (true)". 
-- But it's good practice to verify.

-- Note: If you have strict column-level security, you might need to adjust. 
-- The default setup in this project seems to use row-level policies which apply to the whole row.

COMMENT ON COLUMN public.users.company_name IS 'Company Name of the user';
