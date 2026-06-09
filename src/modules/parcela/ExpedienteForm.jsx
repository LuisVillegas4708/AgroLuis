/**
 * M2 — Expediente de parcela (alta / edición / ver).
 * Organizado en 3 secciones: Generales · Riego y agua · Suelo/sustrato.
 * Solo el productor dueño (o staff) puede editar/borrar; los demás ven en modo lectura.
 */
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Trash2, Droplets, Mountain, MapPin, Info } from 'lucide-react'
import useStore from '../../store/useStore'
import { obtenerParcela, crearParcela, actualizarParcela, borrarParcela } from './parcelaApi'
import MapaPin from './MapaPin'

const CULTIVOS = ['Rosa de corte', 'Jitomate', 'Chile', 'Pepino', 'Otros']
const SISTEMAS_PROD = ['Campo abierto sin tecnología', 'Campo abierto tecnificado', 'Túnel-Macrotúnel', 'Invernadero básico', 'Invernadero hi-tech']
const SISTEMAS_RIEGO = ['Gravedad/Temporal', 'Goteo', 'Aspersión', 'Fertirriego']
const FUENTES_AGUA = ['Pozo', 'Presa', 'Red municipal', 'Canal']
const RETENCIONES = ['Baja', 'Media', 'Media-Alta', 'Alta']

const VACIO = {
  nombre: '', ubicacion: '', lat: '', lng: '',
  cultivo: 'Rosa de corte', sistema_produccion: 'Invernadero hi-tech', superficie_m2: '',
  sistema_riego: 'Goteo', fuente_agua: 'Pozo', gasto_por_emisor_lph: '', calidad_agua: '',
  suelo_tipo: '', suelo_retencion_humedad: 'Media', suelo_ce: '', suelo_ph: '', suelo_descripcion: '',
  notas: '', fecha_inicio_ciclo: ''
}

