
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    MessageSquareText,
    CreditCard,
    CloudCog,
    Banknote,
    PieChart,
    ShieldCheck
} from 'lucide-react';

// Simple synthesized tick sound to avoid external assets
const playTickSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Silently fail if audio is blocked or unsupported
    }
};

const ICON_MAP = {
    "MessageSquareText": MessageSquareText,
    "CreditCard": CreditCard,
    "CloudCog": CloudCog,
    "Banknote": Banknote,
    "PieChart": PieChart,
    "ShieldCheck": ShieldCheck
};

const ICON_STYLES = {
    "MessageSquareText": {
        bg: "linear-gradient(135deg, #4ADE80 0%, #16A34A 100%)", // Vibrant Green
        shadow: "0 8px 16px -4px rgba(22, 163, 74, 0.5), 0 4px 6px -2px rgba(22, 163, 74, 0.3), inset 0 2px 0 rgba(255,255,255,0.4)"
    },
    "CreditCard": {
        bg: "linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)", // Vibrant Blue
        shadow: "0 8px 16px -4px rgba(37, 99, 235, 0.5), 0 4px 6px -2px rgba(37, 99, 235, 0.3), inset 0 2px 0 rgba(255,255,255,0.4)"
    },
    "CloudCog": {
        bg: "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)", // Sky Blue
        shadow: "0 8px 16px -4px rgba(2, 132, 199, 0.5), 0 4px 6px -2px rgba(2, 132, 199, 0.3), inset 0 2px 0 rgba(255,255,255,0.4)"
    },
    "Banknote": {
        bg: "linear-gradient(135deg, #34D399 0%, #059669 100%)", // Emerald
        shadow: "0 8px 16px -4px rgba(5, 150, 105, 0.5), 0 4px 6px -2px rgba(5, 150, 105, 0.3), inset 0 2px 0 rgba(255,255,255,0.4)"
    },
    "PieChart": {
        bg: "linear-gradient(135deg, #F472B6 0%, #DB2777 100%)", // Pink/Rose
        shadow: "0 8px 16px -4px rgba(219, 39, 119, 0.5), 0 4px 6px -2px rgba(219, 39, 119, 0.3), inset 0 2px 0 rgba(255,255,255,0.4)"
    },
    "ShieldCheck": {
        bg: "linear-gradient(135deg, #818CF8 0%, #4F46E5 100%)", // Indigo
        shadow: "0 8px 16px -4px rgba(79, 70, 229, 0.5), 0 4px 6px -2px rgba(79, 70, 229, 0.3), inset 0 2px 0 rgba(255,255,255,0.4)"
    }
};

const SpinningWheel = ({ activeIndex, items }) => {
    // 6 items = 60 degrees each. 
    // Segment centers are at 30, 90, 150...
    // To align index 0 (30deg) to top (0deg), we need offset -30.
    const rotation = -activeIndex * 60 - 30;

    // Play tick sound when active index changes (skip initial mount)
    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        playTickSound();
    }, [activeIndex]);

    return (
        <div className="relative w-80 h-80 flex items-center justify-center">
            {/* The Wheel Container */}
            <motion.div
                className="relative w-full h-full rounded-full"
                animate={{ rotate: rotation }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                style={{
                    background: 'conic-gradient(from 0deg, #E0F2FE 0deg 60deg, #FEF9C3 60deg 120deg, #E0F2FE 120deg 180deg, #FEF9C3 180deg 240deg, #E0F2FE 240deg 300deg, #FEF9C3 300deg 360deg)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
            >
                {items.map((item, index) => {
                    const Icon = ICON_MAP[item.icon] || MessageSquareText;
                    const style = ICON_STYLES[item.icon] || ICON_STYLES["MessageSquareText"];
                    const angle = index * 60 + 30;
                    const isActive = index === activeIndex;

                    const lines = item.text.split('\n');

                    return (
                        <div
                            key={item.id}
                            className="absolute top-0 left-0 w-full h-full flex justify-center pt-2"
                            style={{
                                transform: `rotate(${angle}deg)`,
                                transformOrigin: 'center center'
                            }}
                        >
                            <motion.div
                                className={`flex flex-col items-center transform h-full ${isActive ? 'brightness-110 drop-shadow-md' : 'opacity-90'}`}
                                animate={isActive ? { scale: [1, 1.0, 1.0, 1.0] } : { scale: 1 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >

                                {/* Curved Text via SVG */}
                                {/* 
                                    Radius Increased to 140px (Moved Outward).
                                    Circle Center relative to SVG box (260x130): (130, 160).
                                    Apex of Arc at R=140 is Y = 160 - 140 = 20.
                                    
                                    Path calculation for +/- 45 degrees:
                                    Start (-45): x = 130 + 140*sin(-45) = 31, y = 160 - 140*cos(-45) = 61
                                    End (+45): x = 229, y = 61
                                    Path: M 31,61 A 140,140 0 0 1 229,61
                                */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[260px] h-[130px] pointer-events-none">
                                    <svg viewBox="0 0 260 130" className="w-full h-full text-slate-700">
                                        <path
                                            id={`curve-${item.id}`}
                                            d="M 31,61 A 140,140 0 0 1 229,61"
                                            fill="none"
                                        />

                                        {lines.map((line, i) => (
                                            <text key={i} width="260" dy={lines.length > 1 ? -6 + (i * 12) : 0}>
                                                <textPath
                                                    href={`#curve-${item.id}`}
                                                    startOffset="50%"
                                                    textAnchor="middle"
                                                    className="text-[9px] font-bold fill-current uppercase tracking-[0.05em]"
                                                >
                                                    {line}
                                                </textPath>
                                            </text>
                                        ))}
                                    </svg>
                                </div>

                                {/* Icon Container */}
                                <div
                                    className="absolute top-[48px] p-3 rounded-full shadow-lg relative z-10 flex items-center justify-center"
                                    style={{
                                        background: style.bg,
                                        boxShadow: style.shadow,
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <Icon
                                        size={24}
                                        color="white"
                                        strokeWidth={2.5}
                                        className="drop-shadow-sm"
                                    />
                                </div>

                            </motion.div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Center Hub / Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 bg-white rounded-full shadow-lg z-10 flex items-center justify-center">
                    <img src="https://raw.githubusercontent.com/mvsolutionsixg/Client-Quiz-V2/main/public/assets/tally.png" alt="Tally" className="w-16 opacity-90" />
                </div>
            </div>

            {/* Center Top Arrow - High Z-Index to sit ON TOP of everything */}
            <div className="absolute -top-7 z-50 drop-shadow-xl">
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px] border-t-tally-green"></div>
            </div>
        </div>
    );
};

export default SpinningWheel;
