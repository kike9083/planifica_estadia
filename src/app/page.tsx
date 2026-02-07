'use client';

import React, { useState } from 'react';
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
import { DashboardLayout } from '@/components/DashboardLayout';
import { TabId } from '@/components/Sidebar';

export default function App() {
    const [activeTab, setActiveTab] = useState<TabId>('dash');
    const {
        attendees,
        stats,
        calculateBudget,
        addAttendee,
        removeAttendee,
        updateAttendee,
        prices,
        menu,
        saveMenu,
        tripDuration,
        simAdults,
        setSimAdults,
        simulationPrice,
        setSimulationPrice,
        inventory,
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
        updateProductQty,
        deleteInventoryItem
    } = useAppLogic();

    const { user, loading: authLoading, userName, role, logout } = useAuth();

    // Logic: extra simulated people are treated as adults. 
    // If simAdults is 12 and we have 12 real people (11 adults + 1 kid), extra is 0.
    const extraSimulated = Math.max(0, simAdults - stats.people);
    const peopleToUse = stats.people + extraSimulated;
    const adultsToUse = stats.adults + extraSimulated;

    const currentBudget = calculateBudget(peopleToUse, adultsToUse, stats.total + extraSimulated);

    return (
        <DashboardLayout
            activeTab={activeTab === 'settings' ? 'settings' : activeTab}
            setActiveTab={setActiveTab}
            onLogout={logout}
            userName={userName}
            userRole={role}
        >

            {/* Plan Selector inside the dashboard content area for now, or could move to TopBar later */}
            {activeTab !== 'settings' && (
                <div className="mb-8 flex justify-end">
                    <PlanSelector
                        plans={plans}
                        currentPlan={currentPlan}
                        onSelect={selectPlan}
                        onCreate={createPlan}
                        onDelete={deletePlan}
                        onRename={renamePlan}
                    />
                </div>
            )}

            <AnimatePresence mode="wait">
                {activeTab === 'dash' && (
                    <motion.div
                        key="dash"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Dashboard General</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8">Resumen de actividad y métricas clave.</p>
                        <AnalyticsDashboard budget={currentBudget} stats={stats} />
                    </motion.div>
                )}

                {activeTab === 'people' && (
                    <motion.div
                        key="people"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Gestión de Grupo</h2>
                            <p className="text-slate-500 text-sm font-medium">Administra los asistentes y simulaciones.</p>
                        </div>

                        <StatsDashboard
                            stats={stats}
                            budget={currentBudget}
                            simAdults={simAdults}
                            setSimAdults={setSimAdults}
                            simulationPrice={simulationPrice}
                            setSimulationPrice={setSimulationPrice}
                        />

                        <div className="mt-12">
                            <AttendeeForm onAdd={addAttendee} />
                            <AttendeeList attendees={attendees} onRemove={removeAttendee} onUpdate={updateAttendee} />
                        </div>
                    </motion.div>
                )}

                {activeTab === 'menu' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Carta Alimentación</h2>
                            <p className="text-slate-500 text-sm font-medium">Planificación de comidas diarias.</p>
                        </div>
                        <FoodMenu items={menu} tripDuration={tripDuration} startDate={currentPlan?.startDate} onSaveItem={saveMenu} />
                    </motion.div>
                )}

                {activeTab === 'list' && (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="mb-8 text-center md:text-left">
                            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Logística de Compras</h2>
                            <p className="text-slate-500 text-sm font-medium">Cantidades estimadas según la población confirmada.</p>
                        </div>
                        <ShoppingList
                            pax={peopleToUse}
                            menu={menu}
                            prices={prices}
                            inventory={inventory}
                            proteins={proteins}
                            veggies={veggies}
                            onUpdateQty={updateProductQty}
                            onDeleteItem={deleteInventoryItem}
                            budget={currentBudget}
                        />
                    </motion.div>
                )}

                {activeTab === 'summary' && (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Reporte Final</h2>
                            <p className="text-slate-500 text-sm font-medium">Resumen ejecutivo y exportación.</p>
                        </div>
                        <TripSummary
                            currentPlan={currentPlan}
                            attendees={attendees}
                            budget={currentBudget}
                            stats={stats}
                            menu={menu}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admin Panel Controlled via 'settings' tab */}
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
                isOpen={activeTab === 'settings'}
                onClose={() => setActiveTab('dash')}
            />

            {/* Forced Login View */}
            {!user && !authLoading && <LoginModal onClose={() => { }} />}
        </DashboardLayout>
    );
}
