import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const SkeletonLoader = ({ className, round = false }) => {
    return (
        <motion.div
            className={cn(
                "bg-secondary-200 overflow-hidden relative",
                round ? "rounded-full" : "rounded-md",
                className
            )}
        >
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ translateX: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
        </motion.div>
    );
};

export const CardSkeleton = () => (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4 border border-secondary-100">
        <div className="flex items-center space-x-4">
            <SkeletonLoader className="w-12 h-12" round={true} />
            <div className="space-y-2">
                <SkeletonLoader className="h-4 w-[150px]" />
                <SkeletonLoader className="h-3 w-[100px]" />
            </div>
        </div>
        <SkeletonLoader className="h-20 w-full" />
        <div className="flex justify-between">
            <SkeletonLoader className="h-8 w-[100px]" />
            <SkeletonLoader className="h-8 w-[100px]" />
        </div>
    </div>
);
