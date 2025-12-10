import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS } from '../data/questions';
import QuestionCard from '../components/QuestionCard';
import Coin from '../components/Coin';
import { supabase } from '../lib/supabase';
import { Check, X } from 'lucide-react';

const Questions = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]); // Array of booleans
    const [yesCount, setYesCount] = useState(0);
    const [noCount, setNoCount] = useState(0);
    const [coinType, setCoinType] = useState(null); // 'green' | 'red' | null

    const handleAnswer = async (isYes) => {
        // 1. Trigger Animation
        setCoinType(isYes ? 'green' : 'red');

        // 2. Update Counts
        if (isYes) setYesCount(prev => prev + 1);
        else setNoCount(prev => prev + 1);

        // 3. Store Answer
        const newAnswers = [...answers, isYes];
        setAnswers(newAnswers);

        // 4. Wait for animation then move next
        setTimeout(async () => {
            setCoinType(null);

            if (currentIndex < QUESTIONS.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                await finishQuiz(newAnswers, isYes ? yesCount + 1 : yesCount, isYes ? noCount : noCount + 1);
            }
        }, 800);
    };

    const finishQuiz = async (finalAnswers, finalYes, finalNo) => {
        const userId = sessionStorage.getItem('userId');

        // Save to Supabase
        try {
            if (userId && import.meta.env.VITE_SUPABASE_URL) {
                await supabase.from('responses').insert([{
                    user_id: userId,
                    yes_count: finalYes,
                    no_count: finalNo,
                    answers: finalAnswers
                }]);
            } else {
                console.warn("Skipping DB save: No User ID or Supabase Config");
            }
        } catch (err) {
            console.error("Failed to save response", err);
        }

        // Navigate
        navigate('/results', { state: { yesCount: finalYes, noCount: finalNo } });
    };

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden">

            {/* Header Bins */}
            <div className="flex justify-between p-4 z-20">
                <div className="flex flex-col items-center bg-red-900/20 border border-red-500/30 p-3 rounded-2xl w-20 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mb-1">
                        <X size={16} className="text-red-500" />
                    </div>
                    <span className="text-2xl font-bold text-red-500">{noCount}</span>
                </div>

                <div className="flex flex-col items-center bg-green-900/20 border border-green-500/30 p-3 rounded-2xl w-20 backdrop-blur-md">
                    <div className="w-8 h-8 rounded-full bg-tally-green/20 flex items-center justify-center mb-1">
                        <Check size={16} className="text-tally-green" />
                    </div>
                    <span className="text-2xl font-bold text-tally-green">{yesCount}</span>
                </div>
            </div>

            {/* Question Area */}
            <div className="flex-1 relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <QuestionCard
                        key={currentIndex}
                        question={QUESTIONS[currentIndex]}
                        index={currentIndex}
                        total={QUESTIONS.length}
                    />
                </AnimatePresence>

                {/* Coin Animation Overlay */}
                <AnimatePresence>
                    {coinType && (
                        <motion.div
                            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                scale: [0.5, 1.2, 0.8],
                                x: coinType === 'green' ? 120 : -120, // Move to corners approximately
                                y: -300 // Move up
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute z-50 pointer-events-none"
                        >
                            <Coin type={coinType} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="p-8 pb-12 flex gap-6 z-20">
                <button
                    onClick={() => !coinType && handleAnswer(false)}
                    className="flex-1 bg-red-500/10 hover:bg-red-500 active:bg-red-600 border border-red-500 text-red-100 font-bold text-xl py-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-900/20"
                >
                    NO
                </button>
                <button
                    onClick={() => !coinType && handleAnswer(true)}
                    className="flex-1 bg-tally-green/10 hover:bg-tally-green active:bg-green-600 border border-tally-green text-green-100 font-bold text-xl py-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-green-900/20"
                >
                    YES
                </button>
            </div>

        </div>
    );
};

export default Questions;
