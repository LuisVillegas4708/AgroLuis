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
import LoginPlaceholder from '../modules/auth/LoginPlaceholder'
import DashboardPlaceholder from './DashboardPlaceholder'
import SetupBanner from '../components/common/SetupBanner'

function PrivateRoute({ children }) {
  const session = useStore((s) => s.session)
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { setSession } = useStore()

  // Hidrata la sesión de Supabase al iniciar y escucha cambios
  useEffect(() => {
    if (!isSupabaseConfigured()) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => sub.subscription.unsubscribe()
  }, [setSession])

  return (
    <>
      {!isSupabaseConfigured() && <SetupBanner />}
      <Routes>
        {/* Público — M10 más adelante lo llena con clima + noticias + IA básica */}
        <Route path="/inicio" element={<Inicio />} />
        {/* Auth — M1 reemplaza este placeholder */}
        <Route path="/login" element={<LoginPlaceholder />} />
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
