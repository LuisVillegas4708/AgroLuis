import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, MapPin } from 'lucide-react'
import useStore from '../../store/useStore'
import { supabase } from '../../lib/supabase'

const rolLabel = {
  productor: 'Productor',
  tecnico: 'Técnico Asesor',
  asociado: 'Asociado',
  staff: 'Staff'
}

export default function Header() {
  const { profile, parcelaActiva, logout } = useStore()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut().catch(() => {})
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 shrink-0">
      <div className="flex-1 flex items-center gap-2 text-sm">
        {parcelaActiva ? (
          <>
            <MapPin size={15} className="text-agro-accent shrink-0" />
            <span className="text-agro-text font-medium truncate max-w-xs">{parcelaActiva.nombre}</span>
            <span className="text-agro-muted">·</span>
            <span className="text-agro-muted truncate">{parcelaActiva.cultivo}</span>
          </>
        ) : (
          <span className="text-agro-muted">Sin parcela activa</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-semibold text-agro-text leading-tight">
            {profile?.nombre || 'Usuario'}
          </div>
          <div className="text-xs text-agro-muted">{rolLabel[profile?.rol] || '—'}</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-agro-accent flex items-center justify-center text-white font-bold text-sm">
          {profile?.nombre?.[0]?.toUpperCase() || 'U'}
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 text-agro-muted hover:text-agro-danger transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
