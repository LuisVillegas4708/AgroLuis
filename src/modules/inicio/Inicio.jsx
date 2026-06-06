/**
 * Inicio público (M0 placeholder).
 * En M10 se llenará con: noticias, clima por geolocalización e IA básica
 * (todo con rate limiting y caching en Edge Functions).
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, LogIn } from 'lucide-react'

export default function Inicio() {
  return (
    <div className="min-h-screen bg-agro-primary flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Patrón decorativo */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #52B788 0%, transparent 50%), radial-gradient(circle at 75% 75%, #D4A373 0%, transparent 50%)'
        }}
      />

      <div className="relative max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-agro-accent shadow-2xl">
          <Leaf size={40} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">AgroApp</h1>
          <p className="text-green-300 mt-2">Inteligencia para el campo mexicano</p>
        </div>
        <p className="text-green-100 text-sm leading-relaxed">
          Esta es la pantalla pública de bienvenida. En M10 cargará noticias agrícolas,
          alerta de clima por tu ubicación e IA básica de consulta — todo sin necesidad
          de registrarte.
        </p>
        <Link to="/login" className="btn-primary inline-flex w-auto">
          <LogIn size={18} /> Entrar a mi cuenta
        </Link>
        <p className="text-green-400 text-xs">PWA v1.0 · Cimiento listo (M0)</p>
      </div>
    </div>
  )
}
