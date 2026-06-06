# /src/app

Entrypoint del frontend. Aquí vive el router raíz, providers globales y placeholders
de dashboard que serán reemplazados por los módulos.

- `App.jsx` — router público (`/inicio`, `/login`) y privado (`/app/*` con AuthGuard).
- `DashboardPlaceholder.jsx` — se reemplaza al entregar M7.
