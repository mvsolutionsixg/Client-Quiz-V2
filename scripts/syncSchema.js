
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is missing in .env');
    // We don't exit with error code to avoid breaking dev startup if just local config missing
    // But for "sync" it should probably fail. The user wants it "automatic".
    // If we return 0, `npm run dev` continues.
    console.warn('⚠️ Skipping DB sync. Please add DATABASE_URL to enable auto-migrations.');
    process.exit(0);
}

const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function syncSchema() {
    try {
        await client.connect();
        console.log('🔌 Connected to Database. Checking schema...');

        // 1. Create Users Table if not exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS public.users (
                id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                phone text NOT NULL,
                company_name text,
                email text,
                created_at timestamptz DEFAULT now()
            );
        `);
        console.log('✅ Checked/Created "users" table.');

        // 2. Sync Columns (Safe Add)
        const columns = [
            { name: 'phone', type: 'text' },
            { name: 'company_name', type: 'text' },
            { name: 'email', type: 'text' },
            { name: 'created_at', type: 'timestamptz DEFAULT now()' }
        ];

        for (const col of columns) {
            // Check if column exists
            const checkRes = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = $1
            `, [col.name]);

            if (checkRes.rowCount === 0) {
                console.log(`➕ Adding missing column: ${col.name}`);
                await client.query(`
                    ALTER TABLE public.users 
                    ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};
                `);
            }
        }
        console.log('✅ Schema synchronization complete.');

    } catch (err) {
        if (err.code === 'ENOTFOUND' || err.message.includes('getaddrinfo')) {
            console.warn('\n⚠️  CONNECTION WARNING: Could not resolve database host.');
            console.warn('   This is likely because the direct connection is IPv6-only, and your network prefers IPv4.');
            console.warn('   -> Your frontend App will likely still work (it uses the REST API).');
            console.warn('   -> Schema Sync is skipped.\n');
            console.warn('   FIX: Get the "IPv4 Transaction Pooler" URL from Supabase Dashboard -> Database -> Connection String.');
            process.exit(0); // Soft fail: allow 'npm run dev' to continue
        }
        console.error('❌ Schema Sync Failed:', err.message);
        // For other errors, we also don't want to block the dev server if it's just a DB glitch
        process.exit(0);
    } finally {
        await client.end();
    }
}

syncSchema();
