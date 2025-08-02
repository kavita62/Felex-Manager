import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if Supabase is configured
        const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!isSupabaseConfigured) {
            // Demo mode - check for demo user in localStorage
            const demoUser = localStorage.getItem('demoUser');
            if (demoUser) {
                setUser(JSON.parse(demoUser));
            }
            setLoading(false);
            return;
        }

        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Error getting session:', error);
                    setError(error.message);
                } else {
                    setUser(session?.user ?? null);
                }
            } catch (error) {
                console.error('Error in getInitialSession:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                try {
                    setUser(session?.user ?? null);
                    setError(null);
                } catch (error) {
                    console.error('Error in auth state change:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            // Check if Supabase is configured
            const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
            
            if (isSupabaseConfigured) {
                await supabase.auth.signOut();
            } else {
                // Demo mode - clear localStorage
                localStorage.removeItem('demoUser');
            }
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
            setError(error.message);
        }
    };

    const value = {
        user,
        loading,
        signOut,
        isAuthenticated: !!user,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 