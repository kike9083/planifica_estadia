'use client';

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface TopBarProps {
    onMenuClick: () => void;
    userName: string | null;
    userRole: string | null;
}

export const TopBar = ({ onMenuClick, userName, userRole }: TopBarProps) => {
    return (
        <div className="flex items-center justify-between mb-8 gap-4 px-2 md:px-0">
            {/* Mobile Menu Trigger & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl transition-colors"
                >
                    <Menu size={24} />
                </button>

                <div className="relative max-w-md w-full hidden md:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar en tu viaje..."
                        className="w-full bg-[#1e293b]/50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-600 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 md:gap-6">
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]" />
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-black text-white leading-none mb-1">{userName || 'Invitado'}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{userRole || 'Visitante'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5">
                        <div className="w-full h-full rounded-[10px] bg-[#0f172a] flex items-center justify-center overflow-hidden">
                            <img
                                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${userName || 'User'}`}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
