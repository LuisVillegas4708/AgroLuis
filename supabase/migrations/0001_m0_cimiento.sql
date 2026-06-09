-- =====================================================================
-- AgroApp — Migración 0001 (M0 Cimiento)
-- Crea todas las tablas base + Row Level Security.
-- Las tablas vacías o "preparadas" pertenecen a módulos posteriores;
-- se crean aquí para evitar migraciones masivas a medio camino.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Profiles (extensión de auth.users con datos de negocio)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  nombre        text not null,
  rol           text not null check (rol in ('productor','tecnico','asociado','staff')),
  subrol        text check (subrol in ('regador','monitoreador','velador')),  -- solo para 'asociado'
  productor_id  uuid references public.profiles(id) on delete set null,        -- a quién pertenece este usuario (asociado/tecnico → productor)
  telefono      text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index if not exists idx_profiles_productor on public.profiles(productor_id);

-- ---------------------------------------------------------------------
-- 2. Parcelas — Expediente (M2)
-- ---------------------------------------------------------------------
create table if not exists public.parcelas (
  id                       uuid primary key default gen_random_uuid(),
  productor_id             uuid not null references public.profiles(id) on delete cascade,
  nombre                   text not null,
  ubicacion                text,
  lat                      double precision,
  lng                      double precision,
  cultivo                  text,
  sistema_produccion       text,
  superficie_m2            numeric,
  sistema_riego            text,
  fuente_agua              text,
  gasto_por_emisor_lph     numeric,         -- L/h por gotero/emisor
  calidad_agua             text,
  -- Apartado suelo/sustrato (base para cálculos)
  suelo_tipo               text,
  suelo_retencion_humedad  text,
  suelo_ce                 numeric,
  suelo_ph                 numeric,
  suelo_descripcion        text,
  notas                    text,
  fecha_inicio_ciclo       date,
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);
create index if not exists idx_parcelas_productor on public.parcelas(productor_id);

