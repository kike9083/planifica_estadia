'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AdminPanel } from '@/components/AdminPanel';
import { useAppLogic } from '@/hooks/useAppLogic';
import { useAuth } from '@/context/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { StatsDashboard } from '@/components/StatsDashboard';
import { AttendeeForm } from '@/components/AttendeeForm';
import { AttendeeList } from '@/components/AttendeeList';
import { ShoppingList } from '@/components/ShoppingList';
import { FoodMenu } from '@/components/FoodMenu';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { PlanSelector } from '@/components/PlanSelector';
import { TripSummary } from '@/components/TripSummary';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
    const [activeTab, setActiveTab] = useState('people');
    const {
        attendees,
        loading,
        stats,
        calculateBudget,
        addAttendee,
        removeAttendee,
        updateAttendee,
        saveOperation,
        prices,
        menu,
        saveMenu,
        tripDuration,
        simAdults,
        setSimAdults,
        inventory,
        saveInventoryItem,
        deleteInventoryItem,
        proteins,
        veggies,
        updatePrice,
        addPriceItem,
        deletePriceItem,
        plans,
        currentPlan,
        createPlan,
        selectPlan,
        updatePlanConfig,
        deletePlan,
        renamePlan,
        updateProductQty
    } = useAppLogic();

    const { user, role, loading: authLoading, userName } = useAuth();

    // Use simAdults but prioritize real confirmed count if it's higher or if we want precision
    const adultsToUse = Math.max(stats.adults, simAdults);
    const juniorsToUse = stats.juniors; // Juniors are always real confirmed
    const currentBudget = calculateBudget(adultsToUse, juniorsToUse, adultsToUse + juniorsToUse);

    return (
        <div className="relative min-h-screen bg-[#070b14] text-slate-200 selection:bg-sky-500/30 font-sans antialiased" suppressHydrationWarning={true}>
            {/* Background Orbs Avanzados */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-sky-600/10 blur-[130px] rounded-full" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[130px] rounded-full" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-600/5 blur-[130px] rounded-full" />
            </div>

            {/* Header ProMax - Más compacto y elegante */}
            <header className="sticky top-0 z-40 backdrop-blur-md bg-[#070b14]/50 border-b border-white/5 py-6 px-8 animate-slide-down">
                <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                            <span className="text-white font-black text-xl">P</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black bg-white bg-clip-text text-transparent tracking-tighter">
                                Planifica Estadía
                            </h1>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] leading-none">
                                {userName ? `Hola, ${userName}` : 'ProMax Edition'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <PlanSelector
                            plans={plans}
                            currentPlan={currentPlan}
                            onSelect={selectPlan}
                            onCreate={createPlan}
                            onDelete={deletePlan}
                            onRename={renamePlan}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content con Layout Mejorado */}
            <main className="container mx-auto max-w-6xl relative z-10 px-6 pt-12 pb-40">
                <AnimatePresence mode="wait">
                    {activeTab === 'people' && (
                        <motion.div
                            key="people"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        >
                            <StatsDashboard
                                stats={stats}
                                budget={currentBudget}
                                simAdults={simAdults}
                                setSimAdults={setSimAdults}
                            />

                            <div className="mt-20">
                                <div className="flex flex-col items-center mb-10">
                                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Gestión de Grupo</h3>
                                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                                </div>
                                <AttendeeForm onAdd={addAttendee} />
                                <AttendeeList attendees={attendees} onRemove={removeAttendee} onUpdate={updateAttendee} />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'menu' && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-12">
                                <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Carta Alimentación</h2>
                                <p className="text-slate-500 text-sm font-medium">Planificación de comidas diarias.</p>
                            </div>
                            <FoodMenu items={menu} tripDuration={tripDuration} startDate={currentPlan?.startDate} onSaveItem={saveMenu} />
                        </motion.div>
                    )}

                    {activeTab === 'list' && (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Logística de Compras</h2>
                                <p className="text-slate-500 text-sm font-medium">Cantidades estimadas según la población confirmada.</p>
                            </div>
                            <ShoppingList
                                pax={adultsToUse + juniorsToUse}
                                menu={menu}
                                prices={prices}
                                inventory={inventory}
                                proteins={proteins}
                                veggies={veggies}
                                onUpdateQty={updateProductQty}
                                budget={currentBudget}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'summary' && (
                        <motion.div
                            key="summary"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <TripSummary
                                currentPlan={currentPlan}
                                attendees={attendees}
                                budget={currentBudget}
                                stats={stats}
                                menu={menu}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'dash' && (
                        <motion.div
                            key="dash"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <AnalyticsDashboard budget={currentBudget} stats={stats} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Active Plan Name indicator */}
            {currentPlan && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 animate-fade-in pointer-events-none">
                    <span className="bg-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-sky-500/30 backdrop-blur-md">
                        {currentPlan.nombre}
                    </span>
                </div>
            )}

            {/* Floating UI */}
            <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
            <AdminPanel
                prices={prices}
                proteins={proteins}
                veggies={veggies}
                inventory={inventory}
                updatePrice={updatePrice}
                addPriceItem={addPriceItem}
                deletePriceItem={deletePriceItem}
                updatePlanConfig={updatePlanConfig}
                onUpdatePrices={() => window.location.reload()}
                currentPlan={currentPlan}
            />

            {/* Forced Login View */}
            {!user && !authLoading && <LoginModal onClose={() => { }} />}
        </div>
    );
}
