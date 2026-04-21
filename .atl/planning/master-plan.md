# Siete Hierbas — Plan Maestro

> **Propósito**: Hoja de ruta completa para construir la plataforma Siete Hierbas (e-commerce naturista + hostal) con panel admin intuitivo para dueños sin conocimientos técnicos.
>
> **Audiencia**: Alejo (dev) + futuros sub-agentes que trabajen en el proyecto.
>
> **Estado**: Pre-scaffolding. Proyecto vacío. Todo lo que sigue es planeación — nada implementado aún.

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

### Por qué sin pasarela
- Simplicidad inicial
- Costo de integración (Wompi, PayU, Mercado Pago cobran comisión)
- El dueño quiere contacto directo con el cliente

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
- Tradeoff aceptado: cierto lock-in con Supabase. Mitigación: el core es PostgreSQL estándar, migrar a otra DB siempre es posible.

### 2.4 WhatsApp Click to Chat (no Business API)
**Decisión**: URL `https://wa.me/573XXXXXXXXX?text=mensaje_predefinido`.
**Razón**: Business API requiere aprobación de Meta, tiene costo por conversación, y es overkill para volumen inicial. Click to Chat funciona desde día 1, gratis.

**Upgrade path**: Si el volumen crece, migrar a Business API con Twilio/360dialog.

### 2.5 Soft Delete en todo el dominio
**Decisión**: Nunca hacer DELETE físico. Marcar `deletedAt`.
**Razón**: Admin no-técnico = más errores humanos. Necesitamos "papelera de reciclaje" y auditoría.

### 2.6 Audit log de cambios del admin
**Decisión**: Tabla `audit_log` registrando quién cambió qué y cuándo.
**Razón**: Dos administradores → necesitamos trazabilidad si hay discrepancias ("¿quién cambió el precio de este producto?").

---

## 3. Modelo de Datos (preliminar)

### Dominio E-commerce

```
Producto
├── id, nombre, slug, descripcion, categoriaId
├── imagenes[] (Cloudinary URLs)
├── destacado: bool
├── deletedAt, createdAt, updatedAt
└── variantes[]
    └── VarianteProducto
        ├── id, productoId, nombre (ej: "250ml"), sku
        ├── precio (COP, entero, sin decimales)
        ├── stock, stockMinimo
        └── deletedAt

Categoria
├── id, nombre, slug, icono, orden
└── deletedAt

Pedido
├── id, numeroOrden (correlativo humano)
├── clienteNombre, clienteTelefono, clienteEmail?
├── direccionEntrega?
├── metodoPago: 'efectivo' | 'transferencia'
├── estado: 'pendiente_whatsapp' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado'
├── total (COP)
├── notas?
└── items[]
    └── ItemPedido
        ├── productoId, varianteId, cantidad
        ├── precioUnitario (snapshot al momento del pedido)
        └── subtotal
```

### Dominio Hostal

```
Habitacion
├── id, nombre (ej: "Habitación Lavanda"), tipo
├── capacidad (personas), precioNoche (COP)
├── descripcion, imagenes[], amenidades[]
└── deletedAt

Reserva
├── id, numeroReserva
├── habitacionId
├── huespedNombre, huespedTelefono, huespedEmail?
├── fechaCheckIn, fechaCheckOut
├── numeroHuespedes
├── estado: 'pendiente' | 'confirmada' | 'en_curso' | 'completada' | 'cancelada'
├── total (COP)
├── metodoPago, notas?
└── deletedAt
```

### Dominio Admin

```
Usuario
├── id, nombre, email, passwordHash
├── rol: 'admin' | 'superadmin'
└── deletedAt

AuditLog
├── id, usuarioId, entidad, entidadId
├── accion: 'create' | 'update' | 'delete' | 'restore'
├── cambios (JSONB)
└── createdAt
```

---

## 4. Fases del Proyecto

