import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-full h-[100dvh] max-w-[450px] aspect-[9/16] bg-brand-dark relative overflow-hidden shadow-2xl flex flex-col">
                {/* Background Logo */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <img src="/logo.png" alt="Logo" className="w-1/2" />
                </div>
                {children}
            </div>
        </div>
    );
};

export default Layout;
