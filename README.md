# Siete Hierbas

Plataforma web que unifica el **e-commerce de productos naturistas** y el **servicio de hospedaje (hostal)** de Siete Hierbas en Santa Rosa de Cabal, Risaralda, Colombia.

## Stack

- **Framework**: Next.js 16 (App Router, RSC, React 19)
- **Estilos**: Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/)
- **Backend as a Service**: [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage + Realtime)
- **Validación**: Zod + react-hook-form
- **i18n**: next-intl (es / en)
- **Tablas/gráficos**: TanStack Table + Recharts

## Requisitos

- Node.js >= 20
- pnpm >= 10
- Proyecto Supabase creado ([app.supabase.com](https://app.supabase.com))

## Setup inicial

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear .env.local (ver docs/environment.md)
#    Copiar el bloque de docs/environment.md y completar con tus credenciales

# 3. Correr el servidor de desarrollo
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo (Turbopack) |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm lint` | ESLint |

## Estructura

```
src/
├── app/                     # App Router (páginas y layouts)
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── public/              # Componentes de tienda/hostal
│   └── admin/               # Componentes del dashboard admin
├── lib/
│   ├── supabase/            # Clientes (server, browser, middleware)
│   ├── actions/             # Server Actions por dominio
│   ├── queries/             # Queries de lectura
│   └── utils.ts             # Utilidades (cn, etc.)
├── types/
│   └── supabase.ts          # Tipos generados de la DB
└── middleware.ts            # Auth guard + session refresh

supabase/
└── migrations/              # Migrations versionadas (Supabase CLI)

docs/
└── environment.md           # Variables de entorno

.atl/
├── planning/
│   ├── master-plan.md       # Hoja de ruta del proyecto
│   └── admin-dashboard-ideas.md
└── skill-registry.md        # Skills resueltas por sub-agentes
```

## Documentación

- **Contexto del proyecto**: [CLAUDE.md](./CLAUDE.md)
- **Plan maestro (fases, decisiones, modelo de datos)**: [.atl/planning/master-plan.md](./.atl/planning/master-plan.md)
- **Ideas del dashboard admin**: [.atl/planning/admin-dashboard-ideas.md](./.atl/planning/admin-dashboard-ideas.md)
- **Variables de entorno**: [docs/environment.md](./docs/environment.md)

## Estado actual

| Fase | Estado |
|------|--------|
| Fase 0 — Scaffolding | ✅ Completa |
| Fase 1 — MVP E-commerce público | ✅ Completa |
| Fase 2 — MVP Hostal público | ✅ Completa |
| Fase 3 — Admin Dashboard base | ✅ Completa |
| Fase 4 — Analíticas y Reportes | ✅ Completa |
| Fase 5 — UX Helpers | ✅ Completa |
| **Fase 6 — Pulido y Launch** | ✅ Completa (código) |

### ✅ Fase 0 — Scaffolding

- [x] Next.js 16 + TypeScript + Tailwind 4 + App Router
- [x] shadcn/ui inicializado
- [x] Supabase SDK + clientes (server, browser, session helper)
- [x] Schema base SQL + seed inicial
- [x] Documentación de DB en `docs/database.md`

### ✅ Fase 1 — MVP E-commerce público

- [x] Catálogo público `/tienda` con filtro por categoría
- [x] Detalle de producto `/tienda/[slug]` con galería, variantes y carrito
- [x] Carrito con persistencia en `localStorage`
- [x] Checkout con deep link a WhatsApp (mensaje predefinido con pedido)
- [x] Home con productos destacados

### ✅ Fase 2 — MVP Hostal público

- [x] Listado de habitaciones `/hostal` con filtros por tipo y capacidad
- [x] Detalle de habitación `/hostal/[slug]` con galería y amenidades
- [x] Verificación de disponibilidad por fechas
- [x] Formulario de reserva → deep link a WhatsApp

### ✅ Fase 3 — Admin Dashboard base

- [x] Login con Supabase Auth + guard de rutas `/admin`
- [x] Sidebar + layout del dashboard
- [x] CRUD de productos con imágenes y variantes de precio/stock
- [x] CRUD de categorías con íconos
- [x] CRUD de habitaciones con galería de imágenes
- [x] Gestión de pedidos (lista, detalle, cambio de estado)
- [x] Gestión de reservas (lista, detalle, cambio de estado)

### ✅ Fase 4 — Analíticas y Reportes

- [x] Dashboard `/admin/analiticas` con selector de período (semana / mes / año)
- [x] Gráfico de ingresos (tienda + hostal) — Recharts AreaChart
- [x] Top productos más vendidos — Recharts BarChart horizontal
- [x] Tabla de ventas paginada — TanStack Table
- [x] Métricas de hostal: ocupación, ingresos, próximas reservas
- [x] Alertas de stock bajo en el dashboard home
- [x] Export a CSV con BOM UTF-8 (compatible con Excel)

### ✅ Fase 5 — UX Helpers

- [x] Badge de stock bajo en sidebar (rojo con conteo de variantes bajo mínimo)
- [x] Búsqueda global Cmd+K (cmdk) — productos, pedidos, reservas, habitaciones
- [x] Papelera de reciclaje `/admin/papelera` con tabs por tipo, restaurar y eliminar definitivamente
- [x] Historial de cambios (`HistorialCambios`) — componente server listo para agregar en páginas de detalle
- [x] Tour de onboarding para nuevos admins (driver.js) — se activa una sola vez por navegador
- [x] Plantillas de productos — modal que pre-llena descripción y variantes sugeridas

### ✅ Fase 6 — Pulido y Launch

- [x] SEO: `generateMetadata()` con OpenGraph en detalle de productos y habitaciones
- [x] SEO: `sitemap.ts` dinámico — home, tienda, hostal y todas las páginas de detalle
- [x] SEO: `robots.ts` — permite públicas, bloquea `/admin` y `/api`
- [x] SEO: `lang="es"` en root layout + `metadataBase` + openGraph global
- [x] Performance: `next/image` en todos los `<img>` de componentes públicos (cards, galería, checkout)
- [x] Performance: `remotePatterns` en `next.config.ts` para imágenes de Supabase Storage
- [x] Performance: `loading.tsx` con skeletons en tienda, hostal y páginas de detalle
- [x] Accesibilidad: `aria-label` en navegación principal, breadcrumbs y botones de galería

---

**Pendiente para launch** (requiere acceso del cliente):

| Tarea | Detalle |
|-------|---------|
| Variable de entorno | `NEXT_PUBLIC_SITE_URL=https://tu-dominio.com` en Vercel |
| Supabase Cloud | Crear proyecto → `supabase db push` → `supabase seed` |
| Tipos TypeScript | `pnpm supabase gen types > src/types/supabase.ts` |
| Storage buckets | Crear `productos` y `habitaciones` (policy: public read) |
| Deploy en Vercel | Conectar repo GitHub + configurar env vars |
| Dominio del cliente | Configurar DNS en Vercel |
| i18n (opcional) | next-intl está instalado — activar si se necesita inglés para turistas |
| Monitoreo (opcional) | Sentry + Lighthouse CI en GitHub Actions |

**Hoja de ruta completa**: [.atl/planning/master-plan.md](./.atl/planning/master-plan.md).
