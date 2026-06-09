/**
 * Dashboard de bienvenida (M1).
 * Muestra datos REALES del usuario y su parcela, leídos desde la base.
 * En M7 se reemplaza por los 4 dashboards completos por rol.
 */
import React, { useEffect, useState } from 'react'
import { Leaf, MapPin, Users, CheckCircle } from 'lucide-react'
import useStore from '../store/useStore'
import { supabase } from '../lib/supabase'

const rolDescripcion = {
  productor: 'Tienes acceso completo a tus parcelas y tu equipo.',
  tecnico: 'Ves las parcelas que tienes asignadas para asesorar.',
  asociado: 'Capturas monitoreo y alertas en campo.',
  staff: 'Tienes vista global de la plataforma.'
}

function saludo() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function DashboardPlaceholder() {
  const { profile, setParcelaActiva } = useStore()
  const [parcelas, setParcelas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase.from('parcelas').select('*').order('created_at')
      setParcelas(data || [])
      if (data && data.length) setParcelaActiva(data[0])
      setLoading(false)
    }
    cargar()
  }, [setParcelaActiva])

  return (
    <div className="max-w-3xl space-y-6">
      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-bold text-agro-text">
          {saludo()}, {profile?.nombre?.split(' ')[0] || 'Usuario'} 👋
        </h1>
        <p className="text-agro-muted text-sm mt-1">
          {rolDescripcion[profile?.rol] || 'Bienvenido a AgroApp.'}
        </p>
      </div>

      {/* Confirmación de que entró bien */}
      <div className="card bg-green-50 border-green-200 flex items-center gap-3">
        <CheckCircle size={22} className="text-agro-accent shrink-0" />
        <div>
          <p className="font-semibold text-agro-text text-sm">¡Entraste correctamente!</p>
          <p className="text-xs text-agro-muted">
            Tu cuenta es <strong>{profile?.rol}</strong>
            {profile?.subrol ? ` (${profile.subrol})` : ''} — el sistema ya sabe qué puedes ver.
          </p>
        </div>
      </div>

      {/* Parcelas que ve este usuario (según su rol y RLS) */}
      <div className="card">
        <h2 className="font-semibold text-agro-text mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-agro-accent" /> Parcelas que puedes ver
        </h2>
        {loading ? (
          <p className="text-sm text-agro-muted">Cargando...</p>
        ) : parcelas.length === 0 ? (
          <p className="text-sm text-agro-muted">
            Aún no tienes parcelas asignadas. (En M2 podrás crear y administrar parcelas.)
          </p>
        ) : (
          <div className="space-y-2">
            {parcelas.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-agro-primary/10 flex items-center justify-center shrink-0">
                  <Leaf size={16} className="text-agro-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-agro-text truncate">{p.nombre}</div>
                  <div className="text-xs text-agro-muted">
                    {p.cultivo} · {p.superficie_m2} m² · Riego {p.sistema_riego}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-agro-muted mt-3 flex items-center gap-1">
          <Users size={12} />
          Esta lista la filtra automáticamente la seguridad de la base según tu rol.
        </p>
      </div>

      {/* Nota de progreso */}
      <div className="card border-dashed">
        <p className="text-sm text-agro-text font-medium">✅ M1 (Login) terminado</p>
        <p className="text-xs text-agro-muted mt-1">
          Próximo bloque: <strong>M2 — Expediente de parcela</strong> (crear, editar y ver la
          ficha completa de cada parcela). El menú lateral irá creciendo con cada módulo.
        </p>
      </div>
    </div>
  )
}
