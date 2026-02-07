'use client';

import React from 'react';
import {
    LayoutDashboard,
    Users,
    UtensilsCrossed,
    ShoppingCart,
    FileText,
    LogOut,
    Settings,
    Menu,
    X,
    HelpCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export type TabId = 'dash' | 'people' | 'menu' | 'list' | 'summary' | 'settings';

interface SidebarProps {
    activeTab: TabId;
    setActiveTab: (tab: TabId) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onLogout: () => void;
    onOpenTutorial: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout, onOpenTutorial }: SidebarProps) => {

    const menuItems = [
        { id: 'dash', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'people', label: 'Gestión Grupo', icon: Users },
        { id: 'menu', label: 'Alimentación', icon: UtensilsCrossed },
        { id: 'list', label: 'Supermercado', icon: ShoppingCart },
        { id: 'summary', label: 'Reporte Final', icon: FileText },
        { id: 'settings', label: 'Configuración', icon: Settings },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-[#0f172a] border-r border-white/5 p-6 relative">
            {/* Logo Area */}
            <div className="flex items-center gap-3 mb-10 px-2 mt-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                    <span className="text-white font-black text-lg">P</span>
                </div>
                <div>
                    <h1 className="text-white font-black text-lg tracking-tight leading-none">Planifica</h1>
                    <span className="text-xs font-bold text-sky-500 uppercase tracking-[0.2em]">Estadía Pro</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Menú Principal</p>

                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id as TabId);
                                if (window.innerWidth < 768) setIsOpen(false);
                            }}
                            className={clsx(
                                "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "text-white"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabBg"
                                    className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 rounded-2xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            <Icon
                                size={20}
                                className={clsx(
                                    "relative z-10 transition-colors duration-300",
                                    isActive ? "text-sky-400" : "group-hover:text-sky-400"
                                )}
                            />

                            <span className={clsx("relative z-10 text-sm font-bold tracking-wide")}>
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/5">
                <button
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:text-sky-400 hover:bg-sky-500/5 transition-all text-sm font-bold group mb-2"
                    onClick={() => {
                        onOpenTutorial();
                        if (window.innerWidth < 768) setIsOpen(false);
                    }}
                >
                    <HelpCircle size={20} className="group-hover:text-sky-400 transition-colors" />
                    <span>Tutorial de Uso</span>
                </button>

                <button
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-bold group"
                    onClick={onLogout}
                >
                    <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                    <span>Cerrar Sesión</span>
                </button>

                <div className="mt-8 px-4 py-4 bg-gradient-to-br from-indigo-900/20 to-sky-900/20 rounded-2xl border border-sky-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl -translate-y-10 translate-x-10" />
                    <h4 className="text-white font-black text-xs mb-1 relative z-10">Plan ProMax</h4>
                    <p className="text-slate-400 text-[10px] mb-3 relative z-10">Lleva tu viaje al siguiente nivel.</p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-72 h-screen fixed left-0 top-0 z-40">
                <SidebarContent />
            </div>

            {/* Mobile Overlay & Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed inset-y-0 left-0 w-72 z-50 overflow-hidden"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
