'use client';

import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { UserPlus, User, Hash, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AttendeeFormProps {
    onAdd: (name: string, age: number) => Promise<boolean>;
}

export const AttendeeForm = ({ onAdd }: AttendeeFormProps) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !age) return;

        setSubmitting(true);
        const success = await onAdd(name, parseInt(age));
        if (success) {
            setName('');
            setAge('');
        }
        setSubmitting(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-16 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-3 rounded-[2.5rem] shadow-3xl hover:border-sky-500/20 transition-all duration-700">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
                        {/* Name Input */}
                        <div className="flex-[2] w-full relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-all duration-500">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nombre completo..."
                                className="w-full bg-white/5 border border-transparent focus:border-sky-500/30 outline-none pl-16 pr-6 py-5 rounded-[1.8rem] text-base font-bold transition-all text-white placeholder:text-slate-600 focus:bg-white/10"
                                required
                            />
                        </div>

                        {/* Age Input */}
                        <div className="w-full md:w-36 relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-all duration-500">
                                <Hash size={18} />
                            </div>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Edad"
                                className="w-full bg-white/5 border border-transparent focus:border-sky-500/30 outline-none pl-16 pr-6 py-5 rounded-[1.8rem] text-base font-bold transition-all text-white placeholder:text-slate-600 focus:bg-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full md:w-auto px-10 py-5 bg-sky-500 hover:bg-sky-400 text-white rounded-[1.8rem] shadow-xl shadow-sky-500/20 border-none relative overflow-hidden group"
                        >
                            <div className="relative z-10 flex items-center justify-center font-black text-xs uppercase tracking-[0.2em]">
                                {submitting ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <UserPlus size={20} className="mr-3" />
                                        <span>Unirse al Viaje</span>
                                    </>
                                )}
                            </div>
                        </Button>
                    </form>
                </div>
            </motion.div>

            <div className="flex justify-center items-center gap-4 mt-8">
                <div className="h-px w-12 bg-white/5" />
                <div className="flex items-center gap-2 px-4 py-1.5 bg-sky-500/5 rounded-full border border-sky-500/10">
                    <Sparkles size={12} className="text-sky-400" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Fast Sync Active</span>
                </div>
                <div className="h-px w-12 bg-white/5" />
            </div>
        </div>
    );
};
