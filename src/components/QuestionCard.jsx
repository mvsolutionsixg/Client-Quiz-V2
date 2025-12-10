import React from 'react';
import { motion } from 'framer-motion';

const QuestionCard = ({ question, index, total }) => {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0, rotate: 10 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -300, opacity: 0, rotate: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center p-6"
        >
            <div className="glass w-full aspect-[3/4] flex flex-col items-center justify-center p-8 rounded-3xl text-center space-y-6 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                <span className="text-tally-green font-mono text-sm tracking-widest border border-tally-green/30 px-3 py-1 rounded-full bg-brand-dark/30">
                    QUESTION {index + 1} / {total}
                </span>
                <h2 className="text-2xl font-bold leading-relaxed text-white drop-shadow-md">
                    {question}
                </h2>
            </div>
        </motion.div>
    );
};

export default QuestionCard;
