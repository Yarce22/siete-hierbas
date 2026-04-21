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

**Fase 0 — Scaffolding** (en curso)

- [x] Next.js 16 + TypeScript + Tailwind 4 + App Router
- [x] shadcn/ui inicializado (button, input, label, card, dialog, sonner, dropdown-menu, tooltip, skeleton, badge, separator, sheet, tabs)
- [x] Supabase SDK + clientes (server, browser, middleware)
- [x] Middleware de auth para rutas `/admin`
- [x] Estructura de carpetas
- [x] Página home con branding básico

**Pendiente**:
- [ ] Crear proyecto en Supabase y conectar (`.env.local`)
- [ ] Supabase CLI init + primera migration (schema base)
- [ ] Testing setup (Vitest + Playwright)
- [ ] Prettier + husky + lint-staged
- [ ] CI básico (GitHub Actions)

**Próximas fases**: ver [master-plan.md](./.atl/planning/master-plan.md).
