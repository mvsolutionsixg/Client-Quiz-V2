import React from 'react';
import { useLocation } from 'react-router-dom';
import PieChart from '../components/PieChart';
import { MessageCircle } from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const { yesCount = 0, noCount = 0 } = location.state || {}; // Fallback if accessed directly

    const total = yesCount + noCount;
    const percentage = total > 0 ? Math.round((yesCount / total) * 100) : 0;

    const whatsappLink = `https://wa.me/919876543210?text=I+want+to+use+more+Tally+features`; // Placeholder number

    return (
        <div className="flex flex-col items-center w-full h-full p-6 space-y-8 overflow-y-auto">

            <div className="mt-8 text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Assessment Complete</h2>
                <p className="text-gray-400">Here is your Tally Prime usage breakdown</p>
            </div>

            <div className="w-full max-w-xs aspect-square relative flex items-center justify-center">
                <PieChart yesCount={yesCount} noCount={noCount} />
                {/* Center Percentage */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-white drop-shadow-lg">{percentage}%</span>
                        <span className="text-xs text-green-400 uppercase tracking-widest">Utilized</span>
                    </div>
                </div>
            </div>

            <div className="glass w-full p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-gray-300">Features Used</span>
                    <span className="text-tally-green font-bold text-xl">{yesCount}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-300">Unused Opportunities</span>
                    <span className="text-red-400 font-bold text-xl">{noCount}</span>
                </div>
            </div>

            <div className="w-full pt-4">
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 gap-3"
                >
                    <MessageCircle size={24} />
                    <span>Utilize Features Now</span>
                </a>
                <p className="text-center text-xs text-gray-500 mt-4">
                    Click to chat with our Tally Experts
                </p>
            </div>

        </div>
    );
};

export default Results;
