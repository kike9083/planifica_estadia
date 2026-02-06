'use client';

import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Briefcase, Plus, ChevronDown, Check, FolderOpen, Trash2, Edit2, Save, X } from 'lucide-react';
import { Plan } from '@/hooks/useAppLogic';

interface PlanSelectorProps {
    plans: Plan[];
    currentPlan: Plan | null;
    onSelect: (plan: Plan) => void;
    onCreate: (name: string) => Promise<any>;
    onDelete: (id: string) => Promise<boolean>;
    onRename: (id: string, name: string) => Promise<boolean>;
}

export const PlanSelector = ({ plans, currentPlan, onSelect, onCreate, onDelete, onRename }: PlanSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlanName, setNewPlanName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlanName.trim()) return;

        const plan = await onCreate(newPlanName);
        if (plan) {
            setNewPlanName('');
            setIsCreating(false);
        }
    };

    const handleRename = async (id: string) => {
        if (!editName.trim()) return;
        const success = await onRename(id, editName);
        if (success) setEditingId(null);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de eliminar esta planificación? Se perderán todos los datos asociados.')) {
            await onDelete(id);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                title="Cambiar planificación"
            >
                <div className="p-1.5 bg-sky-500/20 rounded-lg text-sky-400">
                    <Briefcase size={16} />
                </div>
                <div className="text-left hidden md:block">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Planificación Activa</p>
                    <p className="text-sm font-bold text-white leading-none">{currentPlan?.nombre || 'Seleccionar...'}</p>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 z-50 animate-fade-in">
                    <GlassCard className="p-4 bg-slate-900/95 border-slate-700 shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Mis Planes</span>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="p-1 hover:bg-white/5 rounded-md text-sky-400 transition-colors"
                                title="Nuevo Plan"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-1 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {plans.map(plan => (
                                <div key={plan.$id} className="group relative">
                                    {editingId === plan.$id ? (
                                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                                            <input
                                                autoFocus
                                                className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 p-1"
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                title="Editar nombre del plan"
                                            />
                                            <button onClick={() => handleRename(plan.$id)} className="text-emerald-400 p-1" title="Guardar nombre"><Check size={14} /></button>
                                            <button onClick={() => setEditingId(null)} className="text-red-400 p-1" title="Cancelar"><X size={14} /></button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => {
                                                onSelect(plan);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all cursor-pointer ${currentPlan?.$id === plan.$id ? 'bg-sky-500/10 border border-sky-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FolderOpen size={16} className={currentPlan?.$id === plan.$id ? 'text-sky-400' : 'text-slate-500'} />
                                                <span className={`text-sm font-bold truncate ${currentPlan?.$id === plan.$id ? 'text-white' : 'text-slate-400'}`}>
                                                    {plan.nombre}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="hidden group-hover:flex items-center gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingId(plan.$id);
                                                            setEditName(plan.nombre);
                                                        }}
                                                        className="p-1.5 hover:bg-white/10 rounded-md text-slate-500 hover:text-sky-400 transition-all"
                                                        title="Renombrar"
                                                    >
                                                        <Edit2 size={12} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(e, plan.$id)}
                                                        className="p-1.5 hover:bg-white/10 rounded-md text-slate-500 hover:text-red-400 transition-all"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                                {currentPlan?.$id === plan.$id && <Check size={14} className="text-sky-400" />}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {isCreating && (
                            <form onSubmit={handleCreate} className="mt-4 pt-4 border-t border-white/5 animate-slide-up">
                                <input
                                    type="text"
                                    value={newPlanName}
                                    onChange={(e) => setNewPlanName(e.target.value)}
                                    placeholder="Nombre del nuevo viaje..."
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 mb-2"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter hover:bg-white/10"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-3 py-2 rounded-lg bg-sky-500 text-[10px] font-bold text-white uppercase tracking-tighter hover:bg-sky-400"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </form>
                        )}
                    </GlassCard>
                </div>
            )}
        </div>
    );
};
