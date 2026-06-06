# AgroApp — Plataforma Nacional de Inteligencia Agrícola

> PWA instalable en macOS, iPhone, Windows y Android. Backend Supabase con RLS.
> Asistente IA (Claude) vía Edge Function. Diseñada para uso en campo bajo luz solar.

---

## Estado actual

**Fase 1 — MVP. Módulo entregado: M0 (Cimiento).**

| Módulo | Nombre | Estado |
|--------|--------|--------|
| **M0** | Cimiento (PWA + Supabase + RLS + UI base) | ✅ Listo |
| M1 | Autenticación y roles | ⏳ Siguiente |
| M2 | Expediente de parcela | ⏳ |
| M3 | Croquis / parcela virtual | ⏳ |
| M4 | Alertas en tiempo real | ⏳ |
| M5 | Monitoreo Express | ⏳ |
| M6 | Sistema de triaje | ⏳ |
| M7 | Bitácora de campo | ⏳ |
| M8 | Tablero tipo carro | ⏳ |
| M9 | IA Agronómica | ⏳ |
| M10 | Inicio abierto (sin login) | ⏳ |
| M-AMB | Mediciones ambientales | ⏳ |

---

## Setup (primera vez)

### 1. Requisitos
- Node.js 20+ (https://nodejs.org)
- Cuenta gratuita en Supabase (https://supabase.com)

### 2. Variables de entorno
```bash
cp .env.example .env.local
# Edita .env.local con tu URL y anon key del proyecto Supabase
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Aplicar migraciones de base de datos
Copia el contenido de `supabase/migrations/0001_m0_cimiento.sql` al **SQL Editor** de tu proyecto Supabase y ejecútalo. Luego repite con `0002_seed_demo.sql`.

> En fases posteriores migraremos a `supabase db push` con la Supabase CLI para automatizar este paso.

### 5. Levantar el dev server
```bash
npm run dev
# → http://localhost:5173
```

---

## Build de producción

```bash
npm run build
# Salida minificada y SIN source maps en /dist
npm run preview  # smoke test local del build
```

Para desplegar: sube `/dist` a cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, etc).

---

## Estructura del proyecto

```
/public                  manifest PWA, íconos, service worker
/src
  /app                   entrypoint, router, providers, layout base
  /components
    /layout              Sidebar, Header, AppLayout
    /common              componentes reutilizables (badges, banners, etc)
  /modules               UN folder por módulo del MVP (auth, parcela, ...)
  /store                 estado global Zustand
  /lib                   cliente Supabase, utilidades, helpers
  /styles                Tailwind + estilos globales
  /assets                imágenes, ilustraciones
/supabase
  /migrations            migraciones SQL versionadas (tablas + RLS)
  /functions             Edge Functions (Claude, clima, noticias, rate limiting)
```

**Regla de modularidad:** cada módulo en `/src/modules/*` es independiente.
Actualizar uno no obliga a tocar otros.

---

## Seguridad

- **API key de Claude:** vive solo en una Edge Function. Nunca baja al cliente.
- **RLS (Row Level Security):** cada usuario solo lee/escribe lo de su productor.
- **Build:** minificado y sin source maps.
- **Rate limiting:** en Edge Functions para IA, clima y noticias.
- **Auth:** Supabase Auth (email O teléfono + contraseña).

---

## Roles y subroles

| Rol | Función |
|-----|---------|
| **Productor** | Dueño del cultivo. Autoriza/crea cuentas de su equipo. Ve todo de sus parcelas. |
| **Técnico Asesor** | Multiparcela, captura técnica, reportes, triaje. |
| **Asociado** | Subroles: `regador`, `monitoreador`, `velador`. Captura desde el teléfono en campo. |
| **Staff** | Plataforma — dashboard global, soporte, control de usuarios. |

---

## Pendientes del dueño

- [ ] Tagline definitivo (placeholder actual: "Inteligencia para el campo mexicano")
- [ ] Ícono y logo finales (placeholder actual: hoja Lucide)
- [ ] Imagen de fondo del inicio (corte transversal de planta con mediciones)
- [ ] Confirmar id del modelo Sonnet vigente en docs.claude.com

---

*Autor: Luis Villegas — Agrónomo, Villa de Álvarez, Colima, México · 2026*
