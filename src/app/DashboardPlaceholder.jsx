/**
 * Placeholder del dashboard privado.
 * En M7 (Dashboard por rol) se reemplaza por los 4 dashboards reales
 * (Productor / Técnico / Asociado / Staff).
 */
import React from 'react'
import { Construction } from 'lucide-react'

export default function DashboardPlaceholder() {
  return (
    <div className="max-w-xl mx-auto text-center py-16 space-y-3">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-agro-tierra/20">
        <Construction size={28} className="text-agro-tierra" />
      </div>
      <h1 className="text-2xl font-bold text-agro-text">Cimiento listo</h1>
      <p className="text-agro-muted">
        El esqueleto de AgroApp PWA está en pie. Los módulos M1–M10 se montarán aquí
        en su orden. Próximo: <strong>M1 — Autenticación y roles</strong>.
      </p>
    </div>
  )
}
