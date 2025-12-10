import React from 'react';
import { motion } from 'framer-motion';

const Coin = ({ type }) => {
    const isGreen = type === 'green';
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg z-50
        ${isGreen ? 'bg-tally-green border-green-300 shadow-neon-green' : 'bg-red-500 border-red-300 shadow-neon-red'}
      `}
        >
            <span className="text-white font-bold text-xl">$</span>
        </motion.div>
    );
};

export default Coin;
