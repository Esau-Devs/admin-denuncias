// src/lib/supabaseClient.ts

// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl: string = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string = import.meta.env.PUBLIC_SUPABASE_ANON;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '⚠️ Faltan variables de entorno:\n' +
        `SUPABASE_URL: ${supabaseUrl ? '✓' : '✗'}\n` +
        `SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✓' : '✗'}`
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        storageKey: 'sb-auth-token',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    }
});