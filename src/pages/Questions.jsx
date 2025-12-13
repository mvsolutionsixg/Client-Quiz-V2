import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS } from '../data/questions';
import SpinningWheel from '../components/SpinningWheel';
import { supabase } from '../lib/supabase';
import { Check, X } from 'lucide-react';

const Questions = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [yesCount, setYesCount] = useState(0);
    const [noCount, setNoCount] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'yes' | 'no' | null

    const handleAnswer = async (isYes) => {
        if (feedback) return; // Prevent double clicks

        // 1. Show Feedback (Glow)
        setFeedback(isYes ? 'yes' : 'no');

        // 2. Update stats
        if (isYes) setYesCount(prev => prev + 1);
        else setNoCount(prev => prev + 1);

        const newAnswers = [...answers, isYes];
        setAnswers(newAnswers);

        // 3. Wait, then rotate
        setTimeout(async () => {
            setFeedback(null);

            if (activeIndex < QUESTIONS.length - 1) {
                setActiveIndex(prev => prev + 1);
            } else {
                await finishQuiz(newAnswers, isYes ? yesCount + 1 : yesCount, isYes ? noCount : noCount + 1);
            }
        }, 600);
    };

    const finishQuiz = async (finalAnswers, finalYes, finalNo) => {
        const userId = sessionStorage.getItem('userId');
        try {
            if (userId && import.meta.env.VITE_SUPABASE_URL) {
                await supabase.from('responses').insert([{
                    user_id: userId,
                    yes_count: finalYes,
                    no_count: finalNo,
                    answers: finalAnswers
                }]);
            }
        } catch (err) {
            console.error("Failed to save", err);
        }
        navigate('/results', { state: { yesCount: finalYes, noCount: finalNo } });
    };

    return (
        <div className="w-full h-full bg-slate-50 relative overflow-hidden flex flex-col items-center">

            {/* Background Accents (Soft Blobs) */}
            <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-yellow-100/50 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="pt-4 pb-0 mb-12 text-center z-10 px-6 max-w-sm mx-auto">
                <h2
                    className="text-lg font-bold text-slate-800 uppercase tracking-wide leading-tight"
                    style={{ fontFamily: '"Stencil", "Chalkboard SE", "Comic Neue", sans-serif' }}
                >
                    Which Of These Tally Prime Features Do You Use
                </h2>
            </div>

            {/* Wheel Section */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full overflow-visible">
                {/* Active Segment Highlight Overlay */}
                {/* This mimics the "visual lift" or focus. It stays static while wheel rotates. */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[150px] z-0">
                    {/* A wedge shape or glow behind the active item */}
                    <div className="w-64 h-64 bg-white/40 rounded-full blur-xl animate-pulse"></div>
                </div>

                <div className="scale-110 sm:scale-125 transition-transform duration-500">
                    <SpinningWheel activeIndex={activeIndex} items={QUESTIONS} />
                </div>

                {/* Feedback Overlay on the Active Item Position */}
                {/* The active item is at the top of the wheel. We place a color overlay there. */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1.1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute top-[15%] w-20 h-20 rounded-full z-30 flex items-center justify-center backdrop-blur-sm border-4 ${feedback === 'yes'
                                ? 'bg-green-500/20 border-green-500 text-green-600'
                                : 'bg-red-500/20 border-red-500 text-red-600'
                                }`}
                            style={{ boxShadow: `0 0 30px ${feedback === 'yes' ? '#22c55e' : '#ef4444'}60` }}
                        >
                            {feedback === 'yes' ? <Check size={40} strokeWidth={4} /> : <X size={40} strokeWidth={4} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="w-full px-8 pb-12 pt-4 z-20 flex justify-between gap-6">
                <button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 group flex flex-col items-center gap-2 transition-transform active:scale-95"
                >
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg border-4 border-red-50 flex items-center justify-center group-hover:scale-110 transition-all">
                        <X size={32} className="text-red-500 drop-shadow-sm" strokeWidth={4} />
                    </div>
                    <span className="text-xl font-black text-red-500 tracking-wider drop-shadow-sm">NO</span>
                </button>

                <button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 group flex flex-col items-center gap-2 transition-transform active:scale-95"
                >
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg border-4 border-green-50 flex items-center justify-center group-hover:scale-110 transition-all">
                        <Check size={32} className="text-tally-green drop-shadow-sm" strokeWidth={4} />
                    </div>
                    <span className="text-xl font-black text-tally-green tracking-wider drop-shadow-sm">YES</span>
                </button>
            </div>

        </div>
    );
};

export default Questions;
