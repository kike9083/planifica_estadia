import React from 'react';

export const BentoGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto p-4 md:p-8">
            {children}
        </div>
    );
};

export const BentoItem = ({
    children,
    className,
    title,
    icon: Icon,
    variant = 'default'
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: any;
    variant?: 'default' | 'highlight'
}) => {
    return (
        <div className={`glass-card p-6 flex flex-col gap-4 ${className} ${variant === 'highlight' ? 'border-sky-500/30 shadow-sky-500/5' : ''
            }`}>
            {(title || Icon) && (
                <div className="flex justify-between items-center opacity-40">
                    {title && <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>}
                    {Icon && <Icon size={16} />}
                </div>
            )}
            {children}
        </div>
    );
};
