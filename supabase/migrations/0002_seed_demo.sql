-- =====================================================================
-- Seed demo — parcela base de Villa de Álvarez, Colima.
-- Solo corre si hay al menos un productor en profiles.
-- Idempotente: usa `on conflict do nothing`.
-- =====================================================================
-- Nota: la parcela demo se vinculará al primer productor que se cree
-- desde el flujo de M1. Mientras tanto este seed solo expone una helper
-- function que invocaremos desde la app al primer login del Productor demo.

create or replace function public.seed_parcela_demo(p_productor uuid) returns uuid
language plpgsql as $$
declare new_id uuid;
begin
  -- Evita duplicar si ya existe la demo para este productor
  select id into new_id from public.parcelas
    where productor_id = p_productor and nombre = 'Invernadero Rosa de Corte — Demo';
  if new_id is not null then return new_id; end if;

  insert into public.parcelas (
    productor_id, nombre, ubicacion, lat, lng,
    cultivo, sistema_produccion, superficie_m2,
    sistema_riego, fuente_agua, gasto_por_emisor_lph, calidad_agua,
    suelo_tipo, suelo_retencion_humedad, suelo_ce, suelo_ph, suelo_descripcion,
    notas, fecha_inicio_ciclo
  ) values (
    p_productor,
    'Invernadero Rosa de Corte — Demo',
    'Villa de Álvarez, Colima, México',
    19.2742, -103.7234,
    'Rosa de corte', 'Invernadero hi-tech', 2500,
    'Goteo', 'Pozo', 2, 'Apta — pozo profundo',
    'Sustrato inerte', 'Media-Alta', 1.8, 6.2,
    '18 camas elevadas, ~3,400 plantas, 2 goteros/planta a 2 L/h, 4 sectores, bomba 1.5 HP.',
    'Parcela de demostración. Invernadero 50×50 m en operación.',
    '2024-01-15'
  ) returning id into new_id;
  return new_id;
end; $$;
