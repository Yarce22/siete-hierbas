# Siete Hierbas — Plan Maestro

> **Propósito**: Hoja de ruta completa para construir la plataforma Siete Hierbas (e-commerce naturista + hostal) con panel admin intuitivo para dueños sin conocimientos técnicos.
>
> **Audiencia**: Alejo (dev) + futuros sub-agentes que trabajen en el proyecto.
>
> **Última actualización**: 2026-04-25

---

## Estado Actual

| Fase | Estado | Commit |
|------|--------|--------|
| Fase 0 — Scaffolding | ✅ Completa | `aec814b` |
| Fase 1 — MVP Tienda pública | ✅ Completa | `fb05cf2`, `8019d6b` |
| Fase 2 — MVP Hostal público | ✅ Completa | `90384ad` |
| Fase 3 — Admin Dashboard base | ✅ Completa | `d1b1ce2`, `e215f75` |
| Fase 4 — Analíticas y Reportes | ✅ Completa | `8e847fc` |
| **Fase 5 — UX Helpers** | ✅ Completa | `feat(ux-helpers)` |
| Fase 6 — Pulido y Launch | ❌ **Pendiente** | — |

---

## 1. Contexto del Negocio

### Quién
- **Cliente**: Dueño en Santa Rosa de Cabal, Risaralda, Colombia.
- **Administradores**: 2 personas, sin conocimientos técnicos.
- **Clientes finales**: Mezcla de locales y turistas (Santa Rosa es zona turística, termales).

### Qué
1. **E-commerce naturista**: tés, aceites, cremas, tinturas, hierbas secas, productos wellness.
2. **Hostal**: hospedaje con varias habitaciones.

### Cómo (modelo de pago inicial)
- Efectivo contra entrega (productos locales)
- Transferencia bancaria (productos + hostal)
- **Toda coordinación por WhatsApp** (Click to Chat)
- **Sin pasarela de pagos** en MVP

---

## 2. Decisiones Arquitectónicas Clave

### 2.1 Single Next.js App (no monorepo)
**Decisión**: Un solo proyecto Next.js en el root del repo.
**Razón**: Sin NestJS, el monorepo es overhead puro. Si en el futuro sale app móvil o admin separado, se extrae a monorepo en ese momento. YAGNI.

### 2.2 Next.js 15 full-stack (sin NestJS)
**Decisión**: Toda la lógica server vive en Server Actions y Route Handlers de Next.
**Razón**:
- Supabase + Next 15 cubre el 95% de casos sin un backend adicional.
- Server Actions colocan la lógica cerca del componente que la usa → menos context switching.
- Menos deploys, menos código, MVP más rápido.
- Tradeoff aceptado: si la lógica crece mucho, refactor a paquete compartido o servicio separado.

### 2.3 Supabase como BaaS
**Decisión**: PostgreSQL + Auth + Storage + Realtime en un solo proveedor.
**Razón**:
- Ahorra integrar NextAuth, Cloudinary y un WebSocket server por separado.
- RLS (Row Level Security) da permisos a nivel de DB — más seguro que lógica en app.
- Supabase CLI permite migrations versionadas en git.
- Tradeoff aceptado: cierto lock-in con Supabase. Mitigación: el core es PostgreSQL estándar.

### 2.4 WhatsApp Click to Chat (no Business API)
**Decisión**: URL `https://wa.me/57XXXXXXXXX?text=mensaje_predefinido`.
**Razón**: Business API requiere aprobación de Meta, tiene costo por conversación. Click to Chat funciona desde día 1, gratis.

**Upgrade path**: Si el volumen crece, migrar a Business API con Twilio/360dialog.

### 2.5 Soft Delete en todo el dominio
**Decisión**: Nunca hacer DELETE físico. Marcar `deleted_at`.
**Razón**: Admin no-técnico = más errores humanos. Necesitamos "papelera de reciclaje" y auditoría.

