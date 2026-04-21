# Siete Hierbas — Contexto del Proyecto

## ¿Qué es Siete Hierbas?

Plataforma web que unifica **dos negocios** del mismo dueño en Santa Rosa de Cabal, Risaralda, Colombia:

1. **Herboristería / E-commerce de productos naturistas** (aceites, tés, cremas, tinturas, etc.)
2. **Hostal** — servicio de hospedaje

Lo administran **dos personas sin conocimientos técnicos**. Esto es una restricción de diseño central, no un detalle menor.

## Stack Técnico

- **Frontend + Backend**: Next.js 15 full-stack (App Router, RSC por defecto, `'use client'` solo donde haga falta)
- **Lógica server**: Server Actions + Route Handlers (no NestJS)
- **Base de datos + Auth + Storage + Realtime**: Supabase
- **Autorización**: RLS (Row Level Security) en Supabase + middleware de Next
- **i18n**: next-intl (español por defecto, inglés para turistas)
- **Estilos**: Tailwind CSS + shadcn/ui
- **Validación**: Zod (schemas compartidos entre server actions y UI)
- **Formularios**: react-hook-form + zod resolver
- **Tablas/gráficos**: TanStack Table + Recharts
- **Testing**: Vitest (unit) + Playwright (e2e) — Strict TDD Mode activo cuando haya scaffolding

## Estructura del Proyecto

Single Next.js app (no monorepo — se extrae si crece a múltiples apps).

```
src/
├── app/                    # App Router
│   ├── (public)/           # Grupo de rutas públicas
│   │   ├── page.tsx        # Home
│   │   ├── tienda/         # E-commerce
│   │   └── hostal/         # Hostal
│   ├── (admin)/            # Grupo protegido (middleware auth)
│   │   └── admin/          # Dashboard admin
│   ├── api/                # Route Handlers (solo si hace falta)
│   └── layout.tsx
├── components/             # Componentes React
│   ├── ui/                 # shadcn/ui primitives
│   ├── public/             # Componentes de tienda/hostal
│   └── admin/              # Componentes del dashboard
├── lib/
│   ├── supabase/           # Clientes Supabase (server, browser, middleware)
│   ├── actions/            # Server Actions por dominio
│   ├── queries/            # Queries de lectura (data fetching)
│   └── utils/              # Utilidades generales
├── types/                  # Tipos globales + tipos generados de Supabase
└── middleware.ts           # Auth guard + i18n routing

supabase/
├── migrations/             # Migrations versionadas (Supabase CLI)
├── seed.sql                # Datos de prueba
└── config.toml             # Config del proyecto Supabase

messages/                   # i18n JSON (es, en)
public/                     # Assets estáticos
```

## Reglas del Negocio

### Pagos — SIN PASARELA por ahora
- **Efectivo contra entrega** (productos)
- **Transferencia bancaria** (productos y hostal)
- **Toda la coordinación vía WhatsApp** (Click to Chat, no Business API)
- El checkout genera un link de WhatsApp con mensaje predefinido que contiene el pedido completo

### Localización
- Moneda: **COP (Pesos Colombianos)**
- Formato: `$25.000` (punto como separador de miles, sin decimales)
- Zona horaria: `America/Bogota` (UTC-5)
- Tributación: considerar **facturación electrónica DIAN** (fase posterior)

### Roles
- **Admin** — los dos dueños/administradores. Acceso total al dashboard.
- **Cliente** — navega, agrega al carrito, checkout por WhatsApp. No requiere registro obligatorio.

## Filosofía de UX del Admin

**El admin NO es técnico. Todo debe ser evidente.**

1. **Tooltips con ícono `?`** en cada campo/botón que pueda generar duda
2. **Lenguaje humano**, no técnico ("Subir foto" en vez de "Upload image")
3. **Confirmación antes de acciones destructivas** ("¿Seguro que querés eliminar este producto?")
4. **Feedback visual siempre** (toasts, loaders, estados)
5. **Undo donde sea posible** (borrado suave = soft delete)
6. **Vista previa en tiempo real** al editar productos
7. **Tour de onboarding** la primera vez que entra al dashboard
8. **Mobile-first en el admin** — se administra desde el celular también

## Funcionalidades Admin (core)

### E-commerce
- CRUD de productos (con variantes: tamaño, presentación)
- Gestión de stock con alertas de stock bajo
- Categorías con íconos
- Productos más vendidos (día / semana / mes)
- Histórico de ventas
- Gráficos de ingresos
- Pedidos pendientes de confirmación WhatsApp

### Hostal
- CRUD de habitaciones (tipos, capacidad, precio, fotos)
- Calendario visual de ocupación
- Reservas (generadas vía WhatsApp, se registran manualmente o semiautomático)
- Check-in / Check-out digital
- Métricas de ocupación

## Convenciones de Código

- **Español en el dominio del negocio** (nombres de entidades: `Producto`, `Habitacion`, `Reserva`, `Pedido`)
- **Inglés en infraestructura técnica** (servicios, hooks, utilidades)
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Sin atribución IA en commits** (regla global del usuario)
- **NO barrel files** en imports (bundle size — regla vercel-react)
- **RSC por defecto**, `'use client'` solo cuando sea necesario

## Estado Actual del Proyecto

**Fase**: Scaffolding (Next.js 15 + Supabase + shadcn/ui).

**Decisión arquitectónica confirmada**: Opción A — Next.js full-stack + Supabase, sin NestJS, sin monorepo. Lógica server vive en Server Actions y Route Handlers. Auth, storage y DB los provee Supabase.

**Próximo paso técnico**: Finalizar scaffolding → conectar proyecto Supabase → primera migration (schema base) → re-run `/sdd-init` para activar Strict TDD.

## SDD Workflow

Este proyecto usa **Spec-Driven Development** con **engram** como backend de artefactos.

- `/sdd-explore <tema>` — investigar idea antes de comprometer
- `/sdd-new <cambio>` — arrancar cambio nuevo (propuesta + specs + diseño + tasks)
- `/sdd-apply` — implementar
- `/sdd-verify` — validar contra specs
- `/sdd-archive` — cerrar cambio

Planeación maestra en `.atl/planning/master-plan.md`.
Ideas del admin en `.atl/planning/admin-dashboard-ideas.md`.

## Skills Instaladas Relevantes

Ver `.atl/skill-registry.md`. Claves para este proyecto:

- `ui-ux-pro-max` — design intelligence (paletas, tipografías, estilos)
- `frontend-design` — construcción de componentes/páginas
- `next-best-practices` — reglas Next.js 15
- `vercel-react-best-practices` — performance React/Next
- `web-design-guidelines` — auditoría de UI/UX
