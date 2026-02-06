import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface StatsDashboardProps {
    stats: any;
    budget: any;
    simAdults: number;
    setSimAdults: (n: number) => void;
}

export const StatsDashboard = ({ stats, budget, simAdults, setSimAdults }: StatsDashboardProps) => {
    return (
        <div className="animate-slide-up">
            {/* Main Simulator Card matching screenshot */}
            <GlassCard className="p-10 relative overflow-hidden group border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-transparent">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Zap size={150} strokeWidth={1} />
                </div>

                <div className="relative flex flex-col md:flex-row justify-between items-center gap-10">

                    {/* LEFT: SIMULATOR CONTROLS */}
                    <div className="w-full md:w-auto space-y-6 z-10">
                        <span className="text-sky-400 font-black text-[10px] uppercase tracking-widest block opacity-70">
                            Población en el Plan
                        </span>
                        <div>
                            <div className="flex items-end gap-3 mb-4">
                                <h2 className="text-7xl font-black text-white leading-none tracking-tighter">
                                    {simAdults}
                                </h2>
                                <div className="mb-2">
                                    <span className="text-sm font-bold text-slate-400 block uppercase tracking-wider">Adultos</span>
                                    {stats.adults > 0 && simAdults === stats.adults && (
                                        <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tighter">● Confirmados</span>
                                    )}
                                    {simAdults > stats.adults && (
                                        <span className="text-[10px] text-sky-400 font-black uppercase tracking-tighter">● Simulados</span>
                                    )}
                                </div>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={simAdults}
                                onChange={(e) => setSimAdults(parseInt(e.target.value))}
                                className="w-full md:w-64 h-2 bg-slate-700 rounded-lg cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all"
                                title="Número de adultos para simulación"
                            />
                        </div>
                    </div>

                    {/* RIGHT: RESULT DISPLAY */}
                    <div className="z-10 text-center md:text-right bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/5 min-w-[280px] shadow-2xl shadow-sky-900/10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Cuota por Adulto
                        </p>
                        <h2 className="text-5xl font-black text-white tracking-tighter mb-4">
                            ${budget.totalPerAdult.toFixed(2)}
                        </h2>
                        <div className="flex items-center justify-center md:justify-end gap-2 mb-6">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-lg border border-emerald-500/20 uppercase tracking-wider">
                                Casa + Comida
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 text-right">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hospedaje ({budget.nights} n)</p>
                                <p className="text-sm font-black text-white">${budget.housePerAdult.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Alimentación</p>
                                <p className="text-sm font-black text-white">${budget.foodPerAdult.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </GlassCard>
        </div>
    );
};