### Fase 0 — Fundamentos (1-2 días)
- [ ] Scaffolding Next.js 15 (TypeScript, Tailwind, App Router, src/)
- [ ] Inicializar shadcn/ui
- [ ] Instalar Supabase SDK (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Setup clientes Supabase (server, browser, middleware)
- [ ] Supabase CLI init + proyecto Supabase creado (dev + prod)
- [ ] Variables de entorno + `.env.example`
- [ ] Instalar Zod + react-hook-form + next-intl
- [ ] Linter, formatter (Prettier), hooks (husky + lint-staged)
- [ ] Testing: Vitest (unit) + Playwright (e2e) config inicial
- [ ] CI básico (GitHub Actions: typecheck + lint + test)
- [ ] Re-run `/sdd-init` para activar Strict TDD

**Entregable**: Proyecto que corre en local (`pnpm dev`), conecta a Supabase, tests vacíos pasan.

### Fase 1 — MVP E-commerce público (1 semana)
- [ ] Schema Prisma: Producto, Variante, Categoria
- [ ] API: endpoints públicos GET de productos/categorías
- [ ] Web: Home con productos destacados
- [ ] Web: Catálogo con filtros (categoría, precio)
- [ ] Web: Detalle de producto con galería + variantes
- [ ] Web: Carrito (localStorage + Context)
- [ ] Web: Checkout que genera link WhatsApp
- [ ] Seed de datos de prueba

**Entregable**: Cliente puede navegar, agregar al carrito y contactar por WhatsApp.

### Fase 2 — MVP Hostal público (3-4 días)
- [ ] Schema Prisma: Habitacion, Reserva
- [ ] API: endpoints públicos de habitaciones
- [ ] Web: Sección "Hostal" con listado de habitaciones
- [ ] Web: Detalle de habitación + calendario de disponibilidad
- [ ] Web: Formulario de reserva → WhatsApp

**Entregable**: Cliente puede ver habitaciones, consultar disponibilidad y reservar por WhatsApp.

### Fase 3 — Admin Dashboard base (1 semana)
- [ ] Autenticación NextAuth + JWT al API
- [ ] Layout admin con sidebar + tooltips en cada sección
- [ ] Dashboard home con "Buenos días, [nombre]. Hoy tenés X pedidos..."
- [ ] CRUD Productos con validaciones y tooltips `?`
- [ ] Upload de imágenes a Cloudinary (drag & drop)
- [ ] CRUD Categorías
- [ ] CRUD Habitaciones
- [ ] Gestión de Pedidos (lista + detalle + cambio de estado)
- [ ] Gestión de Reservas (lista + calendario)
- [ ] Vista previa en tiempo real al editar productos

**Entregable**: Admin operable para carga de productos, gestión de pedidos y reservas.

### Fase 4 — Analíticas y Reportes (4-5 días)
- [ ] Endpoint API de métricas (con cache)
- [ ] Gráficos de ingresos (día/semana/mes/año) — Recharts
- [ ] Top productos más vendidos (filtros de período)
- [ ] Histórico de ventas con búsqueda y filtros
- [ ] Métricas del hostal (ocupación, ingresos, huéspedes)
- [ ] Export a CSV/Excel para contabilidad

**Entregable**: Dueños ven el pulso del negocio de un vistazo.

### Fase 5 — UX Helpers (3-4 días)
- [ ] Tour de onboarding (react-joyride o similar)
- [ ] Sistema de tooltips contextual (`?` hover en todos los campos)
- [ ] Búsqueda global (Cmd+K) en admin
- [ ] Notificaciones de stock bajo (email + dashboard)
- [ ] Plantillas de productos (acelerador de carga)
- [ ] Soft delete con "Papelera de Reciclaje"
- [ ] Audit log visible en cada entidad

**Entregable**: El admin es genuinamente usable sin capacitación técnica.

### Fase 6 — Pulido y Launch (3-4 días)
- [ ] SEO (metadata dinámica, sitemap, robots.txt)
- [ ] Open Graph para compartir en redes
- [ ] Accesibilidad WCAG AA (auditoría con axe)
- [ ] Performance (Lighthouse > 90 en web pública)
- [ ] i18n español/inglés (next-intl) — solo en web pública
- [ ] Deploy web (Vercel), api (Railway/Render), DB (Neon/Railway)
- [ ] Dominio + SSL
- [ ] Monitoreo básico (Sentry)

**Entregable**: Plataforma en producción.

### Fase 7 — Post-launch (roadmap)
- Facturación electrónica DIAN
- Sistema de reseñas
- Programa de fidelización
- App móvil (React Native reutilizando API)
- Pasarela de pagos (Wompi / Mercado Pago)
- WhatsApp Business API

---

## 5. Riesgos Identificados

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Admin no-técnico rompe datos por accidente | Alto | Soft delete + confirmaciones + undo + audit log |
| Dos admins editan el mismo producto a la vez | Medio | Optimistic locking con `updatedAt` o WebSocket notifications |
| Cliente confundido con checkout por WhatsApp | Medio | UX clara: "Al hacer click se abre WhatsApp con tu pedido ya armado" |
| Stock desincronizado (venta offline + online) | Alto | Modo "ajuste rápido" de stock en admin + alertas de stock bajo |
| Traducciones (es/en) se vuelven inconsistentes | Medio | next-intl con archivos JSON versionados + revisión en PR |
| Imágenes pesadas degradan performance | Medio | Cloudinary con transformaciones automáticas + `next/image` |
| Dueño quiere cambios que rompen el MVP | Alto | SDD: toda feature grande pasa por `/sdd-new` con propuesta aprobada |

---

## 6. Criterios de Éxito del MVP

1. El dueño puede cargar un producto nuevo en **< 3 minutos** sin ayuda.
2. Un cliente puede completar el flujo compra → WhatsApp en **< 90 segundos**.
3. El admin funciona correctamente en **celular** (testeado en iOS y Android).
4. **Lighthouse score > 85** en páginas públicas clave (home, detalle producto).
5. **Zero data loss** incidents en los primeros 3 meses (gracias a soft delete + backups).

---

## 7. Próximos Pasos Inmediatos

1. **Validar este plan con el dueño** — ¿algo falta? ¿prioridades correctas?
2. **Escoger proveedores**: Cloudinary plan, hosting DB (Neon/Railway/Supabase), dominio.
3. **Conseguir número de WhatsApp del negocio** (ideal: línea dedicada).
4. **Paleta de colores y tipografía** — usar `ui-ux-pro-max` para elegir (estética herboristería + hostal rural, colores tierra/verde).
5. **Arrancar Fase 0**: scaffolding.

---

## Referencias

- Ideas detalladas del dashboard admin: `./admin-dashboard-ideas.md`
- Contexto técnico global: `../../CLAUDE.md`
- Skill registry: `../skill-registry.md`
