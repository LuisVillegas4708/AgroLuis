/**
 * Banner amarillo que aparece SOLO si no hay credenciales de Supabase en .env.local.
 * Una vez configurado el .env y reiniciado el dev, desaparece automáticamente.
 */
import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default function SetupBanner() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-yellow-100 border-b-2 border-yellow-300 text-yellow-900 px-4 py-2 text-xs flex items-center justify-center gap-2">
      <AlertTriangle size={14} className="shrink-0" />
      <span>
        <strong>Setup pendiente:</strong> copia <code className="bg-yellow-200 px-1 rounded">.env.example</code> a{' '}
        <code className="bg-yellow-200 px-1 rounded">.env.local</code> con tu URL y anon key de Supabase, luego reinicia el dev server.
      </span>
    </div>
  )
}
