// src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// Lee las variables de entorno de Astro/Vite (Frontend)
// Si no las encuentra, usa un string vacío para evitar errores
const supabaseUrl = import.meta.env.SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Crear el cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)