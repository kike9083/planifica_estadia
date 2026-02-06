'use client';

import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Trash2, User, Edit2, Save, X, Contact } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Attendee } from '@/hooks/useAppLogic';

interface AttendeeListProps {
    attendees: Attendee[];
    onRemove: (id: string) => void;
    onUpdate?: (id: string, name: string, age: number) => Promise<boolean>;
}

export const AttendeeList = ({ attendees, onRemove, onUpdate }: AttendeeListProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: '', age: '' });

    const startEditing = (person: Attendee) => {
        setEditingId(person.$id || null);
        setEditForm({ name: person.name, age: person.age.toString() });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ name: '', age: '' });
    };

    const saveEdit = async (id: string) => {
        if (onUpdate && editForm.name && editForm.age) {
            const success = await onUpdate(id, editForm.name, parseInt(editForm.age));
            if (success) {
                setEditingId(null);
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 px-4 pb-32">
            <div className="flex justify-between items-center bg-white/2 p-6 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                        <Contact size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">Directorio del Viaje</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Población Confirmada</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-white">{attendees.length}</span>
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mt-1">Confirmados</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                <AnimatePresence mode="popLayout">
                    {attendees.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center gap-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                                <User size={32} strokeWidth={1} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">No hay exploradores aún</p>
                        </motion.div>
                    ) : (
                        attendees.map((person, index) => (
                            <motion.div
                                layout
                                key={person.$id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03 }}
                                className="group"
                            >
                                <div className={`relative overflow-hidden p-5 flex items-center justify-between rounded-[2rem] border transition-all duration-500 ${editingId === person.$id
                                    ? 'bg-emerald-500/5 border-emerald-500/20'
                                    : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:translate-x-1'
                                    }`}>
                                    {editingId === person.$id ? (
                                        <div className="flex items-center gap-6 w-full">
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xl">
                                                <Edit2 size={24} />
                                            </div>
                                            <div className="flex flex-col gap-2 flex-1">
                                                <input
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                    className="bg-transparent border-none text-lg font-black text-white focus:outline-none placeholder:text-slate-700 w-full"
                                                    placeholder="Nombre"
                                                    autoFocus
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase">Edad:</span>
                                                    <input
                                                        value={editForm.age}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                                                        className="bg-transparent border-none text-sm font-black text-emerald-400 focus:outline-none w-16"
                                                        placeholder="00"
                                                        type="number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={cancelEditing} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all" aria-label="Cancelar edición">
                                                    <X size={20} />
                                                </button>
                                                <button onClick={() => person.$id && saveEdit(person.$id)} className="w-10 h-10 flex items-center justify-center text-emerald-400 hover:bg-emerald-400/20 rounded-xl transition-all" aria-label="Guardar cambios">
                                                    <Save size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-[1.3rem] flex items-center justify-center font-black text-xl shadow-inner border border-white/5 ${person.age > 12 ? 'bg-sky-500/10 text-sky-400' : person.age > 5 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'
                                                    }`}>
                                                    {person.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-white tracking-tight">{person.name}</span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{person.age} años</span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                                                        {person.age > 12 ? (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-sky-500/5 rounded-full border border-sky-500/10">
                                                                <div className="w-1 h-1 rounded-full bg-sky-500 animate-pulse" />
                                                                <span className="text-[8px] font-black text-sky-400 uppercase tracking-tighter">Adulto</span>
                                                            </div>
                                                        ) : person.age > 5 ? (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/5 rounded-full border border-amber-500/10">
                                                                <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                                                <span className="text-[8px] font-black text-amber-500 uppercase tracking-tighter">Junior</span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                                                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">Gratis</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => startEditing(person)}
                                                    className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/20 transition-all"
                                                    title="Editar"
                                                    aria-label="Editar participante"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => person.$id && onRemove(person.$id)}
                                                    className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                                                    title="Eliminar"
                                                    aria-label="Eliminar participante"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
