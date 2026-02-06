import React from 'react';
import { motion } from 'framer-motion';

const logos = [
    { name: 'Google', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', x: '10%', y: '20%', size: 'w-16 h-16', bg: 'bg-white' },
    { name: 'Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', x: '80%', y: '15%', size: 'w-12 h-14', bg: 'bg-white' },
    { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', x: '15%', y: '70%', size: 'w-24 h-24', bg: 'bg-white' },
    { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', x: '85%', y: '65%', size: 'w-20 h-10', bg: 'bg-white' },
    { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', x: '50%', y: '85%', size: 'w-24 h-12', bg: 'bg-black' },
    { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', x: '60%', y: '10%', size: 'w-20 h-10', bg: 'bg-white' },
];

const BackgroundLogos = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {logos.map((logo, index) => (
                <motion.div
                    key={logo.name}
                    className={`absolute flex items-center justify-center p-3 rounded-2xl shadow-2xl ${logo.bg} bg-opacity-90 backdrop-blur-sm border border-white/20`}
                    style={{
                        left: logo.x,
                        top: logo.y,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)'
                    }}
                    initial={{ y: 0 }}
                    animate={{
                        y: [-15, 15, -15],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 4 + index,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                    }}
                >
                    <img src={logo.url} alt={logo.name} className={`${logo.size} object-contain`} />
                </motion.div>
            ))}
        </div>
    );
};

export default BackgroundLogos;
