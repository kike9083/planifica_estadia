import { useAuth } from '@/context/AuthContext';
import { LogIn, User, Power, Lock, Home, ShoppingCart, Utensils, BarChart2, FileText } from 'lucide-react';
import { LoginModal } from '@/components/auth/LoginModal';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'people', label: 'Presupuesto', icon: Home },
    { id: 'list', label: 'Compras', icon: ShoppingCart },
    { id: 'menu', label: 'Menú', icon: Utensils },
    { id: 'summary', label: 'Resumen', icon: FileText },
    { id: 'dash', label: 'Dashboard', icon: BarChart2 },
];

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
    const { user, role, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
                <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-full p-2 flex gap-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                    {tabs.map((tab) => {
                        // ... existing map logic ...
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`relative p-4 rounded-full flex items-center gap-2 transition-all duration-300 group ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-bg"
                                        className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-sky-400 rounded-full -z-10 shadow-lg shadow-sky-500/40"
                                        transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                                    />
                                )}
                                <div className="relative flex flex-col items-center">
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="transition-transform group-hover:scale-110" />
                                    <span className={`absolute -top-10 bg-slate-900 border border-white/10 text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden lg:block`}>
                                        {tab.label}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Auth Button */}
                <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-full p-2 shadow-2xl">
                    {user ? (
                        <button
                            onClick={logout}
                            className="p-4 rounded-full text-red-400 hover:bg-white/5 transition-colors relative group"
                            title="Cerrar Sesión"
                        >
                            <Power size={20} />
                            <span className="absolute -top-10 right-0 bg-slate-900 border border-white/10 text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Salir ({role})
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowLogin(true)}
                            className="p-4 rounded-full text-emerald-400 hover:bg-white/5 transition-colors relative group"
                            title="Iniciar Sesión"
                        >
                            <LogIn size={20} />
                            <span className="absolute -top-10 right-0 bg-slate-900 border border-white/10 text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Staff Login
                            </span>
                        </button>
                    )}
                </div>
            </nav>

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </>
    );
};