### 2.6 Audit log de cambios del admin
**Decisión**: Tabla `audit_log` registrando quién cambió qué y cuándo.
**Razón**: Dos administradores → trazabilidad si hay discrepancias.

---

## 3. Schema de Base de Datos (implementado)

Tablas existentes en `supabase/migrations/20260421100000_schema_base.sql`:

```
profiles              — extiende auth.users, tiene nombre + rol (admin|superadmin)
categorias            — id, nombre, slug, icono, orden, deleted_at
productos             — id, nombre, slug, descripcion, categoria_id, destacado, deleted_at
producto_imagenes     — producto_id, url, alt_text, orden
producto_variantes    — producto_id, nombre, sku, precio (COP int), stock, stock_minimo, deleted_at
pedidos               — numero_orden (identity), cliente_*, metodo_pago, estado, total, deleted_at
pedido_items          — pedido_id, producto_id, variante_id, cantidad, precio_unitario, subtotal
habitaciones          — id, nombre, slug, tipo, capacidad, precio_noche (COP int), descripcion, amenidades (text[]), deleted_at
habitacion_imagenes   — habitacion_id, url, alt_text, orden
reservas              — numero_reserva (identity), habitacion_id, huesped_*, fecha_check_in, fecha_check_out, numero_huespedes, estado, total, metodo_pago, deleted_at
audit_log             — usuario_id, entidad, entidad_id, accion, cambios (jsonb), created_at
```

Enums: `rol_usuario`, `metodo_pago`, `estado_pedido`, `estado_reserva`, `accion_audit`

---

## 4. Fases del Proyecto

### ✅ Fase 0 — Scaffolding (completa)
Next.js 16, Tailwind 4, Supabase SDK, shadcn/ui, Vitest, Playwright, GitHub Actions.

### ✅ Fase 1 — MVP Tienda pública (completa)
Catálogo, filtros por categoría, detalle con galería y variantes, carrito (localStorage), checkout → WhatsApp link.

### ✅ Fase 3 — Admin Dashboard base (completa — implementada fuera de orden)
Login Supabase Auth, sidebar, CRUD productos con imágenes y variantes, CRUD categorías, CRUD habitaciones con imágenes, gestión de pedidos (lista + detalle + cambio estado), gestión de reservas.

---

### ✅ Fase 2 — MVP Hostal público (completa — commit `90384ad`)

**Entregable**: El cliente puede ver habitaciones disponibles y contactar por WhatsApp para reservar.

**Archivos a crear:**

```
src/lib/queries/habitaciones.ts
  └── getHabitaciones()                    — lista para la página de listado
  └── getHabitacionBySlug(slug)            — detalle de habitación
  └── getDisponibilidad(habitacionId, checkIn, checkOut)  — verifica si hay reservas que chocan

src/lib/whatsapp.ts (actualizar)
  └── generarLinkReserva({ habitacion, nombre, telefono, checkIn, checkOut, huespedes })

src/components/public/habitacion-card.tsx  — card para el listado
src/components/public/galeria-habitacion.tsx  — galería de imágenes (reusar patrón de galeria-producto)
src/components/public/reserva-form.tsx     — formulario "client": fechas + nombre + tel → WA link

src/app/(public)/hostal/page.tsx           — RSC, lista habitaciones disponibles
src/app/(public)/hostal/[slug]/page.tsx    — RSC, detalle + formulario de reserva
```

**Lógica de disponibilidad (MVP simple):**
```sql
-- Habitación NO disponible si existe reserva que se superpone:
SELECT id FROM reservas
WHERE habitacion_id = $id
  AND estado NOT IN ('cancelada')
  AND fecha_check_in < $fecha_check_out
  AND fecha_check_out > $fecha_check_in
  AND deleted_at IS NULL
LIMIT 1
```
Si hay resultado → mostrar "No disponible para esas fechas, contactanos por WhatsApp".

