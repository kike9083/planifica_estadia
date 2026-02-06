import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Lock } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const LoginModal = ({ onClose }: { onClose: () => void }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, pass);
            onClose();
        } catch (err: any) {
            console.error('Error details:', err);
            if (err.code === 401) {
                setError('Credenciales inválidas. Verifica tu correo y contraseña.');
            } else if (err.code === 429) {
                setError('Demasiados intentos. Intenta más tarde.');
            } else {
                setError(`Error de conexión: ${err.message || 'Error desconocido'}`);
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
                        <Lock size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-white">Acceso Seguro</h2>
                    <p className="text-xs text-slate-400 mt-1">Identifícate para gestionar el sistema</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
                            autoFocus
                            title="Correo electrónico"
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
                            title="Contraseña"
                            required
                        />
                    </div>

                    {error && <p className="text-red-400 text-xs text-center font-bold px-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                        title="Iniciar Sesión"
                    >
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </GlassCard>
        </div>
    );
};
