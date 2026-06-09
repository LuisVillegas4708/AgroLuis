/**
 * M1 — Pantalla de entrada (Login).
 * Diseño acordado con el dueño: SIN selección de rol.
 * El rol se asigna al CREAR la cuenta (vive en la base). Cada quien entra
 * con su correo y contraseña; el sistema ya sabe quién es y qué puede ver.
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import useStore from '../../store/useStore'

// Accesos demo (solo para evaluación; se quitan en producción)
const DEMO = [
  { email: 'productor@demo.mx', pass: 'campo2024', etiqueta: 'Productor' },
  { email: 'tecnico@demo.mx',   pass: 'agro2024',  etiqueta: 'Técnico' },
  { email: 'asociado@demo.mx',  pass: 'campo2024', etiqueta: 'Asociado' },
  { email: 'staff@demo.mx',     pass: 'admin2024', etiqueta: 'Staff' }
]

export default function Login() {
  const navigate = useNavigate()
  const { setSession, setProfile } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function fillDemo(d) {
    setEmail(d.email)
    setPassword(d.pass)
    setError('')
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // 1. Autenticar con correo + contraseña
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })
      if (authErr) throw authErr

      // 2. Leer el perfil para saber su rol (asignado al crear la cuenta)
      const { data: perfil, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      if (pErr) throw pErr

      // 3. Guardar sesión + perfil y entrar
      setSession(data.session)
      setProfile(perfil)
      navigate('/app', { replace: true })
    } catch (err) {
      const msg = err?.message || 'No se pudo iniciar sesión'
      setError(
        msg.includes('Invalid login')
          ? 'Correo o contraseña incorrectos.'
          : msg
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-agro-primary flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #52B788 0%, transparent 50%), radial-gradient(circle at 75% 75%, #D4A373 0%, transparent 50%)'
        }}
      />
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-agro-accent mb-4 shadow-lg">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">AgroApp</h1>
          <p className="text-green-300 mt-1 text-sm">Inteligencia para el campo mexicano</p>
        </div>

        {/* Tarjeta */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-agro-text mb-6">Iniciar sesión</h2>

          {/* Accesos demo */}
          <div className="mb-6">
            <p className="text-xs text-agro-muted mb-2 font-medium uppercase tracking-wide">
              Acceso demo rápido:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => fillDemo(d)}
                  className="text-xs font-semibold py-2 px-2 rounded-lg bg-green-50 text-agro-primary hover:bg-green-100 transition-colors min-h-[40px]"
                >
                  {d.etiqueta}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-agro-text mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="usuario@demo.mx"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-agro-text mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input pr-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-agro-muted hover:text-agro-text transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verificando...
                </span>
              ) : (
                <>
                  <LogIn size={18} /> Entrar al sistema
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-green-400 text-xs mt-6">PWA v1.0 · Uso de evaluación</p>
      </div>
    </div>
  )
}
