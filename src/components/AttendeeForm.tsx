'use client';

import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { UserPlus, User, Hash } from 'lucide-react';

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
        <div className="w-full max-w-2xl mx-auto mb-16 px-4 md:px-0">
            <GlassCard className="p-2 bg-white/2 border-white/5 shadow-2xl overflow-hidden ring-1 ring-white/5">
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2">
                    <div className="flex-1 w-full relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors pointer-events-none">
                            <User size={16} />
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombre del participante"
                            className="w-full bg-white/5 border-none focus:ring-0 outline-none pl-12 pr-4 py-4 rounded-2xl text-sm font-bold transition-all text-white placeholder:text-slate-600 focus:bg-white/10"
                            required
                        />
                    </div>

                    <div className="w-full md:w-32 relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors pointer-events-none">
                            <Hash size={16} />
                        </div>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Edad"
                            className="w-full bg-white/5 border-none focus:ring-0 outline-none pl-12 pr-4 py-4 rounded-2xl text-sm font-bold transition-all text-white placeholder:text-slate-600 focus:bg-white/10"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full md:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl shadow-lg shadow-sky-500/20 border-none font-black text-[10px] tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95"
                    >
                        {submitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <UserPlus size={18} />
                                <span className="ml-2">Añadir</span>
                            </>
                        )}
                    </Button>
                </form>
            </GlassCard>
            <div className="flex justify-center items-center gap-2 mt-4 opacity-30 select-none">
                <div className="h-px w-8 bg-slate-500" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Appwrite Cloud Sync</span>
                <div className="h-px w-8 bg-slate-500" />
            </div>
        </div>
    );
};
