import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Html, PresentationControls, ContactShadows, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

const companies = [
    { name: 'Google', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', size: 'w-16 h-16' },
    { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', size: 'w-24 h-24' },
    { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', size: 'w-24 h-12' },
    { name: 'Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', size: 'w-12 h-14' },
    { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', size: 'w-24 h-12' },
    { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', size: 'w-24 h-10' },
];

function LaptopScreen({ activeIndex }) {
    return (
        <div className="w-[840px] h-[560px] bg-secondary-950 flex flex-col overflow-hidden select-none pointer-events-none rounded-[1.5rem]">
            {/* macOS Style Header */}
            <div className="h-10 bg-[#1e1e1e] flex items-center px-6 space-x-3 border-b border-gray-800">
                <div className="flex space-x-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm" />
                    <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-sm" />
                    <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm" />
                </div>
                <div className="flex-1 text-center font-semibold tracking-wide text-gray-500 text-sm pl-4 leading-none pt-1">InternPortal App</div>
            </div>

            {/* Screen Content */}
            <div className="flex-1 p-12 grid grid-cols-3 gap-8 relative bg-gradient-to-br from-[#0c0f1a] via-[#101423] to-[#0c0f1a]">
                {companies.map((company, i) => {
                    const isActive = activeIndex === i;
                    return (
                        <motion.div
                            key={company.name}
                            animate={{
                                scale: isActive ? 1.08 : 1,
                                boxShadow: isActive ? '0 0 30px rgba(14, 165, 233, 0.4)' : 'none',
                                borderColor: isActive ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255, 255, 255, 0.05)',
                                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)'
                            }}
                            className="relative rounded-[2rem] border flex flex-col items-center justify-center p-6 h-full transition-colors backdrop-blur-md"
                        >
                            <img src={company.url} alt={company.name} className={`${company.size} object-contain`} />

                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, y: -24, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                        className="absolute -top-5 text-sm px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white rounded-full shadow-[0_0_20px_rgba(52,211,153,0.5)] font-bold tracking-wide whitespace-nowrap z-10 flex items-center gap-2 border border-emerald-300/50"
                                    >
                                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                                        Applied Successfully
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

function LaptopModel() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % companies.length;
            setActiveIndex(index);
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    return (
        <group position={[0, -1.2, 0]}>
            <Float rotationIntensity={0.3} floatIntensity={1.2} speed={2}>
                {/* Screen / Lid */}
                <group position={[0, 1.4, -1]} rotation={[-0.1, 0, 0]}>
                    {/* Screen Bezel Geometry */}
                    <mesh position={[0, 0, -0.05]}>
                        <boxGeometry args={[4.2, 2.8, 0.1]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
                    </mesh>
                    {/* Inner Black Screen Glass */}
                    <mesh position={[0, 0, 0.015]}>
                        <planeGeometry args={[4.0, 2.6]} />
                        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.8} />
                    </mesh>
                    {/* Rendered HTML overlaid neatly to match args 4.0x2.6 */}
                    <Html
                        transform
                        wrapperClass="htmlScreen"
                        distanceFactor={2.0} // Scales the 840px HTML correctly onto the plane
                        position={[0, 0, 0.02]}
                        scale={[1.1, 1.1, 1.1]}
                        style={{ pointerEvents: 'none' }}
                    >
                        <LaptopScreen activeIndex={activeIndex} />
                    </Html>
                </group>

                {/* Base */}
                <group position={[0, 0, 0.2]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[4.4, 0.15, 2.8]} />
                        <meshStandardMaterial color="#3a3a3a" roughness={0.4} />
                    </mesh>
                    {/* Trackpad */}
                    <mesh position={[0, 0.076, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[1.3, 0.8]} />
                        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
                    </mesh>
                    {/* Keyboard Area */}
                    <mesh position={[0, 0.076, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[3.8, 1.3]} />
                        <meshStandardMaterial color="#111" roughness={0.8} />
                    </mesh>
                </group>
            </Float>
            <ContactShadows position={[0, -1.8, 0]} opacity={0.7} scale={15} blur={2.5} far={4} color="#000" />
        </group>
    );
}

export default function Hero3D() {
    return (
        <div className="w-full h-[550px] md:h-[650px] lg:h-[750px] relative cursor-grab active:cursor-grabbing z-10">
            <Canvas camera={{ position: [0, 1.2, 7.5], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                <directionalLight position={[-10, 10, 5]} intensity={0.8} />
                <directionalLight position={[0, -10, -5]} intensity={0.5} color="#0ea5e9" />
                <PresentationControls
                    global
                    rotation={[0.13, -0.2, 0]}
                    polar={[-0.2, 0.2]}
                    azimuth={[-0.6, 0.6]}
                    config={{ mass: 2, tension: 400 }}
                    snap={{ mass: 4, tension: 400 }}
                >
                    <LaptopModel />
                </PresentationControls>
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
