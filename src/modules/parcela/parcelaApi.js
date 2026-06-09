/**
 * M2 — Acceso a datos de parcelas (Supabase).
 * La seguridad (RLS) ya filtra qué ve/escribe cada usuario:
 *  - Productor: crea/edita/borra SUS parcelas.
 *  - Técnico/Asociado: solo ven las asignadas (no editan).
 *  - Staff: ve todo.
 */
import { supabase } from '../../lib/supabase'

// Listar las parcelas visibles para el usuario actual
export async function listarParcelas() {
  const { data, error } = await supabase
    .from('parcelas')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

// Leer una parcela por id
export async function obtenerParcela(id) {
  const { data, error } = await supabase.from('parcelas').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

// Crear parcela. El productor_id se fija al usuario actual (requisito de la RLS).
export async function crearParcela(datos) {
  const { data: userData } = await supabase.auth.getUser()
  const productor_id = userData?.user?.id
  const { data, error } = await supabase
    .from('parcelas')
    .insert({ ...limpiar(datos), productor_id })
    .select()
    .single()
  if (error) throw error
  return data
}

// Actualizar parcela
export async function actualizarParcela(id, datos) {
  const { data, error } = await supabase
    .from('parcelas')
    .update(limpiar(datos))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Borrar parcela
export async function borrarParcela(id) {
  const { error } = await supabase.from('parcelas').delete().eq('id', id)
  if (error) throw error
}

// Convierte cadenas vacías de campos numéricos a null para que Postgres no truene
function limpiar(d) {
  const numericos = ['lat', 'lng', 'superficie_m2', 'gasto_por_emisor_lph', 'suelo_ce', 'suelo_ph']
  const out = { ...d }
  for (const k of numericos) {
    if (out[k] === '' || out[k] === undefined) out[k] = null
    else if (out[k] !== null) out[k] = Number(out[k])
  }
  if (out.fecha_inicio_ciclo === '') out.fecha_inicio_ciclo = null
  // No mandamos campos de control
  delete out.id
  delete out.productor_id
  delete out.created_at
  delete out.updated_at
  return out
}
