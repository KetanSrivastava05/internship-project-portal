import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const FadeUp = ({ children, className, delay = 0, duration = 0.5 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const SlideIn = ({ children, className, delay = 0, direction = "left", duration = 0.6 }) => {
    const xOffset = direction === "left" ? -50 : 50;
    return (
        <motion.div
            initial={{ opacity: 0, x: xOffset }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({ children, className, staggerChildren = 0.1 }) => {
    return (
        <motion.div
            variants={{
                show: {
                    transition: { staggerChildren }
                }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children, className, yOffset = 20 }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: yOffset },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'backOut' } }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const PageWrapper = ({ children, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className={cn("min-h-screen", className)}
        >
            {children}
        </motion.div>
    );
};