**Mensaje WhatsApp de reserva:**
```
Hola! Me gustaría reservar la {nombre}.
• Check-in: {fecha_check_in}
• Check-out: {fecha_check_out}
• Huéspedes: {numero_huespedes}
• Mi nombre: {huesped_nombre}
Total estimado: ${total} COP

Por favor confirmen disponibilidad.
```

**UX de la página hostal:**
- Header con foto de portada del hostal
- Filtros: tipo de habitación, capacidad
- Cards con: imagen, nombre, tipo, capacidad, precio/noche, amenidades clave
- Detalle: galería fullscreen, descripción, amenidades completas, disponibilidad, formulario de reserva

---

### ✅ Fase 4 — Analíticas y Reportes (completa — commit `8e847fc`)

**Entregable**: Los dueños ven el pulso del negocio de un vistazo.

**Nueva ruta:** `/admin/analiticas` — accessible desde sidebar (link nuevo).

**Archivos a crear:**

```
src/lib/queries/metricas.ts
  └── getIngresosPorPeriodo(periodo: 'semana'|'mes'|'año')
        → { fecha: string, ingresos_tienda: number, ingresos_hostal: number }[]
  └── getTopProductos(periodo: 'semana'|'mes'|'año')
        → { nombre: string, unidades_vendidas: number, ingresos: number }[]
  └── getHistorialPedidos(page, filtros)
        → pedidos paginados con cliente + items
  └── getMetricasHostal(periodo)
        → { total_reservas, ingresos_total, tasa_ocupacion_pct, proximas_reservas[] }
  └── getAlertasStockBajo()
        → { producto, variante, stock_actual, stock_minimo }[]  ← también usada en dashboard

src/components/admin/analiticas/
  ├── periodo-selector.tsx    — "client": tabs Semana / Mes / Año
  ├── ingresos-chart.tsx      — "client": Recharts AreaChart responsive
  ├── top-productos-chart.tsx — "client": Recharts BarChart horizontal
  ├── tabla-ventas.tsx        — "client": TanStack Table + filtros fecha/estado
  └── export-csv-btn.tsx      — "client": genera CSV en memoria y dispara download

src/app/(admin)/admin/analiticas/page.tsx  — RSC con Suspense por sección
```

**Queries SQL para métricas (aproximación):**

```sql
-- Ingresos tienda por día (últimos 30 días)
SELECT date_trunc('day', created_at) AS fecha, SUM(total) AS ingresos
FROM pedidos
WHERE estado NOT IN ('cancelado') AND deleted_at IS NULL
  AND created_at >= now() - interval '30 days'
GROUP BY 1 ORDER BY 1;

-- Top productos (últimos 30 días)
SELECT p.nombre, SUM(pi.cantidad) AS unidades, SUM(pi.subtotal) AS ingresos
FROM pedido_items pi
JOIN productos p ON p.id = pi.producto_id
JOIN pedidos ped ON ped.id = pi.pedido_id
WHERE ped.estado NOT IN ('cancelado') AND ped.deleted_at IS NULL
  AND ped.created_at >= now() - interval '30 days'
GROUP BY p.id, p.nombre
ORDER BY unidades DESC LIMIT 10;

-- Tasa de ocupación hostal
SELECT
  COUNT(DISTINCT r.id) AS reservas,
  SUM(r.fecha_check_out - r.fecha_check_in) AS noches_reservadas,
  (COUNT(DISTINCT h.id) * 30) AS noches_disponibles -- 30 días del período
FROM reservas r
CROSS JOIN habitaciones h
WHERE r.estado NOT IN ('cancelada') AND r.deleted_at IS NULL
  AND h.deleted_at IS NULL;
```

**Caching:** `unstable_cache` de Next.js con `revalidate: 3600` (1 hora) — datos analíticos no necesitan ser real-time.

**Export CSV:** Sin librería externa. Generar en cliente:
```ts
const csv = [headers, ...rows.map(r => Object.values(r).join(','))].join('\n')
const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
// ﻿ = BOM para Excel en Windows
```

