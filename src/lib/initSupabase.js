import { supabase } from './supabase';

export const initSupabase = async () => {
    // Run asynchronously without blocking UI
    setTimeout(async () => {
        console.log('Checking database connection...');

        try {
            // Lightweight check to see if we can reach the users table
            const { data, error } = await supabase.from('users').select('id').limit(1);

            if (error) {
                console.warn('Database check returned an error:', error.message);
                if (error.code === '42P01') {
                    console.error("CRITICAL: The 'users' table is missing in Supabase. Please ensure your database schema is set up manually.");
                }
            } else {
                console.log('Database connected and users table found.');
            }
        } catch (err) {
            console.error('Error during DB connection check:', err);
        }
    }, 1000);
};
