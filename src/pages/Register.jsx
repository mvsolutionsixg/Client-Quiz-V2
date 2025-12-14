import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Register = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStart = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const { data, error: dbError } = await supabase
                .from('users')
                .insert([{
                    phone,
                    company_name: companyName, // Map explicitly
                    email: email || null
                }])
                .select()
                .single();

            if (dbError) throw dbError;

            // Save user ID for linking responses later
            sessionStorage.setItem('userId', data.id);
            navigate('/questions');

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Failed to register. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">

            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage:
                        'url("https://raw.githubusercontent.com/mvsolutionsixg/Client-Quiz-V2/main/public/mv-wallpaper.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center p-6 text-center space-y-8">
                <div className="space-y-2">
                    <img
                        src="https://raw.githubusercontent.com/mvsolutionsixg/Client-Quiz-V2/main/public/Logo.png" alt="Tally Logo"
                        className="w-20 mx-auto mb-4 mt-7"
                    />
                    <p
                        className="text-white text-lg font-semibold"
                        style={{
                            fontFamily: 'Arial Black',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                        }}
                    >
                        Evaluate your Tally Prime usage today!
                    </p>
                </div>

                <form onSubmit={handleStart} className="glass p-8 rounded-2xl w-full space-y-6">
                    <div className="space-y-2 text-left">
                        <label className="text-sm text-white-400 ml-1">Phone Number *</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your mobile number"
                            className="w-full bg-brand-dark/50 border border-tally-green/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tally-green"
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-sm text-white-400 ml-1">Company Name *</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter your company name"
                            className="w-full bg-brand-dark/50 border border-tally-green/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tally-green"
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-sm text-white-400 ml-1">Email (Optional)</label>
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
        </div>
    );
};

export default Register;
