import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { Home, Utensils } from 'lucide-react';

interface AnalyticsDashboardProps {
    budget: any;
    stats: any;
}

export const AnalyticsDashboard = ({ budget, stats }: AnalyticsDashboardProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 animate-slide-up pb-32">

            {/* CARD 1: HOSPEDAJE */}
            <GlassCard className="lg:col-span-4 p-10 border-l-4 border-emerald-500 bg-emerald-500/[0.02]">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-emerald-500/20">
                        <Home size={24} />
                    </div>
                    <h3 className="font-black text-white uppercase tracking-widest text-xs">Gasto Hospedaje</h3>
                </div>

                <div className="mb-6 flex gap-2 flex-wrap">
                    <span className="text-[9px] font-black px-2 py-1 bg-white/5 rounded-md text-slate-400 border border-white/5">
                        {budget.adultsUsed} ADULTOS
                    </span>
                    <span className="text-[9px] font-black px-2 py-1 bg-white/5 rounded-md text-amber-500/70 border border-amber-500/10">
                        {budget.juniorsUsed} JUNIORS
                    </span>
                    <span className="text-[9px] font-black px-2 py-1 bg-white/5 rounded-md text-emerald-500/70 border border-emerald-500/10">
                        {stats.free} GRATUÍTOS
                    </span>
                </div>

                <div className="space-y-4 border-b border-white/5 pb-8 mb-6">
                    <div className="flex justify-between text-xs font-medium text-slate-400">
                        <span>Total Reserva (+Extras):</span>
                        <span className="text-white">${budget.totalLodgingToCover.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-amber-500/80">
                        <span>Aporte Juniors (Pagado):</span>
                        <span>-${budget.juniorContribution.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-4 border-t border-white/5">
                        <span>A cubrir por Adultos:</span>
                        <span className="text-emerald-400">${budget.lodgingTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="text-center py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mb-4">
                    <p className="text-[9px] font-black uppercase text-emerald-500 tracking-[0.2em] mb-2">Cuota Casa p/p</p>
                    <h2 className="text-4xl font-black text-white tracking-tight">${budget.housePerAdult.toFixed(2)}</h2>
                    <p className="text-[9px] text-slate-500 mt-1 font-bold italic">
                        (${budget.lodgingTotal.toFixed(2)} ÷ {budget.adultsUsed} adultos)
                    </p>
                </div>

                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed">
                        * Nota: El costo base (${budget.lodgingTotal.toFixed(2)}) es repartido entre los mayores de 12 años. Los Juniors cubren su propio excedente de $20 cada uno.
                    </p>
                </div>
            </GlassCard>

            {/* CARD 2: COMIDA */}
            <GlassCard className="lg:col-span-4 p-10 border-l-4 border-sky-500 bg-sky-500/[0.02]">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-sky-500/20 text-sky-400 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-sky-500/20">
                        <Utensils size={24} />
                    </div>
                    <h3 className="font-black text-white uppercase tracking-widest text-xs">Gasto Alimentación</h3>
                </div>

                <div className="space-y-4 border-b border-white/5 pb-8 mb-8">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Total Súper:</span>
                        <span className="text-white">${budget.foodTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold italic text-sky-400/70">
                        <span>Base de división:</span>
                        <span>{budget.adultsUsed} Adultos</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-4 border-t border-white/5">
                        <span>Cuota Super:</span>
                        <span className="text-sky-400">${budget.foodPerAdult.toFixed(2)}</span>
                    </div>
                </div>

                <div className="p-6 bg-sky-500/5 rounded-2xl border border-sky-500/10">
                    <p className="text-[9px] font-black uppercase text-sky-400 tracking-[0.2em] mb-2 text-center">
                        Inversión en comida p/p
                    </p>
                    <h2 className="text-4xl font-black text-white text-center tracking-tight">${budget.foodPerAdult.toFixed(2)}</h2>
                </div>
            </GlassCard>

            {/* CARD 3: TOTAL HIGHLIGHT */}
            <GlassCard className="lg:col-span-4 p-10 bg-gradient-to-br from-sky-600 to-sky-900 border-none flex flex-col justify-between overflow-hidden relative">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div>
                    <p className="text-[10px] font-black text-sky-200 uppercase tracking-[0.3em] mb-2">Cuotas Estimadas</p>
                    <div className="space-y-4 mt-6">
                        <div className="relative z-10">
                            <h2 className="text-5xl font-black text-white leading-none tracking-tighter">${budget.totalPerAdult.toFixed(2)}</h2>
                            <p className="text-[10px] font-bold text-sky-300 mt-2 uppercase tracking-[0.2em]">Costo por Adulto</p>
                        </div>
                        <div className="relative z-10 pt-4 border-t border-white/10">
                            <h2 className="text-3xl font-black text-sky-200 leading-none tracking-tighter">${budget.juniorQuota.toFixed(2)}</h2>
                            <p className="text-[9px] font-bold text-sky-400 mt-2 uppercase tracking-[0.2em]">Costo por Junior</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 relative z-10 opacity-60">
                    <p className="text-[9px] text-sky-100 font-medium italic">Calculado para {budget.adultsUsed} adultos y {budget.juniorsUsed} juniors.</p>
                </div>
            </GlassCard>

        </div>
    );
};
