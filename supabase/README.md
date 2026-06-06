# /supabase

Todo lo que vive del lado del servidor.

- `/migrations` — archivos SQL versionados con tablas, índices, triggers y RLS.
  Se aplican en orden numérico. Idempotentes (usan `create ... if not exists` y `drop policy if exists`).
- `/functions` — Edge Functions Deno (Claude API, clima, noticias, rate limiting).
  La API key de Claude se guarda como secret del proyecto, nunca en código del cliente.

## Aplicar migraciones manualmente (MVP)

1. Abre tu proyecto en https://supabase.com
2. SQL Editor → New query
3. Pega el contenido de `0001_m0_cimiento.sql`, ejecuta
4. Repite con `0002_seed_demo.sql`

## Más adelante

Cuando estabilicemos, migraremos a Supabase CLI (`supabase db push`) y CI.
