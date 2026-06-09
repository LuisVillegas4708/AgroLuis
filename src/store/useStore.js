/**
 * Estado global Zustand.
 * Solo memoria volátil de UI y caché de sesión.
 * La verdad de los datos vive en Supabase.
 */
import { create } from 'zustand'

const useStore = create((set) => ({
  // Sesión (sincronizada por modules/auth con supabase.auth)
  session: null,
  profile: null, // { id, nombre, rol, productor_id, subrol }
  authReady: false, // false hasta que se hidrata la sesión al cargar la página
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setAuthReady: (v) => set({ authReady: v }),
  logout: () => set({ session: null, profile: null, parcelaActiva: null }),

  // Parcela activa para el contexto de toda la app
  parcelaActiva: null,
  setParcelaActiva: (parcela) => set({ parcelaActiva: parcela }),

  // Cache de parcelas (refrescable)
  parcelas: [],
  setParcelas: (parcelas) => set({ parcelas }),

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed }))
}))

export default useStore
