/**
 * Placeholder de login para M0.
 * En M1 se reemplaza por el login real:
 * - Selección visual de rol (4 botones)
 * - Email O teléfono + contraseña
 * - supabase.auth.signInWithPassword
 * - Flujo del Productor para autorizar/crear cuentas del equipo
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, ArrowLeft } from 'lucide-react'

export default function LoginPlaceholder() {
  return (
    <div className="min-h-screen bg-agro-bg flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-agro-accent">
          <Leaf size={26} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-agro-text">Login — pendiente de M1</h1>
        <p className="text-agro-muted text-sm">
          El cimiento (M0) está montado. El login real con Supabase Auth, selección de rol
          y autorización del equipo se entrega en el siguiente módulo.
        </p>
        <Link to="/inicio" className="btn-secondary inline-flex w-auto">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
      </div>
    </div>
  )
}
