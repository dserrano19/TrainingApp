
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../components/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { UserRole } from '../types';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    role: UserRole | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error("Error getting session:", error);
            }
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                const userRole = session.user.user_metadata.role as UserRole;
                console.log('User Role from initial session metadata:', userRole);
                setRole(userRole || null);
            }
            setLoading(false);
        }).catch(err => {
            console.error("Unexpected error getting session:", err);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                const userRole = session.user.user_metadata.role as UserRole;
                console.log('User Role from state change metadata:', userRole);
                setRole(userRole || null);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const refreshRole = async () => {
        if (!user) return;
        const { data: { user: freshUser } } = await supabase.auth.getUser();
        if (freshUser) {
            setUser(freshUser);
            setRole((freshUser.user_metadata.role as UserRole) || null);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setRole(null);
        setSession(null);
        setUser(null);
    };

    const value = {
        session,
        user,
        role,
        loading,
        signOut,
        refreshRole
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
