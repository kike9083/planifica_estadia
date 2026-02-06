'use client';

import React from 'react';
import { Zap, Users, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { motion } from 'framer-motion';

interface StatsDashboardProps {
    stats: any;
    budget: any;
    simAdults: number;
    setSimAdults: (n: number) => void;
}

export const StatsDashboard = ({ stats, budget, simAdults, setSimAdults }: StatsDashboardProps) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* SIMULATOR CARD */}
                <GlassCard className="lg:col-span-2 p-8 md:p-10 relative overflow-hidden group border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-transparent to-transparent">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Zap size={180} strokeWidth={1} />
                    </div>

                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="w-full md:w-1/2 space-y-8">
                            <div>
                                <h3 className="text-sky-400 font-black text-[10px] uppercase tracking-[0.4em] mb-6 opacity-80">
                                    Simulador de Población
                                </h3>
                                <div className="flex items-baseline gap-4 mb-2">
                                    <motion.h2
                                        key={simAdults}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-8xl font-black text-white leading-none tracking-tighter"
                                    >
                                        {simAdults}
                                    </motion.h2>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Adultos</span>
                                        {stats.adults > 0 && simAdults === stats.adults ? (
                                            <span className="text-[9px] text-emerald-500 font-black uppercase tracking-tighter px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 inline-block">● Real</span>
                                        ) : (
                                            <span className="text-[9px] text-sky-400 font-black uppercase tracking-tighter px-2 py-0.5 bg-sky-500/10 rounded-full border border-sky-500/20 inline-block">● Proyectado</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="relative pt-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={simAdults}
                                    onChange={(e) => setSimAdults(parseInt(e.target.value))}
                                    aria-label="Simular cantidad de adultos"
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all"
                                />
                                <div className="flex justify-between mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                    <span>min 1</span>
                                    <span>max 50</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                            {[
                                { label: 'Total PAX', value: stats.total, icon: Users, color: 'sky' },
                                { label: 'Juniors', value: stats.juniors, icon: TrendingUp, color: 'amber' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-3xl hover:bg-white/10 transition-colors">
                                    <item.icon className={`text-${item.color}-400 mb-4`} size={20} />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-2xl font-black text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>

                {/* RESULT CARD - CUSTOM PREMIUM STYLE */}
                <GlassCard className="p-1 border-none shadow-none bg-transparent">
                    <div className="h-full relative overflow-hidden bg-[#0f172a] border border-white/10 rounded-3xl p-8 flex flex-col justify-between group">
                        {/* Decorative Background */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/20 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px]" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                    <DollarSign className="text-sky-400" size={24} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Cálculo en</p>
                                    <p className="text-xs font-black text-white uppercase tracking-tighter italic">Tiempo Real</p>
                                </div>
                            </div>

                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Cuota por Adulto</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-sky-500">$</span>
                                <motion.h2
                                    key={budget.totalPerAdult}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-6xl font-black text-white tracking-tighter"
                                >
                                    {budget.totalPerAdult.toFixed(2)}
                                </motion.h2>
                            </div>
                        </div>

                        <div className="relative z-10 pt-8 mt-8 border-t border-white/5 space-y-4">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase">Hospedaje</span>
                                </div>
                                <span className="text-sm font-black text-white">${budget.housePerAdult.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-300 uppercase">Comida</span>
                                </div>
                                <span className="text-sm font-black text-white">${budget.foodPerAdult.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
