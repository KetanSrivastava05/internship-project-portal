import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function AnimatedCounter({ end, prefix = "", suffix = "", duration = 2.0 }) {
    const [count, setCount] = React.useState(0);
    useEffect(() => {
        let animationFrame;
        let startTime;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) animationFrame = requestAnimationFrame(step);
        };
        animationFrame = requestAnimationFrame(step);
        return () => { if (animationFrame) cancelAnimationFrame(animationFrame); };
    }, [end, duration]);
    return <span>{prefix}{count}{suffix}</span>;
}

export const StatCard = ({ title, value, icon: Icon, trend, data, colorClass = "text-primary-600", bgClass = "bg-primary-50", strokeColor = "#0ea5e9" }) => {
    const gradientId = `gradient-${title.replace(/[^a-zA-Z]/g, '')}`;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="p-6 bg-white rounded-2xl shadow border border-secondary-200/60 flex flex-col relative overflow-hidden group transition-all duration-300"
        >
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-secondary-50 opacity-40 group-hover:scale-150 transition-transform duration-700 ease-out z-0 pointer-events-none" />

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-secondary-500 font-bold tracking-wide uppercase text-[11px] mb-2">{title}</h3>
                    <div className="text-4xl font-extrabold text-secondary-900 tracking-tight">
                        <AnimatedCounter end={value} />
                    </div>
                </div>
                <div className={`p-4 rounded-[1.2rem] ${bgClass} ${colorClass} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {data && data.length > 0 && (
                <div className="h-16 w-[calc(100%+3rem)] -mx-6 mb-2 relative z-10 mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={strokeColor}
                                fillOpacity={1}
                                fill={`url(#${gradientId})`}
                                strokeWidth={2.5}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {trend && (
                <div className="mt-4 pt-4 border-t border-secondary-100 flex items-center text-sm relative z-10">
                    <span className={`font-bold ${trend.positive ? 'text-green-500' : 'text-red-500'} flex items-center bg-white px-2 py-0.5 rounded-full shadow-sm border border-secondary-100 mr-2`}>
                        {trend.positive ? '↑' : '↓'} {trend.value}%
                    </span>
                    <span className="text-secondary-500 font-medium tracking-tight">vs last month</span>
                </div>
            )}
        </motion.div>
    );
};
