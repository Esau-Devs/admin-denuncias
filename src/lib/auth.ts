// src/lib/auth.ts
import { supabase } from './supabaseClient.js';

export const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Error obteniendo sesión:', error);
        return null;
    }
    return session;
};

export const logout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
};