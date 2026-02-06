import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    children: React.ReactNode;
}

export const Button = ({ variant = 'primary', className, children, ...props }: ButtonProps) => {
    const variants = {
        primary: "bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20",
        secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10",
        danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
        ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};
