import React, { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Coffee, Sun, Moon, Edit2, Save, X } from 'lucide-react';
import { Button } from './ui/Button';

interface MenuDocument {
    $id?: string;
    dia: string;
    comida: string;
    descripcion: string;
    categoria: string;
}

interface FoodMenuProps {
    items?: MenuDocument[];
    tripDuration?: number;
    startDate?: string;
    onSaveItem?: (item: any) => Promise<boolean>;
}

export const FoodMenu = ({ items = [], tripDuration = 3, startDate, onSaveItem }: FoodMenuProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleEdit = (item: any, day: string, category: string) => {
        setEditingId(item?.$id || `${day}-${category}`);
        setEditForm({
            $id: item?.$id,
            dia: day,
            categoria: category,
            comida: item?.comida || '',
            descripcion: item?.descripcion || ''
        });
    };

    const handleSave = async () => {
        if (onSaveItem) {
            await onSaveItem(editForm);
            setEditingId(null);
        }
    };

    const getIcon = (dayIndex: number) => {
        const icons = [Coffee, Sun, Moon];
        return icons[dayIndex % 3] || Coffee;
    };

    const formatDate = (dateStr: string, addDays: number) => {
        if (!dateStr) return '';
        // Split date to avoid UTC timezone issues with new Date(str)
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + addDays);
        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
    };

    // Generar estructura de días basada en tripDuration
    const days = Array.from({ length: tripDuration }, (_, i) => {
        const dayLabel = `Día ${i + 1}`;
        const existingItems = items.filter(item => item.dia === dayLabel);

        // Estructura base de comidas por día (Desayuno, Almuerzo, Cena)
        // O lo que el usuario quiera. Por defecto mostraremos slots fijos para editar.
        const categories = ['Desayuno', 'Almuerzo', 'Cena'];

        return {
            label: dayLabel,
            date: startDate ? formatDate(startDate, i) : null,
            icon: getIcon(i),
            categories: categories.map(cat => ({
                label: cat,
                item: existingItems.find(i => i.categoria === cat) || null
            }))
        };
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up pb-32">
            {days.map((day, idx) => (
                <GlassCard key={idx} className="p-8 group hover:border-sky-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-400">
                            <day.icon size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white">{day.label}</h3>
                            {mounted && day.date && <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{day.date}</p>}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {day.categories.map((cat, i) => {
                            const isEditing = editingId === (cat.item?.$id || `${day.label}-${cat.label}`);

                            return (
                                <div key={i} className="relative pl-6 border-l-2 border-slate-700 hover:border-sky-500 transition-colors">
                                    <div className={`absolute top-0 left-[-5px] w-2 h-2 rounded-full ${cat.item ? 'bg-sky-500' : 'bg-slate-700'}`} />

                                    <div className="flex justify-between items-start mb-2 group/edit">
                                        <span className="text-[10px] font-black p-1 px-2 bg-slate-800 text-slate-400 rounded-md inline-block uppercase tracking-wider">
                                            {cat.label}
                                        </span>
                                        {!isEditing && (
                                            <button
                                                onClick={() => handleEdit(cat.item, day.label, cat.label)}
                                                className="text-slate-600 hover:text-sky-400 opacity-0 group-hover/edit:opacity-100 transition-opacity"
                                                aria-label={`Editar ${cat.label} del ${day.label}`}
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-2 animate-fade-in bg-slate-800/50 p-2 rounded-xl border border-sky-500/30">
                                            <input
                                                type="text"
                                                value={editForm.comida}
                                                onChange={e => setEditForm({ ...editForm, comida: e.target.value })}
                                                className="w-full bg-transparent border-b border-sky-500/30 text-xs font-bold text-white focus:outline-none placeholder:text-slate-600 mb-1"
                                                placeholder="Plato principal..."
                                                autoFocus
                                            />
                                            <textarea
                                                value={editForm.descripcion}
                                                onChange={e => setEditForm({ ...editForm, descripcion: e.target.value })}
                                                className="w-full bg-transparent text-[10px] text-slate-300 focus:outline-none resize-none placeholder:text-slate-600"
                                                placeholder="Descripción o acompañamientos..."
                                                rows={2}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button onClick={() => setEditingId(null)} className="text-slate-500 hover:text-white" title="Cancelar"><X size={14} /></button>
                                                <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300" title="Guardar"><Save size={14} /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {cat.item ? (
                                                <div onClick={() => handleEdit(cat.item, day.label, cat.label)} className="cursor-pointer">
                                                    <h4 className="text-xs font-bold text-slate-200 mb-1">{cat.item.comida}</h4>
                                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{cat.item.descripcion}</p>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => handleEdit(null, day.label, cat.label)}
                                                    className="cursor-pointer border border-dashed border-slate-700 rounded-lg p-3 text-center hover:border-sky-500/30 hover:bg-sky-500/5 transition-all group/empty"
                                                >
                                                    <span className="text-[10px] text-slate-600 group-hover/empty:text-sky-400 font-bold uppercase tracking-widest">+ Agregar</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            ))}
        </div>
    );
};
