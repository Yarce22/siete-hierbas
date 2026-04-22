# Base de Datos — Siete Hierbas

Documentación de la capa de datos: schema, migrations, RLS y cómo trabajar con Supabase CLI.

## Schema base

El schema inicial está en `supabase/migrations/20260421100000_schema_base.sql` e incluye:

### Dominio E-commerce
- `categorias` — Categorías de productos (aceites, tés, cremas, etc.)
- `productos` — Productos del catálogo
- `producto_imagenes` — Imágenes por producto (galería ordenada)
- `producto_variantes` — Variantes (tamaño, presentación). **Aquí vive el precio y stock.**
- `pedidos` — Pedidos generados desde el checkout
- `pedido_items` — Items de cada pedido (con precio snapshot)

### Dominio Hostal
- `habitaciones` — Habitaciones del hostal
- `habitacion_imagenes` — Galería de imágenes por habitación
- `reservas` — Reservas con fecha de check-in/check-out

### Admin
- `profiles` — Extiende `auth.users` de Supabase con rol y nombre
- `audit_log` — Registro automático de cambios en entidades críticas

## Convenciones

| Convención | Razón |
|------------|-------|
| Nombres en español (`productos`, no `products`) | Dominio del negocio en español, regla global del proyecto |
| `snake_case` plural para tablas | Convención PostgreSQL estándar |
| PK UUID con `gen_random_uuid()` | No expone cardinalidad, mejor para URLs públicas |
| `deleted_at timestamptz` (soft delete) | Admin no-técnico → errores reversibles |
| `created_at` / `updated_at` en todas | Auditoría básica + trigger `set_updated_at()` |
| Dinero: `integer` en COP (sin decimales) | COP en práctica no usa centavos. Evita errores de float |
| Enums tipados para estados | Type safety en la DB |
| Numero de orden/reserva: `bigint identity` | Correlativo monotónico sin race conditions |

## Trigger de audit

Las tablas `productos`, `producto_variantes`, `categorias`, `pedidos`, `habitaciones` y `reservas` tienen un trigger `log_audit` que registra automáticamente en `audit_log` cada INSERT/UPDATE/DELETE, distinguiendo entre soft delete y restore por el cambio de `deleted_at`.

El `usuario_id` se captura desde `auth.uid()` en el momento del trigger.

## Row Level Security (RLS)

Toda tabla tiene RLS habilitado. Reglas:

| Tabla | SELECT | INSERT | UPDATE / DELETE |
|-------|--------|--------|-----------------|
| `categorias`, `productos`, `producto_variantes`, `habitaciones`, `*_imagenes` | Público (solo activos) | Admin | Admin |
| `pedidos`, `pedido_items` | Admin | **Público** (solo `estado='pendiente_whatsapp'`) | Admin |
| `reservas` | Admin | **Público** (solo `estado='pendiente'`) | Admin |
| `profiles` | Propio + admin | Trigger `on_auth_user_created` | Admin |
| `audit_log` | Admin | Trigger `log_audit` (security definer) | — |

### Función helper `is_admin()`

```sql
select is_admin();             -- admin actual
select is_admin(check_user_id); -- otro usuario
```

Devuelve `true` si el usuario tiene rol `'admin'` o `'superadmin'` en `profiles`. Usa `security definer` para evitar recursión infinita al consultar la misma tabla que define políticas.

## Cómo aplicar la migration

> **La migration base es idempotente**: empieza con un bloque de `drop ... if exists` para que se pueda correr varias veces sin errores. Esto aplica **solo a esta primera migration de desarrollo**. Las migrations posteriores serán incrementales.

### Opción A — Ejecutar el SQL directamente en el SQL Editor de Supabase

1. Abrí tu proyecto en [app.supabase.com](https://app.supabase.com)
2. Andá al **SQL Editor** → **New query**
3. Pegá el contenido de `supabase/migrations/20260421100000_schema_base.sql`
4. Ejecutá (**Run**)
5. (Opcional) Pegá y ejecutá `supabase/seed.sql` para las categorías iniciales

### Opción B — Supabase CLI (recomendado para el flujo de desarrollo)

```bash
# 1. Inicializar Supabase en el proyecto (crea supabase/config.toml)
pnpm dlx supabase init

# 2. Linkear con tu proyecto remoto
pnpm dlx supabase link --project-ref <PROJECT_REF>

# 3. Aplicar migrations al proyecto remoto
pnpm dlx supabase db push

# 4. (Opcional) Aplicar seed.sql
# El seed se aplica automáticamente con `supabase db reset` en local.
# Para aplicarlo al remoto, correrlo manualmente desde el SQL Editor.
```

### Opción C — Desarrollo local con Docker

```bash
# Requiere Docker corriendo.
pnpm dlx supabase start         # Levanta Postgres, Auth, Storage local
pnpm dlx supabase db reset      # Aplica migrations + seed limpio
```

## Generar tipos TypeScript

Cada vez que cambies el schema:

```bash
pnpm dlx supabase gen types typescript --project-id <PROJECT_ID> > src/types/supabase.ts
```

Esto regenera el tipo `Database` que usan los clientes Supabase (`src/lib/supabase/*.ts`) y garantiza type-safety end-to-end.

## Cómo crear el primer admin

Después de aplicar la migration, necesitás un usuario admin para el dashboard. Flujo:

1. En Supabase Dashboard → **Authentication** → **Users** → **Add user → Create new user**
2. Completá email + password (marcá "Auto Confirm User")
3. El trigger `on_auth_user_created` creará automáticamente su fila en `profiles` con rol `'admin'`
4. (Opcional) Editá el `nombre` en la tabla `profiles` desde el Table Editor

Para hacer a alguien `'superadmin'`, actualizá manualmente:

```sql
update profiles set rol = 'superadmin' where id = '<user-id>';
```
