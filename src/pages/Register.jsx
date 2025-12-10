import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Register = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStart = async (e) => {
        e.preventDefault();
        if (!phone) {
            setError('Phone number is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // In a real app, strict validation would go here
            const { data, error: dbError } = await supabase
                .from('users')
                .insert([{ phone, email }])
                .select()
                .single();

            if (dbError) throw dbError;

            // Save user ID for linking responses later
            sessionStorage.setItem('userId', data.id);
            navigate('/questions');

        } catch (err) {
            console.error('Registration error:', err);
            // Fallback for demo without backend connected
            if (err.message?.includes('violates foreign key constraint') || !import.meta.env.VITE_SUPABASE_URL) {
                // Allow bypass if database isn't fully set up for demo purposes
                console.warn('Backend not reachable or config missing. Proceeding in demo mode.');
                sessionStorage.setItem('userId', 'demo-user-' + Date.now());
                navigate('/questions');
            } else {
                setError('Failed to register. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center space-y-8 z-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-tally-green to-tally-yellow">
                    Tally Audit
                </h1>
                <p className="text-gray-300">Evaluate your Tally Prime usage today!</p>
            </div>

            <form onSubmit={handleStart} className="glass p-8 rounded-2xl w-full space-y-6">
                <div className="space-y-2 text-left">
                    <label className="text-sm text-gray-400 ml-1">Phone Number *</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your mobile number"
                        className="w-full bg-brand-dark/50 border border-tally-green/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tally-green"
                    />
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-sm text-gray-400 ml-1">Email (Optional)</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-brand-dark/50 border border-tally-green/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tally-green"
                    />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-tally-green hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-neon-green transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Starting...' : 'Start Assessment'}
                </button>
            </form>
        </div>
    );
};

export default Register;
