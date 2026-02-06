import React from 'react';
import { motion } from 'framer-motion';

const LaptopIllustration = () => {
    return (
        <div className="relative w-full max-w-4xl mx-auto perspective-1000">
            {/* Laptop Body Container */}
            <motion.div
                initial={{ rotateX: 20, opacity: 0, y: 50 }}
                animate={{ rotateX: 0, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="transform-style-3d"
            >
                {/* Screen / Lid */}
                <div className="relative mx-auto bg-gray-800 rounded-t-2xl p-2 shadow-2xl w-[90%] md:w-[800px] aspect-[16/10] border-t border-l border-r border-gray-700 bg-gradient-to-br from-gray-700 to-gray-900">
                    {/* Camera */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gray-900 border border-gray-600"></div>

                    {/* Screen Content Area */}
                    <div className="bg-gray-950 w-full h-full rounded-lg overflow-hidden relative shadow-inner border border-gray-800 flex flex-col">
                        {/* Fake Browser Bar */}
                        <div className="h-6 bg-gray-900 flex items-center px-4 space-x-2 border-b border-gray-800">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            <div className="mx-auto bg-gray-800 rounded px-2 text-[10px] text-gray-500 font-mono w-1/2 text-center">internportal.com/careers</div>
                        </div>

                        {/* Screen Display */}
                        <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col items-center justify-center overflow-hidden">
                            {/* Floating Elements on Screen */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center z-10">
                                {[
                                    { name: 'Google', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
                                    { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
                                    { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
                                    { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
                                    { name: 'Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
                                    { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' }
                                ].map((company, i) => (
                                    <motion.div
                                        key={company.name}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.8 + (i * 0.1) }}
                                        className="bg-white/90 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center justify-center h-16 shadow-lg"
                                    >
                                        <img src={company.url} alt={company.name} className="max-w-full max-h-full object-contain" />
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="mt-8 text-center"
                            >
                                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                    Top Internship Roles
                                </h3>
                                <div className="flex gap-2 mt-2 justify-center flex-wrap">
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">Software Engineer</span>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">Product Manager</span>
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">Data Scientist</span>
                                </div>
                            </motion.div>

                            {/* Abstract decorative grid */}
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
                                {[...Array(36)].map((_, i) => (
                                    <div key={i} className="border border-white/5"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Base / Keyboard Area (Perspective View) */}
                <div className="relative mx-auto bg-gray-800 w-[95%] md:w-[850px] h-4 md:h-6 rounded-b-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-gray-600 bg-gradient-to-b from-gray-700 to-gray-900 transform translate-z-1">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-2 bg-gray-600/50 rounded-b-md"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default LaptopIllustration;