-- ---------------------------------------------------------------------
-- 3. Parcela ↔ Técnico/Asociado (asignaciones)
-- ---------------------------------------------------------------------
create table if not exists public.parcela_asignaciones (
  id          uuid primary key default gen_random_uuid(),
  parcela_id  uuid not null references public.parcelas(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz default now(),
  unique (parcela_id, user_id)
);
create index if not exists idx_asign_user on public.parcela_asignaciones(user_id);

-- ---------------------------------------------------------------------
-- 4. Croquis — secciones jerárquicas (M3)
-- ---------------------------------------------------------------------
create table if not exists public.croquis_secciones (
  id          uuid primary key default gen_random_uuid(),
  parcela_id  uuid not null references public.parcelas(id) on delete cascade,
  parent_id   uuid references public.croquis_secciones(id) on delete cascade,
  tipo        text not null check (tipo in ('invernadero','sector','tabla','cama')),
  nombre      text not null,
  numero      int,
  pos_x       numeric,
  pos_y       numeric,
  ancho       numeric,
  alto        numeric,
  notas       text,
  created_at  timestamptz default now()
);
create index if not exists idx_croquis_parcela on public.croquis_secciones(parcela_id);
create index if not exists idx_croquis_parent  on public.croquis_secciones(parent_id);

-- ---------------------------------------------------------------------
-- 5. Monitoreos (M5)
-- ---------------------------------------------------------------------
create table if not exists public.monitoreos (
  id                uuid primary key default gen_random_uuid(),
  parcela_id        uuid not null references public.parcelas(id) on delete cascade,
  seccion_id        uuid references public.croquis_secciones(id) on delete set null,
  user_id           uuid references public.profiles(id) on delete set null,
  riego_ok          int,    -- 1=sí 0=no -1=n/a
  fugas             int,    -- 1/0
  planta_saludable  int,    -- 1/0
  sintoma_plaga     int,    -- 2=sí 1=sospecha 0=no
  labores           jsonb,  -- array de strings
  ajuste_nutricion  int,    -- 1=sí 0=no -1=n/a
  observaciones     text,
  nivel_triage      int default 1 check (nivel_triage between 1 and 3),
  created_at        timestamptz default now()
);
create index if not exists idx_mon_parcela on public.monitoreos(parcela_id);
create index if not exists idx_mon_created on public.monitoreos(created_at desc);

-- ---------------------------------------------------------------------
-- 6. Alertas en tiempo real (M4)
-- ---------------------------------------------------------------------
create table if not exists public.alertas (
  id                uuid primary key default gen_random_uuid(),
  parcela_id        uuid not null references public.parcelas(id) on delete cascade,
  seccion_id        uuid references public.croquis_secciones(id) on delete set null,
  user_id           uuid references public.profiles(id) on delete set null,
  tema              text not null check (tema in ('riego','plagas','enfermedades','nutricion','operativo','otro')),
  preguntas_resp    jsonb,
  foto_url          text,
  ia_hipotesis      text,
  ia_confianza      numeric,             -- 0..1
  umbral            text check (umbral in ('bajo','medio','alto')),
  lat               double precision,
  lng               double precision,
  nivel_triage      int default 2,
  created_at        timestamptz default now()
);
create index if not exists idx_alertas_parcela on public.alertas(parcela_id);

-- ---------------------------------------------------------------------
-- 7. Bitácora (M7)
-- ---------------------------------------------------------------------
create table if not exists public.bitacora (
  id              uuid primary key default gen_random_uuid(),
  parcela_id      uuid not null references public.parcelas(id) on delete cascade,
  user_id         uuid references public.profiles(id) on delete set null,
  tipo            text not null check (tipo in ('monitoreo','alerta','registro_tecnico')),
  nivel_triage    int default 1,
  resumen         text,
  observaciones   text,
  monitoreo_id    uuid references public.monitoreos(id) on delete set null,
  alerta_id       uuid references public.alertas(id) on delete set null,
  created_at      timestamptz default now()
);
create index if not exists idx_bit_parcela on public.bitacora(parcela_id);
create index if not exists idx_bit_created on public.bitacora(created_at desc);

-- ---------------------------------------------------------------------
-- 8. Mediciones ambientales (M-AMB)
-- ---------------------------------------------------------------------
create table if not exists public.mediciones_ambientales (
  id                  uuid primary key default gen_random_uuid(),
  parcela_id          uuid not null references public.parcelas(id) on delete cascade,
  seccion_id          uuid references public.croquis_secciones(id) on delete set null,
  user_id             uuid references public.profiles(id) on delete set null,
  radiacion           numeric,
  humedad_relativa    numeric,
  temperatura         numeric,
  viento_vel          numeric,
  viento_dir          text,
  fase_lunar          text,           -- siempre se guarda
  lat                 double precision,
  lng                 double precision,
  fuente              text default 'manual',  -- 'manual' | 'api_clima' | 'estacion'
  created_at          timestamptz default now()
);
create index if not exists idx_amb_parcela on public.mediciones_ambientales(parcela_id);

-- ---------------------------------------------------------------------
-- 9. Chat IA — historial (M9)
-- ---------------------------------------------------------------------
create table if not exists public.chat_mensajes (
  id          uuid primary key default gen_random_uuid(),
  parcela_id  uuid references public.parcelas(id) on delete cascade,
  user_id     uuid references public.profiles(id) on delete set null,
  role        text not null check (role in ('user','assistant')),
  content     text not null,
  created_at  timestamptz default now()
);
create index if not exists idx_chat_parcela on public.chat_mensajes(parcela_id, created_at);

-- =====================================================================
-- TRIGGERS — updated_at automático
-- =====================================================================
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

drop trigger if exists trg_profiles_updated  on public.profiles;
drop trigger if exists trg_parcelas_updated  on public.parcelas;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_parcelas_updated before update on public.parcelas
  for each row execute function public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- Principio: cada usuario solo ve/escribe lo de SU productor.
-- Staff ve todo (administración de la plataforma).
-- =====================================================================
alter table public.profiles               enable row level security;
alter table public.parcelas               enable row level security;
alter table public.parcela_asignaciones   enable row level security;
alter table public.croquis_secciones      enable row level security;
alter table public.monitoreos             enable row level security;
alter table public.alertas                enable row level security;
alter table public.bitacora               enable row level security;
alter table public.mediciones_ambientales enable row level security;
alter table public.chat_mensajes          enable row level security;

-- =====================================================================
-- FUNCIONES DE AYUDA (helpers)
--
-- IMPORTANTE — todas son SECURITY DEFINER con search_path fijo.
-- Razón: una política de seguridad (RLS) no puede consultar una tabla
-- que TAMBIÉN tiene RLS sin entrar en un círculo infinito
-- ("la regla A pregunta a la tabla B, cuya regla B pregunta a la tabla A...").
-- SECURITY DEFINER hace que la función consulte la tabla SALTÁNDOSE las
-- reglas (corre con permisos del dueño), rompiendo el círculo de raíz.
-- Por eso TODAS las comprobaciones de las políticas pasan por estas
-- funciones, y NINGUNA política consulta otra tabla directamente.
-- =====================================================================

create or replace function public.current_rol() returns text
language sql stable security definer set search_path = public as $$
  select rol from public.profiles where id = auth.uid();
$$;

-- el productor_id efectivo del usuario actual:
--   * si rol = productor → su propio id
--   * si rol = tecnico/asociado → el productor al que pertenece (productor_id)
create or replace function public.current_productor_id() returns uuid
language sql stable security definer set search_path = public as $$
  select case
    when p.rol = 'productor' then p.id
    else p.productor_id
  end
  from public.profiles p where p.id = auth.uid();
$$;

-- ¿el usuario actual es el productor DUEÑO de la parcela p_id?
create or replace function public.is_owner_of_parcela(p_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.parcelas p
    where p.id = p_id and p.productor_id = auth.uid()
  );
$$;

-- ¿el usuario actual tiene una asignación (técnico/asociado) a la parcela p_id?
create or replace function public.has_asignacion(p_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.parcela_asignaciones a
    where a.parcela_id = p_id and a.user_id = auth.uid()
  );
$$;

-- -------------------- profiles --------------------
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles for select
  using (
    id = auth.uid()                                  -- mi propio perfil
    or productor_id = public.current_productor_id()  -- equipo de mi productor
    or id = public.current_productor_id()            -- mi productor (si soy team)
    or public.current_rol() = 'staff'
  );
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update
  using (id = auth.uid() or public.current_rol() = 'staff')
  with check (id = auth.uid() or public.current_rol() = 'staff');
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert
  with check (
    id = auth.uid()                                  -- alta de mi propio perfil
    or public.current_rol() in ('productor','staff') -- productor da de alta a su equipo; staff a quien sea
  );

-- -------------------- parcelas --------------------
-- Lectura: el equipo del productor, el staff, o quien tenga asignación.
-- Nota: usamos has_asignacion() (función segura) en vez de consultar
-- parcela_asignaciones directamente, para no crear un círculo de reglas.
drop policy if exists parcelas_read on public.parcelas;
create policy parcelas_read on public.parcelas for select
  using (
    productor_id = public.current_productor_id()
    or public.current_rol() = 'staff'
    or public.has_asignacion(id)
  );
-- Escritura: solo el productor dueño (o staff). productor_id = auth.uid()
-- compara una columna de la propia fila, no consulta otra tabla → sin círculo.
drop policy if exists parcelas_write on public.parcelas;
create policy parcelas_write on public.parcelas for all
  using (
    productor_id = auth.uid()
    or public.current_rol() = 'staff'
  )
  with check (
    productor_id = auth.uid()
    or public.current_rol() = 'staff'
  );

-- -------------------- parcela_asignaciones --------------------
-- Usamos is_owner_of_parcela() (función segura) en vez de consultar
-- la tabla parcelas directamente → sin círculo de reglas.
drop policy if exists asign_read on public.parcela_asignaciones;
create policy asign_read on public.parcela_asignaciones for select
  using (
    user_id = auth.uid()
    or public.is_owner_of_parcela(parcela_id)
    or public.current_rol() = 'staff'
  );
drop policy if exists asign_write on public.parcela_asignaciones;
create policy asign_write on public.parcela_asignaciones for all
  using (
    public.is_owner_of_parcela(parcela_id)
    or public.current_rol() = 'staff'
  )
  with check (
    public.is_owner_of_parcela(parcela_id)
    or public.current_rol() = 'staff'
  );

-- -------------------- acceso a tablas hijas de parcelas --------------------
-- Patrón: si tienes acceso a la parcela, tienes acceso a sus filas hijas.
-- Combina las funciones seguras anteriores (todo sin consultar tablas con RLS).
create or replace function public.can_access_parcela(p_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select
    public.is_owner_of_parcela(p_id)
    or public.has_asignacion(p_id)
    or public.current_rol() = 'staff'
    or exists (
      select 1 from public.parcelas p
      where p.id = p_id and p.productor_id = public.current_productor_id()
    );
$$;

-- -------------------- croquis_secciones --------------------
drop policy if exists croquis_rw on public.croquis_secciones;
create policy croquis_rw on public.croquis_secciones for all
  using (public.can_access_parcela(parcela_id))
  with check (public.can_access_parcela(parcela_id));

-- -------------------- monitoreos --------------------
drop policy if exists mon_rw on public.monitoreos;
create policy mon_rw on public.monitoreos for all
  using (public.can_access_parcela(parcela_id))
  with check (public.can_access_parcela(parcela_id));

-- -------------------- alertas --------------------
drop policy if exists alertas_rw on public.alertas;
create policy alertas_rw on public.alertas for all
  using (public.can_access_parcela(parcela_id))
  with check (public.can_access_parcela(parcela_id));

-- -------------------- bitacora --------------------
drop policy if exists bit_rw on public.bitacora;
create policy bit_rw on public.bitacora for all
  using (public.can_access_parcela(parcela_id))
  with check (public.can_access_parcela(parcela_id));

-- -------------------- mediciones_ambientales --------------------
drop policy if exists amb_rw on public.mediciones_ambientales;
create policy amb_rw on public.mediciones_ambientales for all
  using (public.can_access_parcela(parcela_id))
  with check (public.can_access_parcela(parcela_id));

-- -------------------- chat_mensajes --------------------
-- Tu chat es tuyo: solo tú lees tus mensajes (pero deben pertenecer a una parcela a la que tengas acceso).
drop policy if exists chat_rw on public.chat_mensajes;
create policy chat_rw on public.chat_mensajes for all
  using (
    user_id = auth.uid()
    and (parcela_id is null or public.can_access_parcela(parcela_id))
  )
  with check (
    user_id = auth.uid()
    and (parcela_id is null or public.can_access_parcela(parcela_id))
  );