**Sidebar update:** Agregar "Analíticas" con ícono `BarChart3` entre "Pedidos" y la sección Hostal.

**Actualización del dashboard home:**
Agregar a `src/app/(admin)/admin/page.tsx`:
- Alerta de stock bajo si `getAlertasStockBajo()` devuelve items
- Ingresos del día (suma de pedidos de hoy con estado != cancelado)

---

### ✅ Fase 5 — UX Helpers (completa)

**Entregable**: El admin es genuinamente usable sin capacitación técnica.

**Librerías nuevas:**
- `cmdk` — búsqueda global Cmd+K (0.2 MB gzip)
- `driver.js` — tour onboarding (más liviano que react-joyride)

```bash
pnpm add cmdk driver.js
```

**Items en orden de prioridad:**

#### 5.1 — Alertas de stock bajo (Fase 5 completa con Fase 4)
- Query `getAlertasStockBajo()` ya planeada en Fase 4
- Badge rojo en sidebar "Productos (3 alertas)" cuando hay variantes con `stock <= stock_minimo`
- Card de alerta en dashboard home

#### 5.2 — Búsqueda global Cmd+K
```
src/components/admin/busqueda-global.tsx  — "client": cmdk palette
  Busca en: productos (nombre, slug), pedidos (numero_orden, cliente_nombre), 
            reservas (numero_reserva, huesped_nombre), habitaciones (nombre)
  Server Action: buscarGlobal(query) → resultados por categoría
```

#### 5.3 — Papelera de reciclaje
```
src/app/(admin)/admin/papelera/page.tsx  — lista entidades con deleted_at != null
  Tabs: Productos | Categorías | Habitaciones | Pedidos
  Botón "Restaurar" → Server Action que setea deleted_at = null
  Botón "Eliminar definitivamente" → DELETE real (solo superadmin)
```

#### 5.4 — Audit log visible
```
src/components/admin/historial-cambios.tsx  — lista de audit_log por entidad
  Formato: "{nombre} {accion} {entidad} — {tiempo relativo}"
  Ej: "Ana actualizó el precio de $23.000 a $25.000 — hace 2 horas"
  
Agregar como tab "Historial" en:
  - src/app/(admin)/admin/productos/[id]/page.tsx
  - src/app/(admin)/admin/pedidos/[id]/page.tsx  
  - src/app/(admin)/admin/reservas/[id]/page.tsx  (a crear)
```

#### 5.5 — Tour de onboarding
```
src/components/admin/onboarding-tour.tsx  — "client": driver.js
  Se activa si localStorage('onboarding_done') !== 'true'
  Pasos: sidebar → nuevo producto → pedidos → reservas → analíticas
  Al finalizar: set localStorage + marcar en profiles (campo onboarding_completado bool)
  
  Migración necesaria: 
  ALTER TABLE profiles ADD COLUMN onboarding_completado boolean DEFAULT false;
```

#### 5.6 — Plantillas de productos
```
src/components/admin/plantillas-producto.tsx  — modal con opciones
  Plantillas hardcodeadas (no en DB): 
    "Aceite esencial" → campos: nombre, precio (vacío), variantes: "10ml", "30ml"
    "Té en hojas"    → variantes: "50g", "100g", "250g"
    "Crema"          → variantes: "60ml", "120ml"
    "Tintura"        → variantes: "30ml", "60ml"
  Al seleccionar → pre-llena ProductoForm
```

---

### ❌ Fase 6 — Pulido y Launch

**Entregable**: Plataforma en producción, performante y accesible.

#### 6.1 — SEO
```
src/app/(public)/tienda/[slug]/page.tsx   — generateMetadata() con producto.nombre + descripcion
src/app/(public)/hostal/[slug]/page.tsx   — generateMetadata() con habitacion.nombre
src/app/(public)/layout.tsx               — metadata base (title template, description)
src/app/sitemap.ts                        — sitemap dinámico (productos + habitaciones)
src/app/robots.ts                         — robots.txt (bloquear /admin)
public/og-default.jpg                     — imagen Open Graph por defecto
```

