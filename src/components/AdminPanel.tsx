'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { Settings, Save, X, Edit3, Plus, Trash2, Lock } from 'lucide-react';
import { databases, APPWRITE_CONFIG } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/context/AuthContext';

interface AdminPanelProps {
    prices: any;
    proteins: any[];
    veggies: any[];
    inventory: any[];
    updatePrice: (collection: string, id: string, price: number) => Promise<boolean>;
    addPriceItem: (collection: string, item: any) => Promise<boolean>;
    deletePriceItem: (collection: string, id: string) => Promise<boolean>;
    updatePlanConfig: (config: { duration?: number, nightPrice?: number, startDate?: string }) => Promise<boolean>;
    onUpdatePrices: () => void;
    currentPlan: any;
    isOpen?: boolean;
    onClose?: () => void;
}

export const AdminPanel = ({ prices, proteins, veggies, inventory, updatePrice, addPriceItem, deletePriceItem, updatePlanConfig, onUpdatePrices, currentPlan, isOpen = false, onClose }: AdminPanelProps) => {
    const { role, user } = useAuth();
    const [activeTab, setActiveTab] = useState<'config' | 'prices'>('config');
    const [tripDuration, setTripDuration] = useState('3');
    const [nightPrice, setNightPrice] = useState('0');
    const [startDate, setStartDate] = useState('');
    const [saving, setSaving] = useState(false);
    const [priceCategory, setPriceCategory] = useState<'meat' | 'super' | 'veggies'>('meat');

    // Estado local para inputs (id -> precio)
    const [localPrices, setLocalPrices] = useState<Record<string, string>>({});
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newItem, setNewItem] = useState({ nombre: '', precio: '', unidad: '' });

    // Sincronizar tripDuration con el plan actual cuando se abra el panel
    useEffect(() => {
        if (currentPlan && isOpen) {
            setTripDuration(currentPlan.tripDuration?.toString() || '3');
            setNightPrice((currentPlan.nightPrice || 0).toString());
            setStartDate(currentPlan.startDate || new Date().toISOString().split('T')[0]);
        }
    }, [currentPlan, isOpen]);

    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            const success = await updatePlanConfig({
                duration: parseInt(tripDuration),
                nightPrice: parseFloat(nightPrice),
                startDate: startDate
            });
            if (success) {
                alert('Configuración del plan actualizada correctamente');
                if (onClose) onClose();
            } else {
                alert('Error al guardar configuración');
            }
        } catch (e) {
            console.error(e);
            alert('Error al guardar configuración');
        } finally {
            setSaving(false);
        }
    };

    const handlePriceChange = (id: string, val: string) => {
        setLocalPrices(prev => ({ ...prev, [id]: val }));
    };

    const handleSavePrice = async (collection: string, item: any) => {
        const newPriceStr = localPrices[item.$id];
        if (newPriceStr === undefined) return;

        const newPrice = parseFloat(newPriceStr);
        if (isNaN(newPrice)) {
            alert('Precio inválido');
            return;
        }

        const success = await updatePrice(collection, item.$id, newPrice);
        if (success) {
            setLocalPrices(prev => {
                const next = { ...prev };
                delete next[item.$id];
                return next;
            });
        }
    };

    const handleAddNew = async () => {
        if (!newItem.nombre || !newItem.precio) {
            alert('Nombre y precio son requeridos');
            return;
        }
        const { items: _, collection } = getItems();
        const success = await addPriceItem(collection, newItem);
        if (success) {
            setNewItem({ nombre: '', precio: '', unidad: '' });
            setIsAddingNew(false);
        }
    };

    const handleDelete = async (collection: string, id: string, nombre: string) => {
        if (confirm(`¿Eliminar ${nombre} de la base de datos?`)) {
            await deletePriceItem(collection, id);
        }
    };

    const getItems = () => {
        switch (priceCategory) {
            case 'meat': return { items: proteins || [], collection: 'proteinas', color: 'red' };
            case 'veggies': return { items: veggies || [], collection: 'vegetales', color: 'emerald' };
            case 'super': return { items: inventory || [], collection: 'viveres', color: 'amber' };
            default: return { items: [], collection: '', color: 'gray' };
        }
    };

    const { items: currentItems, collection, color } = getItems();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <GlassCard className="w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-[#0f172a] border-slate-700 shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-500/20 rounded-lg">
                            <Settings className="text-sky-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">Ajustes de Planificación</h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Personaliza tu estancia</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors" aria-label="Cerrar panel">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-slate-900/50">
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`flex-1 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'config' ? 'text-sky-400 bg-sky-500/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                        Configuración
                        {activeTab === 'config' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('prices')}
                        className={`flex-1 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === 'prices' ? 'text-sky-400 bg-sky-500/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                    >
                        Base de Datos de Precios
                        {activeTab === 'prices' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />}
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-1 bg-slate-900/30">
                    {activeTab === 'config' && (
                        <div className="space-y-8 max-w-2xl mx-auto">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Edit3 size={18} className="text-sky-500" /> Parametros del Viaje
                                </h3>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Duración del Viaje (Días)</label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-sky-500/20 rounded-xl blur group-hover:blur-md transition-all" />
                                                <input
                                                    type="number"
                                                    value={tripDuration}
                                                    onChange={(e) => setTripDuration(e.target.value)}
                                                    className="relative w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-4 text-white font-mono font-bold text-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                                                    placeholder="3"
                                                    title="Duración del viaje en días"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-medium pl-1">Cantidad de noches: {Math.max(0, parseInt(tripDuration || '0') - 1)}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Valor por Noche ($)</label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur group-hover:blur-md transition-all" />
                                                <input
                                                    type="number"
                                                    value={nightPrice}
                                                    onChange={(e) => setNightPrice(e.target.value)}
                                                    className="relative w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-4 text-white font-mono font-bold text-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                                    placeholder="0.00"
                                                    title="Costo por cada noche de estancia"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-medium pl-1">Total Hospedaje: ${(Math.max(0, parseInt(tripDuration || '0') - 1) * parseFloat(nightPrice || '0')).toFixed(2)}</p>
                                        </div>

                                        <div className="space-y-4 md:col-span-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Fecha de Llegada</label>
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-amber-500/20 rounded-xl blur group-hover:blur-md transition-all" />
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="relative w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-4 text-white font-mono font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                                                    title="Selecciona la fecha de inicio del viaje"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleSaveConfig} disabled={saving} className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 h-14 text-lg shadow-lg shadow-sky-900/20">
                                {saving ? 'Aplicando Cambios...' : 'Guardar Nueva Configuración'}
                            </Button>
                        </div>
                    )}

                    {activeTab === 'prices' && (
                        <div className="space-y-6 h-full flex flex-col">
                            {/* Subtabs for categories */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5 pb-4">
                                <div className="flex gap-2 p-1 bg-slate-950/50 rounded-xl border border-white/5">
                                    <button onClick={() => setPriceCategory('meat')} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${priceCategory === 'meat' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-white'}`}>Proteínas</button>
                                    <button onClick={() => setPriceCategory('veggies')} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${priceCategory === 'veggies' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}>Vegetales</button>
                                    <button onClick={() => setPriceCategory('super')} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${priceCategory === 'super' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}>Supermercado</button>
                                </div>
                                <button
                                    onClick={() => setIsAddingNew(!isAddingNew)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${isAddingNew ? 'bg-slate-700 text-white' : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 border border-sky-500/30'}`}
                                >
                                    {isAddingNew ? <X size={16} /> : <Plus size={16} />}
                                    {isAddingNew ? 'Cancelar' : 'Nuevo Producto'}
                                </button>
                            </div>

                            {isAddingNew && (
                                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 animate-slide-down">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre del Producto</label>
                                        <input
                                            type="text"
                                            value={newItem.nombre}
                                            onChange={e => setNewItem({ ...newItem, nombre: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500"
                                            placeholder="Ej: Pollo Entero..."
                                        />
                                    </div>
                                    <div className="w-full md:w-32 space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Precio ($)</label>
                                        <input
                                            type="number"
                                            value={newItem.precio}
                                            onChange={e => setNewItem({ ...newItem, precio: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-sky-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="w-full md:w-32 space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unidad</label>
                                        <input
                                            type="text"
                                            value={newItem.unidad}
                                            onChange={e => setNewItem({ ...newItem, unidad: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500"
                                            placeholder="LB, UD, etc"
                                        />
                                    </div>
                                    <div className="md:self-end">
                                        <Button onClick={handleAddNew} className="bg-emerald-600 hover:bg-emerald-500 h-10 px-8">Guardar</Button>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto pr-2">
                                {currentItems.length === 0 ? (
                                    <div className="text-center py-20 text-slate-500">
                                        No hay ítems en esta categoría
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {currentItems.map((item) => {
                                            const hasChange = localPrices[item.$id] !== undefined && localPrices[item.$id] !== item.precio.toString();

                                            return (
                                                <div key={item.$id} className={`group bg-slate-950/50 hover:bg-slate-950 p-4 rounded-xl border transition-all duration-300 ${hasChange ? `border-${color}-500/50 ring-1 ring-${color}-500/20` : 'border-white/5 hover:border-white/10'}`}>
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-wide truncate pr-2" title={item.nombre}>
                                                            {item.nombre}
                                                        </span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded bg-${color}-500/10 text-${color}-400 font-bold uppercase`}>
                                                            {item.unidad || 'Unidad'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <div className="relative flex-1">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                                            <input
                                                                type="number"
                                                                value={localPrices[item.$id] !== undefined ? localPrices[item.$id] : item.precio}
                                                                onChange={(e) => handlePriceChange(item.$id, e.target.value)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-7 pr-3 text-white font-mono font-bold focus:outline-none focus:border-sky-500 focus:bg-white/10 transition-colors"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                title={`Precio de ${item.nombre}`}
                                                            />
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleSavePrice(collection, item)}
                                                                disabled={!hasChange}
                                                                className={`p-2 rounded-lg transition-all ${hasChange
                                                                    ? 'bg-sky-500 text-white shadow-lg hover:scale-105 active:scale-95'
                                                                    : 'bg-white/5 text-slate-600 cursor-not-allowed'}`}
                                                                title="Guardar cambio"
                                                            >
                                                                <Save size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(collection, item.$id, item.nombre)}
                                                                className="p-2 rounded-lg bg-white/5 text-slate-600 hover:text-red-500 transition-all"
                                                                title="Eliminar de la base de datos"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};
