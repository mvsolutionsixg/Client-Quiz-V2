import { supabase } from './supabase';

export const initSupabase = async () => {
    // Run asynchronously without blocking UI
    setTimeout(async () => {
        try {
            console.log('Checking database tables...');

            // 1. Check if 'users' table exists by attempting a lightweight select
            // If table doesn't exist, Supabase returns error 42P01 (undefined_table)
            const { error } = await supabase.from('users').select('id').limit(1);

            if (error && error.code === '42P01') {
                console.warn('Tables missing. Attempting auto-initialization via API...');

                // Call the server-side endpoint to run the DDL
                // Note: This requires the /api/db-init endpoint to be hosted and configured
                try {
                    const res = await fetch('/api/db-init', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (!res.ok) {
                        console.error('Failed to initialize DB:', await res.text());
                    } else {
                        console.log('Database initialized successfully.');
                    }
                } catch (fetchErr) {
                    console.error('API endpoint /api/db-init not reachable.', fetchErr);
                }
            } else {
                console.log('Database tables appear to exist.');
            }
        } catch (err) {
            console.error('Error during DB init check:', err);
        }
    }, 1000);
};
