import { createClient } from '@supabase/supabase-js'

// La conexión se configura aquí, leyendo las variables de entorno del archivo .env
// (Vite solo expone las que empiezan con VITE_).
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const faltanVariables = !url || !anonKey

export const supabase = createClient(
  url || 'http://localhost',
  anonKey || 'sin-clave'
)
