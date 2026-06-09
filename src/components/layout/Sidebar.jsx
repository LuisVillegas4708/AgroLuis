/**
 * Sidebar lateral colapsable.
 * Para M0 expone solo Dashboard. Cada módulo agrega su entrada según el rol
 * cuando se entregue. La nav real por rol se completa en M7.
 */
import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MapPin, ChevronLeft, ChevronRight, Leaf } from 'lucide-react'
import useStore from '../../store/useStore'

// Navegación por rol. Crece con cada módulo entregado.
const NAV_POR_ROL = {
  productor: [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/app/parcelas', icon: MapPin, label: 'Mis Parcelas' }
  ],
  tecnico: [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/app/parcelas', icon: MapPin, label: 'Parcelas' }
  ],
  asociado: [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/app/parcelas', icon: MapPin, label: 'Parcelas' }
  ],
  staff: [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/app/parcelas', icon: MapPin, label: 'Todas las parcelas' }
  ]
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, profile } = useStore()
  const items = NAV_POR_ROL[profile?.rol] || NAV_POR_ROL.productor

  return (
    <aside
      className={`flex flex-col bg-agro-primary text-white transition-all duration-200 shrink-0
        ${sidebarCollapsed ? 'w-16' : 'w-56'}`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-green-800
          ${sidebarCollapsed ? 'justify-center' : ''}`}
      >
        <div className="w-9 h-9 rounded-xl bg-agro-accent flex items-center justify-center shrink-0">
          <Leaf size={20} className="text-white" />
        </div>
        {!sidebarCollapsed && (
          <div>
            <div className="font-bold text-base leading-tight">AgroApp</div>
            <div className="text-green-300 text-xs">PWA v1.0</div>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 min-h-touch
              ${isActive ? 'bg-agro-accent text-white' : 'text-green-200 hover:bg-green-800 hover:text-white'}
              ${sidebarCollapsed ? 'justify-center' : ''}`
            }
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon size={20} className="shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center p-3 border-t border-green-800 hover:bg-green-800 transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>
  )
}
