/**
 * Router raíz.
 * Para M0 solo expone el esqueleto: /inicio (público) y /app (privado con layout).
 * Los módulos M1–M10 montarán sus rutas hijas conforme se entreguen.
 */
import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import useStore from '../store/useStore'
import AppLayout from '../components/layout/AppLayout'
import Inicio from '../modules/inicio/Inicio'
import Login from '../modules/auth/Login'
import DashboardPlaceholder from './DashboardPlaceholder'
import SetupBanner from '../components/common/SetupBanner'

function PrivateRoute({ children }) {
  const session = useStore((s) => s.session)
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { setSession, setProfile } = useStore()

  // Hidrata la sesión de Supabase al iniciar y escucha cambios.
  // Si hay sesión, también carga el perfil (nombre + rol) desde la base.
  useEffect(() => {
    if (!isSupabaseConfigured()) return

    async function cargarPerfil(session) {
      setSession(session)
      if (session?.user) {
        const { data: perfil } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (perfil) setProfile(perfil)
      } else {
        setProfile(null)
      }
    }

    supabase.auth.getSession().then(({ data }) => cargarPerfil(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      cargarPerfil(session)
    })
    return () => sub.subscription.unsubscribe()
  }, [setSession, setProfile])

  return (
    <>
      {!isSupabaseConfigured() && <SetupBanner />}
      <Routes>
        {/* Público — M10 más adelante lo llena con clima + noticias + IA básica */}
        <Route path="/inicio" element={<Inicio />} />
        {/* Auth — login real con correo + contraseña (sin elección de rol) */}
        <Route path="/login" element={<Login />} />
        {/* Privado — los módulos colgarán de aquí */}
        <Route path="/app" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route index element={<DashboardPlaceholder />} />
        </Route>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </>
  )
}
