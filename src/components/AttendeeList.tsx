'use client';

import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Trash2, User, Edit2, Save, X } from 'lucide-react';
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
        <div className="w-full max-w-4xl mx-auto space-y-4 px-4 pb-32">
            <div className="flex justify-between items-center px-4 mb-6">
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <User className="text-sky-500" />
                    Lista de Confirmados
                </h2>
                <span className="text-[10px] font-black bg-white/5 px-4 py-2 rounded-full border border-white/10 text-slate-400">
                    {attendees.length} PERSONAS
                </span>
            </div>

            <AnimatePresence mode="popLayout">
                {attendees.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        className="text-center py-24 flex flex-col items-center gap-4"
                    >
                        <User size={48} strokeWidth={1} />
                        <p className="text-sm font-medium">Aún no hay nadie registrado</p>
                    </motion.div>
                ) : (
                    attendees.map((person, index) => (
                        <motion.div
                            layout
                            key={person.$id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="group"
                        >
                            <GlassCard className="p-5 flex items-center justify-between group-hover:bg-white/[0.07] transition-all">
                                {editingId === person.$id ? (
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                                            <Edit2 size={20} />
                                        </div>
                                        <div className="flex flex-col gap-2 flex-1">
                                            <input
                                                value={editForm.name}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="bg-transparent border-b border-white/10 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors w-full"
                                                placeholder="Nombre"
                                                autoFocus
                                            />
                                            <input
                                                value={editForm.age}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                                                className="bg-transparent border-b border-white/10 text-xs font-medium text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors w-20"
                                                placeholder="Edad"
                                                type="number"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={cancelEditing} className="p-2 text-red-400 hover:bg-white/5 rounded-lg" title="Cancelar">
                                                <X size={18} />
                                            </button>
                                            <button onClick={() => person.$id && saveEdit(person.$id)} className="p-2 text-emerald-400 hover:bg-white/5 rounded-lg" title="Guardar">
                                                <Save size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-black">
                                                {person.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">{person.name}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                    <span className="text-slate-500">{person.age} años</span>
                                                    <span className="text-slate-700">•</span>
                                                    {person.age > 12 ? (
                                                        <span className="text-sky-400 font-black">Adulto</span>
                                                    ) : person.age > 5 ? (
                                                        <span className="text-amber-500 font-black">Junior</span>
                                                    ) : (
                                                        <span className="text-emerald-500 font-black">Gratis</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditing(person)}
                                                className="p-3 rounded-xl hover:bg-sky-500/10 text-slate-600 hover:text-sky-400 transition-all"
                                                title="Editar"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => person.$id && onRemove(person.$id)}
                                                className="p-3 rounded-xl hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </GlassCard>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};
