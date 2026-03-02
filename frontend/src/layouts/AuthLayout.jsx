import React from 'react';
import { motion } from 'framer-motion';

export const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-secondary-950 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/30 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />

                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHYxbS00MC0xbTF2NDBIMSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch relative z-10 bg-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/10"
            >
                {/* Left Panel */}
                <div className="hidden lg:flex flex-col justify-between p-12 text-white relative bg-gradient-to-br from-primary-900/60 to-secondary-900/60 transition-colors duration-1000">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="flex items-center space-x-2 mb-12">
                            <div className="w-8 h-8 bg-primary-500 rounded-lg shadow-glow" />
                            <span className="text-xl font-bold tracking-widest text-white">INTERNPORTAL</span>
                        </div>
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                            Elevate Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Career</span> Journey.
                        </h1>
                        <p className="text-lg text-secondary-300 max-w-md">
                            Join the premier ecosystem connecting top talent with industry-leading organizations and top-tier faulty mentorship.
                        </p>
                    </motion.div>

                    {/* Floating Illustration placeholder (abstract shapes) */}
                    <div className="relative w-full aspect-[4/3] max-w-md mx-auto mt-8">
                        <motion.div
                            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-4 left-10 w-24 h-24 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-glass"
                        />
                        <motion.div
                            animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-tr from-primary-500/40 to-indigo-500/20 backdrop-blur-2xl rounded-full border border-white/20 shadow-glass flex items-center justify-center"
                        >
                            <div className="w-16 h-16 bg-white/10 rounded-full" />
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-500/20 rounded-full blur-2xl"
                        />
                    </div>
                </div>

                {/* Right Panel */}
                <div className="p-8 lg:p-14 relative bg-secondary-50 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-full max-w-md mx-auto relative group"
                    >
                        <div className="mb-8 items-center justify-between">
                            <h2 className="text-3xl font-extrabold text-secondary-900 mb-2">{title}</h2>
                            <p className="text-secondary-500 font-medium">{subtitle}</p>
                        </div>

                        {children}

                    </motion.div>
                </div>

            </motion.div>
        </div>
    );
};
