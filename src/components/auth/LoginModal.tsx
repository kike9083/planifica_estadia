import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Lock, UserPlus, LogIn } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';

export const LoginModal = ({ onClose }: { onClose: () => void }) => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(email, pass);
            } else {
                // Registro
                await account.create(ID.unique(), email, pass, name);
                await login(email, pass);
            }
            onClose();
        } catch (err: any) {
            console.error('Error details:', err);
            if (err.code === 401) {
                setError('Credenciales inválidas o sesión expirada.');
            } else if (err.code === 409) {
                setError('El usuario ya existe. Intenta iniciar sesión.');
            } else if (err.code === 429) {
                setError('Demasiados intentos. Intenta más tarde.');
            } else {
                setError(`Error: ${err.message || 'Error desconocido'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <GlassCard className="w-full max-w-sm p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                    title="Cerrar"
                >
                    <X size={20} />
                </button>

                <div className="mb-6 text-center">
                    <div className="w-12 h-12 bg-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sky-400">
                        {isLogin ? <Lock size={24} /> : <UserPlus size={24} />}
                    </div>
                    <h2 className="text-2xl font-black text-white">{isLogin ? 'Acceso Seguro' : 'Crear Cuenta'}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                        {isLogin ? 'Identifícate para gestionar el sistema' : 'Únete al equipo de planificación'}
                    </p>
                </div>

                <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${isLogin ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Ingresar
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${!isLogin ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Registrarse
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="animate-slide-down">
                            <input
                                type="text"
                                placeholder="Nombre Completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
                            autoFocus
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
                            required
                        />
                        {!isLogin && (
                            <p className="text-[10px] text-slate-500 mt-1 pl-1">Mínimo 8 caracteres</p>
                        )}
                    </div>

                    {error && <p className="text-red-400 text-xs text-center font-bold px-2 bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Procesando...' : (isLogin ? <><LogIn size={18} /> Iniciar Sesión</> : <><UserPlus size={18} /> Crear Cuenta</>)}
                    </button>
                </form>
            </GlassCard>
        </div>
    );
};

