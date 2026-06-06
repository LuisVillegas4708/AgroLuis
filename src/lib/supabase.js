/**
 * Cliente Supabase para el frontend.
 * Usa la `anon` key — las políticas RLS limitan lo que cada usuario ve.
 * Nunca uses la `service_role` aquí. Esa va en Edge Functions.
 */
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey || url.includes('YOUR-PROJECT-ID')) {
  // Tolerante en build/dev sin .env: avisa pero no truena.
  console.warn(
    '[supabase] Variables de entorno no configuradas. ' +
      'Copia `.env.example` a `.env.local` y rellena VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

export const isSupabaseConfigured = () =>
  Boolean(url && anonKey && !url.includes('YOUR-PROJECT-ID'))
