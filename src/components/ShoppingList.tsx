'use client';

import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { ShoppingCart, Leaf, Beef, Store, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

interface ShoppingListProps {
    pax: number;
    menu?: any[];
    prices?: any;
    inventory?: any[];
    proteins?: any[];
    veggies?: any[];
    onUpdateQty?: (collId: string, id: string, qty: number) => Promise<boolean>;
    onDeleteItem?: (collId: string, id: string) => Promise<boolean>;
    budget?: any;
}

export const ShoppingList = ({ pax, menu = [], inventory = [], proteins = [], veggies = [], onUpdateQty, onDeleteItem, budget }: ShoppingListProps) => {
    const { user } = useAuth();
    const paxCount = pax || 1;
    const [editingItem, setEditingItem] = React.useState<{ collId: string, id: string, val: string } | null>(null);
    const [checkedItems, setCheckedItems] = React.useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(id)) newChecked.delete(id);
        else newChecked.add(id);
        setCheckedItems(newChecked);
    };

    const handleUpdateQty = async () => {
        if (editingItem && onUpdateQty) {
            const val = parseFloat(editingItem.val);
            if (!isNaN(val)) {
                await onUpdateQty(editingItem.collId, editingItem.id, val);
            }
            setEditingItem(null);
        }
    };

    const handleDelete = async (collId: string, id: string) => {
        if (confirm('¿Eliminar producto de la lista?') && onDeleteItem) {
            await onDeleteItem(collId, id);
        }
    };

    const Section = ({ title, icon: Icon, color, items, emptyMessage }: any) => (
        <GlassCard className="overflow-hidden flex flex-col border-white/5 group hover:border-white/10 transition-all shadow-lg">
            <div className={`bg-white/5 px-5 py-3 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-transparent to-white/[0.02]`}>
                <div className="flex items-center gap-2">
                    <Icon size={14} className={color} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-600 tabular-nums bg-white/5 px-2 py-0.5 rounded-full border border-white/5">{items.length}</span>
                </div>
            </div>
            <div className="p-4 flex-1">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-30">
                        <AlertCircle size={18} className="mb-2 text-slate-500" />
                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                            {emptyMessage || 'Vacío'}
                        </p>
                    </div>
                ) : (
                    <div className={`grid gap-2 ${((title.toLowerCase().includes('proteínas') || title.toLowerCase().includes('vegetales')) && items.length <= 10)
                        ? 'grid-cols-1'
                        : 'grid-cols-1 sm:grid-cols-2'
                        }`}>
                        {items.map((item: any, i: number) => {
                            const isEditing = editingItem?.id === item.$id;
                            const isChecked = checkedItems.has(item.$id);
                            const currentQty = item.cantidad > 0 ? item.cantidad : calculateQty(item.nombre);
                            const collId = title.toLowerCase().includes('proteínas') ? 'proteinas' :
                                title.toLowerCase().includes('vegetales') ? 'vegetales' : 'viveres';

                            return (
                                <div
                                    key={i}
                                    className={`group/item flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.05] p-2.5 rounded-xl border transition-all h-full cursor-pointer ${isChecked ? 'opacity-40 border-emerald-500/10 grayscale-[0.8]' : 'border-white/5 hover:border-white/10'
                                        }`}
                                    onClick={() => !isEditing && toggleItem(item.$id)}
                                >
                                    <div className="flex flex-col min-w-0 flex-1 pr-1">
                                        <div className="flex items-center gap-2 mb-1 overflow-hidden">
                                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all shrink-0 ${isChecked ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-white/20'
                                                }`}>
                                                {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <span
                                                className={`text-[10px] font-bold text-slate-200 truncate ${isChecked ? 'line-through' : ''}`}
                                                title={item.nombre}
                                            >
                                                {item.nombre}
                                            </span>
                                            {item.cantidad > 0 && (
                                                <div className="w-1 h-1 rounded-full bg-sky-500 shrink-0 shadow-[0_0_5px_rgba(14,165,233,0.5)]" title="Ajuste manual activo" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 pl-5">
                                            <span className="text-[8px] text-slate-500 font-mono">
                                                ${(item?.precio || 0).toFixed(2)}
                                            </span>
                                            <span className="text-[8px] text-sky-400/60 font-black tabular-nums">
                                                / ${(parseFloat(currentQty.toString()) * (item?.precio || 0)).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center" onClick={e => e.stopPropagation()}>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={editingItem?.val || ''}
                                                onChange={e => setEditingItem(prev => prev ? { ...prev, val: e.target.value } : null)}
                                                onBlur={handleUpdateQty}
                                                onKeyDown={e => e.key === 'Enter' && handleUpdateQty()}
                                                autoFocus
                                                title="Editar cantidad"
                                                aria-label="Editar cantidad del producto"
                                                placeholder="0.0"
                                                className="w-12 bg-slate-900 border border-sky-500/50 rounded-lg px-1.5 py-0.5 text-[10px] text-white focus:outline-none focus:ring-1 ring-sky-500/10 text-center"
                                            />
                                        ) : (
                                            <div
                                                onClick={() => setEditingItem({ collId, id: item.$id, val: currentQty.toString() })}
                                                className={`flex flex-col items-center justify-center min-w-[34px] h-[34px] cursor-pointer rounded-lg border transition-all ${item.cantidad > 0 ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' : 'bg-white/5 border-transparent hover:border-white/10 text-slate-400'}`}
                                            >
                                                <span className="text-[10px] font-black leading-none">{currentQty}</span>
                                                <span className="text-[7px] font-bold uppercase tracking-tighter opacity-50 leading-tight">{item.unidad || 'UD'}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(collId, item.$id);
                                        }}
                                        className="ml-2 p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"
                                        title="Eliminar ítem"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </GlassCard>
    );

    // Higher-precision portions
    const getPortion = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('costillón') || n.includes('puerco') || n.includes('costilla')) return 0.7;
        if (n.includes('rabo')) return 1.0;
        if (n.includes('pollo')) return 1.3;
        if (n.includes('carne')) return 0.6;
        if (n.includes('chorizo')) return 0.4;
        if (n.includes('yuca')) return 0.5;
        if (n.includes('plátano')) return 1.0;
        if (n.includes('limón')) return 2.0;
        if (n.includes('arroz')) return 0.25;
        if (n.includes('huevo')) return 2.0;
        if (n.includes('pan')) return 1.2;
        if (n.includes('tocino')) return 0.25;
        return 1.0;
    };

    const calculateQty = (name: string) => {
        if (!menu || menu.length === 0) {
            return (paxCount * getPortion(name)).toFixed(1);
        }

        const lowerName = name.toLowerCase();

        // Count specific occurrences in menu
        const count = menu.filter(m =>
            m.comida.toLowerCase().includes(lowerName) ||
            (m.descripcion && m.descripcion.toLowerCase().includes(lowerName))
        ).length;

        // Staples logic
        if (count === 0) {
            const isStaple = lowerName.includes('aceite') || lowerName.includes('sal') || lowerName.includes('snack') ||
                lowerName.includes('kit') || lowerName.includes('harina') || lowerName.includes('queso') ||
                lowerName.includes('mantequilla');
            return isStaple ? "1" : "0";
        }

        return (count * paxCount * getPortion(name)).toFixed(1);
    };

    // Cost Totals from unified budget
    const proteinsTotal = budget?.foodBreakdown?.proteins || 0;
    const veggiesTotal = budget?.foodBreakdown?.veggies || 0;
    const inventoryTotal = budget?.foodBreakdown?.inventory || 0;
    const miscBuffer = budget?.foodBreakdown?.misc || 0;
    const grandTotal = budget?.foodTotal || 0;

    const renderItemTotal = (item: any) => {
        const qty = item.cantidad > 0 ? item.cantidad : parseFloat(calculateQty(item.nombre));
        const total = qty * (item.precio || 0);
        if (total === 0) return null;
        return (
            <div key={item.$id} className="group flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors border-b border-white/[0.03] last:border-0">
                <div className="flex items-center gap-1 max-w-[70%]">
                    <span className="text-[10px] text-slate-300 font-medium truncate" title={item.nombre}>{item.nombre}</span>
                    <span className="text-[8px] text-slate-600 font-mono truncate">({qty}{item.unidad})</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-bold">${(total || 0).toFixed(2)}</span>
            </div>
        );
    };

    // Calculate distribution percentages
    const protPerc = (proteinsTotal / (grandTotal || 1)) * 100;
    const vegPerc = (veggiesTotal / (grandTotal || 1)) * 100;
    const invPerc = (inventoryTotal / (grandTotal || 1)) * 100;
    const miscPerc = (miscBuffer / (grandTotal || 1)) * 100;

    return (
        <div className="space-y-8 animate-fade-in">
            {!user && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-center gap-4">
                    <AlertCircle className="text-amber-500" />
                    <div>
                        <p className="text-sm font-bold text-white">Inicia sesión para ver tu lista personalizada</p>
                        <p className="text-xs text-slate-500">Cada usuario gestiona sus propios productos y precios.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                <Section
                    title="Proteínas"
                    icon={Beef}
                    color="text-red-400/80"
                    items={proteins}
                    emptyMessage="Sin proteínas"
                />
                <Section
                    title="Vegetales"
                    icon={Leaf}
                    color="text-emerald-400/80"
                    items={veggies}
                    emptyMessage="Sin vegetales"
                />
                <Section
                    title="Víveres Supermercado"
                    icon={Store}
                    color="text-sky-400/80"
                    items={inventory}
                    emptyMessage="Sin víveres"
                />

                {/* CARD 4: RESUMEN DE COSTOS - FULL WIDTH AT BOTTOM */}
                <GlassCard className="lg:col-span-3 p-8 md:p-12 border-l-4 border-amber-500 bg-amber-500/[0.02] flex flex-col gap-12 shadow-2xl overflow-hidden relative border-white/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.03] blur-[120px] -z-10 rounded-full" />

                    {/* TOP BAR: TOTALS & CHART */}
                    <div className="flex flex-col xl:flex-row gap-10 items-start xl:items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center shadow-lg border border-amber-500/20 shrink-0">
                                <ShoppingCart size={28} />
                            </div>
                            <div>
                                <h3 className="font-black text-white uppercase tracking-[0.3em] text-xs mb-1">Logística de Inversión</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Aprovisionamiento Total para {paxCount} personas</p>
                            </div>
                        </div>

                        <div className="flex-1 max-w-xl space-y-4">
                            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden flex shadow-inner border border-white/5 group">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${protPerc}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                                    title={`Proteínas: ${(protPerc || 0).toFixed(1)}%`}
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${vegPerc}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                                    className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                                    title={`Vegetales: ${(vegPerc || 0).toFixed(1)}%`}
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${invPerc}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                    className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                    title={`Víveres: ${(invPerc || 0).toFixed(1)}%`}
                                />
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${miscPerc}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                    className="h-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                                    title={`Misc: ${(miscPerc || 0).toFixed(1)}%`}
                                />
                            </div>
                            <div className="flex flex-wrap gap-x-8 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Proteínas {(protPerc || 0).toFixed(0)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Vegetales {(vegPerc || 0).toFixed(0)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Víveres {(invPerc || 0).toFixed(0)}%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Esenciales {(miscPerc || 0).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)] relative overflow-hidden flex flex-col items-center xl:items-end shrink-0 min-w-[220px]">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-2 leading-none">Inversión Final</p>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-none">${(grandTotal || 0).toFixed(2)}</h2>
                        </div>
                    </div>

                    {/* DETAILED LOGISTICS GRID - ALL VISIBLE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 border-t border-white/5 pt-12">
                        {/* CATEGORY: PROTEINS */}
                        <div className="space-y-6">
                            <header className="flex justify-between items-center border-b border-white/5 pb-3">
                                <span className="text-xs font-black text-sky-400 uppercase tracking-[0.2em]">Proteínas</span>
                                <span className="text-xs font-mono font-black text-white">${(proteinsTotal || 0).toFixed(2)}</span>
                            </header>
                            <div className="space-y-1">
                                {proteins.map(renderItemTotal)}
                            </div>
                        </div>

                        {/* CATEGORY: VEGGIES */}
                        <div className="space-y-6">
                            <header className="flex justify-between items-center border-b border-white/5 pb-3">
                                <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Vegetales</span>
                                <span className="text-xs font-mono font-black text-white">${(veggiesTotal || 0).toFixed(2)}</span>
                            </header>
                            <div className="space-y-1">
                                {veggies.map(renderItemTotal)}
                            </div>
                        </div>

                        {/* CATEGORY: VIVERES (Wide 2-column) */}
                        <div className="xl:col-span-2 space-y-6">
                            <header className="flex justify-between items-center border-b border-white/5 pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Víveres & Abarrotes</span>
                                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">Multicolumna</span>
                                </div>
                                <span className="text-xs font-mono font-black text-white">${(inventoryTotal || 0).toFixed(2)}</span>
                            </header>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-1">
                                {inventory.map(renderItemTotal)}
                            </div>

                            <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row gap-6 items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Misc / Esenciales de Cocina</h4>
                                    <p className="text-[9px] text-slate-500 font-medium leading-relaxed uppercase tracking-tighter max-w-sm">
                                        Aceite, Sal, Snacks, Jarra de refresco, condimentos y kits básicos para el grupo.
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-xl font-mono font-black text-white/90">${(miscBuffer || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
