import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {

    // Default base styles
    const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl";

    // Provide variants for 3D depth and modern minimal
    const variants = {
        primary: "bg-primary-600 text-white shadow-3d hover:shadow-3d-hover hover:translate-y-[2px] active:shadow-3d-active active:translate-y-[4px] border-2 border-primary-950 focus:ring-primary-500",
        secondary: "bg-secondary-100 text-secondary-900 shadow-3d hover:shadow-3d-hover hover:translate-y-[2px] active:shadow-3d-active active:translate-y-[4px] border-2 border-secondary-900 focus:ring-secondary-300",
        outline: "bg-white text-secondary-900 border-2 border-secondary-900 shadow-3d hover:shadow-3d-hover hover:translate-y-[2px] active:shadow-3d-active active:translate-y-[4px] focus:ring-secondary-300",
        ghost: "bg-transparent text-secondary-700 hover:bg-secondary-100 border-2 border-transparent",
        danger: "bg-red-500 text-white shadow-3d hover:shadow-3d-hover hover:translate-y-[2px] active:shadow-3d-active active:translate-y-[4px] border-2 border-red-900 focus:ring-red-400",
        glass: "bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-glass hover:bg-white/30"
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        default: "h-12 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-12 w-12"
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
});
Button.displayName = 'Button';
