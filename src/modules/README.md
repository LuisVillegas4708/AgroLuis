# /src/modules

Un folder por módulo del MVP. Cada módulo es independiente:
puede actualizarse sin tocar a los demás.

| Folder | Módulo | Estado |
|--------|--------|--------|
| `/auth` | M1 — Autenticación y roles | placeholder |
| `/parcela` | M2 — Expediente | pendiente |
| `/croquis` | M3 — Parcela virtual | pendiente |
| `/alertas` | M4 — Alertas en tiempo real | pendiente |
| `/monitoreo` | M5 — Monitoreo Express | pendiente |
| `/triaje` | M6 — Sistema de triaje | pendiente |
| `/bitacora` | M7 — Bitácora de campo | pendiente |
| `/tablero` | M8 — Tablero tipo carro | pendiente |
| `/ia` | M9 — IA Agronómica | pendiente |
| `/inicio` | M10 — Inicio público | placeholder |
| `/ambiental` | M-AMB — Mediciones ambientales | pendiente |

Cada módulo expone su `index.js` (entry) y sus rutas se montan desde `/src/app/App.jsx`.
