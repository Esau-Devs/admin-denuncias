// src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// Lee las variables de entorno de Astro/Vite (Frontend)
// Si no las encuentra, usa un string vacío para evitar errores
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '⚠️ Faltan variables de entorno:\n' +
        `SUPABASE_URL: ${supabaseUrl ? '✓' : '✗'}\n` +
        `SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✓' : '✗'}`
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);