export default function ExpedienteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile, setParcelaActiva } = useStore()
  const esNueva = id === 'nueva'

  const [form, setForm] = useState(VACIO)
  const [loading, setLoading] = useState(!esNueva)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [soloLectura, setSoloLectura] = useState(false)

  useEffect(() => {
    if (esNueva) return
    obtenerParcela(id)
      .then((p) => {
        setForm({ ...VACIO, ...Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v ?? ''])) })
        // Solo el dueño (productor) o staff edita
        const esDueno = profile?.rol === 'staff' || (profile?.rol === 'productor' && p.productor_id === profile.id)
        setSoloLectura(!esDueno)
      })
      .catch(() => setError('No se pudo cargar la parcela.'))
      .finally(() => setLoading(false))
  }, [id, esNueva, profile])

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  async function guardar(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      let guardada
      if (esNueva) guardada = await crearParcela(form)
      else guardada = await actualizarParcela(id, form)
      setParcelaActiva(guardada)
      navigate('/app/parcelas')
    } catch (err) {
      setError(err?.message || 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  async function eliminar() {
    if (!confirm('¿Eliminar esta parcela y todos sus registros? No se puede deshacer.')) return
    try {
      await borrarParcela(id)
      navigate('/app/parcelas')
    } catch (err) {
      setError(err?.message || 'No se pudo eliminar.')
    }
  }

  if (loading) return <div className="text-center py-16 text-agro-muted">Cargando expediente...</div>

  return (
    <div className="max-w-2xl space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/app/parcelas')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-agro-muted" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-agro-text">
            {esNueva ? 'Nueva parcela' : soloLectura ? 'Expediente de parcela' : 'Editar parcela'}
          </h1>
          <p className="text-agro-muted text-sm">
            {soloLectura ? 'Solo lectura (no eres el dueño de esta parcela)' : 'Ficha base de la unidad productiva'}
          </p>
        </div>
      </div>

      <form onSubmit={guardar} className="space-y-5">
        {/* SECCIÓN 1: Generales */}
        <Seccion titulo="Datos generales" icono={Info}>
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Nombre de la parcela *" req>
              <input className="input" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} required disabled={soloLectura} placeholder="Ej: Invernadero Norte" />
            </Campo>
            <Campo label="Ubicación / Localidad">
              <input className="input" value={form.ubicacion} onChange={(e) => set('ubicacion', e.target.value)} disabled={soloLectura} placeholder="Villa de Álvarez, Colima" />
            </Campo>
          </div>

          {/* Mapa para el pin */}
          {!soloLectura && (
            <div>
              <label className="block text-sm font-medium text-agro-text mb-1 flex items-center gap-1">
                <MapPin size={13} /> Ubicación en el mapa (haz clic para poner el pin)
              </label>
              <MapaPin lat={form.lat} lng={form.lng} onPick={(la, ln) => { set('lat', la.toFixed(6)); set('lng', ln.toFixed(6)) }} />
              {form.lat && form.lng && (
                <p className="text-xs text-agro-muted mt-1">Pin: {form.lat}, {form.lng}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Tipo de cultivo">
              <Select valor={form.cultivo} opciones={CULTIVOS} onChange={(v) => set('cultivo', v)} disabled={soloLectura} />
            </Campo>
            <Campo label="Sistema de producción">
              <Select valor={form.sistema_produccion} opciones={SISTEMAS_PROD} onChange={(v) => set('sistema_produccion', v)} disabled={soloLectura} />
            </Campo>
          </div>
          <Campo label="Superficie (m²) *" req>
            <input type="number" className="input" value={form.superficie_m2} onChange={(e) => set('superficie_m2', e.target.value)} required disabled={soloLectura} min="1" placeholder="2500" />
          </Campo>
        </Seccion>

        {/* SECCIÓN 2: Riego y agua */}
        <Seccion titulo="Riego y agua" icono={Droplets}>
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Sistema de riego">
              <Select valor={form.sistema_riego} opciones={SISTEMAS_RIEGO} onChange={(v) => set('sistema_riego', v)} disabled={soloLectura} />
            </Campo>
            <Campo label="Fuente de agua">
              <Select valor={form.fuente_agua} opciones={FUENTES_AGUA} onChange={(v) => set('fuente_agua', v)} disabled={soloLectura} />
            </Campo>
            <Campo label="Gasto por emisor (L/h)">
              <input type="number" step="any" className="input" value={form.gasto_por_emisor_lph} onChange={(e) => set('gasto_por_emisor_lph', e.target.value)} disabled={soloLectura} placeholder="2" />
            </Campo>
            <Campo label="Calidad del agua">
              <input className="input" value={form.calidad_agua} onChange={(e) => set('calidad_agua', e.target.value)} disabled={soloLectura} placeholder="Apta — pozo profundo" />
            </Campo>
          </div>
        </Seccion>

        {/* SECCIÓN 3: Suelo / sustrato */}
        <Seccion titulo="Suelo / sustrato" icono={Mountain} nota="Estos datos son la base de los cálculos de riego y nutrición de fases futuras. Entre más preciso, mejor.">
          <div className="grid grid-cols-2 gap-4">
            <Campo label="Tipo de suelo/sustrato">
              <input className="input" value={form.suelo_tipo} onChange={(e) => set('suelo_tipo', e.target.value)} disabled={soloLectura} placeholder="Sustrato inerte" />
            </Campo>
            <Campo label="Retención de humedad">
              <Select valor={form.suelo_retencion_humedad} opciones={RETENCIONES} onChange={(v) => set('suelo_retencion_humedad', v)} disabled={soloLectura} />
            </Campo>
            <Campo label="CE (conductividad eléctrica)">
              <input type="number" step="any" className="input" value={form.suelo_ce} onChange={(e) => set('suelo_ce', e.target.value)} disabled={soloLectura} placeholder="1.8" />
            </Campo>
            <Campo label="pH">
              <input type="number" step="any" className="input" value={form.suelo_ph} onChange={(e) => set('suelo_ph', e.target.value)} disabled={soloLectura} placeholder="6.2" />
            </Campo>
          </div>
          <Campo label="Descripción del suelo/sustrato">
            <textarea className="input resize-none" rows={2} value={form.suelo_descripcion} onChange={(e) => set('suelo_descripcion', e.target.value)} disabled={soloLectura} placeholder="Camas elevadas, profundidad, drenaje..." />
          </Campo>
        </Seccion>

        {/* SECCIÓN 4: Otros */}
        <Seccion titulo="Otros datos" icono={Info}>
          <Campo label="Notas adicionales">
            <textarea className="input resize-none" rows={2} value={form.notas} onChange={(e) => set('notas', e.target.value)} disabled={soloLectura} placeholder="Cualquier información relevante del ciclo actual..." />
          </Campo>
          <Campo label="Fecha de inicio del ciclo actual">
            <input type="date" className="input" value={form.fecha_inicio_ciclo || ''} onChange={(e) => set('fecha_inicio_ciclo', e.target.value)} disabled={soloLectura} />
          </Campo>
        </Seccion>

        {error && (
          <div className="text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        {/* Acciones */}
        {!soloLectura && (
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Guardando...' : <><Save size={16} /> Guardar parcela</>}
            </button>
            {!esNueva && (
              <button type="button" onClick={eliminar} className="btn-secondary text-agro-danger border-agro-danger hover:bg-red-50 px-4">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

function Seccion({ titulo, icono: Icono, nota, children }) {
  return (
    <div className="card space-y-4">
      <h2 className="font-semibold text-agro-text flex items-center gap-2">
        <Icono size={16} className="text-agro-accent" /> {titulo}
      </h2>
      {nota && (
        <p className="text-xs text-agro-muted bg-green-50 rounded-lg px-3 py-2">{nota}</p>
      )}
      {children}
    </div>
  )
}

function Campo({ label, req, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-agro-text mb-1">{label}</label>
      {children}
    </div>
  )
}

function Select({ valor, opciones, onChange, disabled }) {
  return (
    <select className="input" value={valor} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
      {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}
