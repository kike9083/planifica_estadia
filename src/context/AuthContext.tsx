'use client';

import { account, databases, APPWRITE_CONFIG } from '@/lib/appwrite';
import { useState, useEffect, createContext, useContext } from 'react';
import { Query } from 'appwrite';

interface AuthContextType {
    user: any;
    session: any;
    role: 'admin' | 'user' | 'guest';
    loading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    userName: string;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    role: 'guest',
    loading: true,
    login: async () => { },
    logout: async () => { },
    userName: '',
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any>(null);
    const [session, setSession] = useState<any>(null);
    const [role, setRole] = useState<'admin' | 'user' | 'guest'>('guest');
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const current = await account.get();
            setUser(current);

            let assignedRole: 'admin' | 'user' | 'guest' = 'user';

            try {
                // Check role in database
                const userDocs = await databases.listDocuments(
                    APPWRITE_CONFIG.DATABASE,
                    'users',
                    [Query.equal('email', current.email)]
                );
                if (userDocs.documents.length > 0) {
                    const doc = userDocs.documents[0];
                    if (doc.role === 'admin' || doc.role === 'user') {
                        assignedRole = doc.role as 'admin' | 'user';
                    }
                }
            } catch (err) {
                console.warn('Could not fetch roles from DB, using fallback', err);
            }

            // Hardcoded fallback for bootstrap
            const fallbackAdmins = ['admin@skyblue.pro', 'usuario@skyblue.pro', 'admin'];
            if (fallbackAdmins.includes(current.email) || current.email.startsWith('admin')) {
                assignedRole = 'admin';
            }

            setRole(assignedRole);
        } catch (e) {
            setUser(null);
            setRole('guest');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, pass: string) => {
        const trimmedEmail = email.trim();
        const trimmedPass = pass.trim();
        console.log('Intentando login para:', trimmedEmail);
        try {
            // Eliminar sesiones previas para evitar conflictos (especialmente la anónima)
            try {
                await account.deleteSession('current');
            } catch (ignore) { }

            await (account as any).createEmailSession(trimmedEmail, trimmedPass);
            await checkSession();
            console.log('Login exitoso');
        } catch (e: any) {
            console.error('Error de login completo:', e);
            // Si el error es 401, es específicamente credenciales inválidas
            // Si es otro, podría ser red, configuración, etc.
            throw e;
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
        } catch (e) { }
        setUser(null);
        setRole('guest');
        // Refresh to trigger login screen if layout depends on user presence
        window.location.reload();
    };

    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            session,
            role,
            loading,
            login,
            logout,
            userName: user?.name || user?.email?.split('@')[0] || ''
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
