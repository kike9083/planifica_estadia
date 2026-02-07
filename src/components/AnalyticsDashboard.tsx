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
                        {budget?.peopleUsed || 0} PERSONAS (PAGAN)
                    </span>
                    <span className="text-[9px] font-black px-2 py-1 bg-white/5 rounded-md text-emerald-500/70 border border-emerald-500/10">
                        {stats?.free || 0} {"GRATUITOS (≤5)"}
                    </span>
                </div>

                <div className="space-y-4 border-b border-white/5 pb-8 mb-6">
                    <div className="flex justify-between text-xs font-medium text-slate-400">
                        <span>Reserva Base ({budget?.nights || 0} noches):</span>
                        <span className="text-white">${(budget?.lodgingBaseTotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-amber-500/80">
                        <span>Recargo p/p Extra:</span>
                        <span>+${(budget?.extraPeopleTotalCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-4 border-t border-white/5">
                        <span>Total Hospedaje:</span>
                        <span className="text-emerald-400">${(budget?.totalLodgingToCover || 0).toFixed(2)}</span>
                    </div>
                </div>

                <div className="text-center py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mb-4">
                    <p className="text-[9px] font-black uppercase text-emerald-500 tracking-[0.2em] mb-2">Cuota Casa p/p</p>
                    <h2 className="text-4xl font-black text-white tracking-tight">${(budget?.housePerPerson || 0).toFixed(2)}</h2>
                    <p className="text-[9px] text-slate-500 mt-1 font-bold italic">
                        {budget?.isIndependent
                            ? `(${(budget?.lodgingBaseTotal || 0).toFixed(2)} ÷ ${budget?.baseCapacity || 1} base)`
                            : `(${(budget?.totalLodgingToCover || 0).toFixed(2)} ÷ ${budget?.peopleUsed || 1} personas)`
                        }
                    </p>
                </div>

                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                    <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed">
                        {budget?.isIndependent
                            ? `* Nota: Cuota fija para los primeros ${budget?.baseCapacity} asistentes; las personas extras pagan recargo individual.`
                            : "* Nota: El costo total se divide por igual entre todos."
                        }
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
                        <span className="text-white">${(budget?.foodTotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold italic text-sky-400/70">
                        <span>Base de división:</span>
                        <span>{budget?.peopleUsed || 0} Personas</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-white pt-4 border-t border-white/5">
                        <span>Cuota Super:</span>
                        <span className="text-sky-400">${(budget?.foodPerPerson || 0).toFixed(2)}</span>
                    </div>
                </div>

                <div className="p-6 bg-sky-500/5 rounded-2xl border border-sky-500/10">
                    <p className="text-[9px] font-black uppercase text-sky-400 tracking-[0.2em] mb-2 text-center">
                        Inversión en comida p/p
                    </p>
                    <h2 className="text-4xl font-black text-white text-center tracking-tight">${budget.foodPerPerson.toFixed(2)}</h2>
                </div>
            </GlassCard>

            {/* CARD 3: TOTAL HIGHLIGHT */}
            <GlassCard className="lg:col-span-4 p-10 bg-gradient-to-br from-sky-600 to-sky-900 border-none flex flex-col justify-between overflow-hidden relative">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div>
                    <p className="text-[10px] font-black text-sky-200 uppercase tracking-[0.3em] mb-2">Cuota Estimada</p>
                    <div className="space-y-4 mt-6">
                        <div className="relative z-10">
                            <h2 className="text-5xl font-black text-white leading-none tracking-tighter">${(budget?.totalPerPerson || 0).toFixed(2)}</h2>
                            <p className="text-[10px] font-bold text-sky-300 mt-2 uppercase tracking-[0.2em]">Costo Final por Persona</p>
                        </div>
                        <div className="relative z-10 pt-4 border-t border-white/10">
                            <h2 className="text-3xl font-black text-sky-200 leading-none tracking-tighter">
                                {budget?.isIndependent ? `$${(budget?.extraFeePerPerson || 0).toFixed(2)}` : (budget?.overLimitCount || 0)}
                            </h2>
                            <p className="text-[9px] font-bold text-sky-400 mt-2 uppercase tracking-[0.2em]">
                                {budget?.isIndependent ? 'Recargo Persona Extra' : 'Personas Extra detectadas'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 relative z-10 opacity-60">
                    <p className="text-[9px] text-sky-100 font-medium italic">
                        {budget?.isIndependent
                            ? `Modo Paquete: ${budget?.baseCapacity} cupos base + extras.`
                            : "Modo Socializado: Todos pagan por igual."
                        }
                    </p>
                </div>
            </GlassCard>

        </div>
    );
};
