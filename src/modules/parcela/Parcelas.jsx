/**
 * M2 — Lista de parcelas en tarjetas.
 * El Productor (y Staff) ven el botón de "Nueva parcela".
 * Técnico/Asociado solo ven (la seguridad les impide editar).
 */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, MapPin, Leaf, Edit2, Droplets, Mountain } from 'lucide-react'
import useStore from '../../store/useStore'
import { listarParcelas } from './parcelaApi'

export default function Parcelas() {
  const navigate = useNavigate()
  const { profile, setParcelaActiva } = useStore()
  const [parcelas, setParcelas] = useState([])
  const [loading, setLoading] = useState(true)

  const puedeCrear = profile?.rol === 'productor' || profile?.rol === 'staff'

  useEffect(() => {
    listarParcelas()
      .then(setParcelas)
      .catch(() => setParcelas([]))
      .finally(() => setLoading(false))
  }, [])

  function abrir(p) {
    setParcelaActiva(p)
    navigate(`/app/parcela/${p.id}`)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-agro-text">Mis Parcelas</h1>
          <p className="text-agro-muted text-sm">
            {loading ? 'Cargando...' : `${parcelas.length} parcela${parcelas.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {puedeCrear && (
          <button onClick={() => navigate('/app/parcela/nueva')} className="btn-primary">
            <PlusCircle size={18} /> Nueva parcela
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-agro-muted">Cargando parcelas...</div>
      ) : parcelas.length === 0 ? (
        <div className="text-center py-16 text-agro-muted">
          <Leaf size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium">No tienes parcelas todavía.</p>
          {puedeCrear && <p className="text-sm">Crea la primera con el botón de arriba.</p>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {parcelas.map((p) => (
            <div
              key={p.id}
              onClick={() => abrir(p)}
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-agro-primary/10 flex items-center justify-center">
                  <Leaf size={18} className="text-agro-primary" />
                </div>
                <span className="text-xs bg-green-50 text-agro-primary px-2.5 py-1 rounded-full font-medium">
                  {p.sistema_produccion || 'Sin sistema'}
                </span>
              </div>
              <h3 className="font-bold text-agro-text text-base leading-tight">{p.nombre}</h3>
              <div className="flex items-center gap-1 text-xs text-agro-muted mt-1">
                <MapPin size={12} /> {p.ubicacion || 'Sin ubicación'}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <Dato label="Cultivo" valor={p.cultivo} />
                <Dato label="Superficie" valor={p.superficie_m2 ? `${p.superficie_m2} m²` : '—'} />
                <Dato label="Riego" valor={p.sistema_riego} icono={Droplets} />
                <Dato label="Suelo" valor={p.suelo_tipo} icono={Mountain} />
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-agro-accent font-medium group-hover:underline">
                <Edit2 size={13} /> Ver expediente completo
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Dato({ label, valor, icono: Icono }) {
  return (
    <div>
      <span className="text-agro-muted flex items-center gap-1">
        {Icono && <Icono size={11} />} {label}:
      </span>{' '}
      <span className="font-medium text-agro-text">{valor || '—'}</span>
    </div>
  )
}