#### 6.2 — i18n (next-intl)
next-intl ya instalado. Activar:
```
src/i18n/routing.ts          — defineRouting({ locales: ['es', 'en'], defaultLocale: 'es' })
src/middleware.ts             — wrappear con createMiddleware
messages/es.json             — strings en español
messages/en.json             — strings en inglés (solo tienda pública + hostal)
```
**Scope del i18n**: SOLO rutas públicas (`/tienda`, `/hostal`). Admin SIEMPRE en español.

#### 6.3 — Performance
- `next/image` en todos los `<img>` que falten (con width/height explícitos)
- `Suspense` + skeleton loading en secciones de datos
- `loading.tsx` por ruta en admin
- Metadata `dynamic = 'force-static'` en páginas que pueden pre-renderizarse

#### 6.4 — Accesibilidad
- Auditoría con `axe-core` (instalar como devDependency)
- Asegurar contraste 4.5:1 en texto primario
- `aria-label` en todos los botones icono
- Focus visible en todos los elementos interactivos
- Navegación por Tab completa en formularios

#### 6.5 — Deploy
```
Vercel (frontend):
  - Connect GitHub repo → auto-deploy main
  - Env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
  - Domain: configurar dominio del cliente

Supabase Cloud:
  - Crear proyecto en app.supabase.com
  - supabase db push (aplicar migrations)
  - supabase seed (datos iniciales)
  - Storage bucket "productos" + "habitaciones" (policy: public read)
```

#### 6.6 — Monitoreo
- Sentry: `@sentry/nextjs` para error tracking
- Vercel Analytics (ya incluido en plan Vercel)
- Lighthouse CI en GitHub Actions (score mínimo 85)

---

## 5. Riesgos Identificados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Admin no-técnico rompe datos por accidente | Alto | Soft delete + confirmaciones + undo + audit log |
| Dos admins editan el mismo producto a la vez | Medio | Optimistic locking con `updatedAt` |
| Cliente confundido con checkout por WhatsApp | Medio | UX clara: "Al hacer click se abre WhatsApp con tu pedido ya armado" |
| Stock desincronizado (venta offline + online) | Alto | Modo "ajuste rápido" de stock + alertas stock bajo |
| Traducciones (es/en) se vuelven inconsistentes | Medio | next-intl con archivos JSON versionados |
| Imágenes pesadas degradan performance | Medio | Supabase Storage + `next/image` con transformaciones |
| Dueño quiere cambios que rompen el MVP | Alto | SDD: toda feature grande pasa por `/sdd-new` |
| `/hostal` muestra 404 antes de Fase 2 | Alto | **Resolver en próxima sesión de código** |

---

## 6. Criterios de Éxito del MVP

1. El dueño puede cargar un producto nuevo en **< 3 minutos** sin ayuda.
2. Un cliente puede completar el flujo compra → WhatsApp en **< 90 segundos**.
3. El admin funciona correctamente en **celular** (testeado en iOS y Android).
4. **Lighthouse score > 85** en páginas públicas clave (home, detalle producto).
5. **Zero data loss** en los primeros 3 meses (gracias a soft delete + backups).

---

## 7. Próximos Pasos

1. **Implementar Fase 6** — pulido + deploy (coordinar con el dueño: dominio, número WA real, foto portada hostal, bucket Storage en Supabase Cloud)
2. **Setup del cliente** — aplicar migrations a Supabase Cloud (incluyendo `20260425000000_onboarding.sql`), generar tipos TS, crear primer admin

---

## Referencias

- Ideas detalladas del dashboard admin: `./admin-dashboard-ideas.md`
- Contexto técnico global: `../../CLAUDE.md`
- Skill registry: `../skill-registry.md`
