-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  Siete Hierbas — Schema Base                                         ║
-- ║  Migration: 20260421100000_schema_base                               ║
-- ║                                                                      ║
-- ║  Crea el schema inicial del proyecto:                                ║
-- ║    - Profiles (extiende auth.users de Supabase)                      ║
-- ║    - Dominio E-commerce: categorías, productos, variantes, pedidos   ║
-- ║    - Dominio Hostal: habitaciones, reservas                          ║
-- ║    - Audit log automático                                            ║
-- ║    - RLS policies (lectura pública, escritura admin)                 ║
-- ║                                                                      ║
-- ║  Convenciones:                                                       ║
-- ║    - snake_case plural para tablas                                   ║
-- ║    - UUIDs generados por gen_random_uuid()                           ║
-- ║    - Soft delete con deleted_at en tablas de dominio                 ║
-- ║    - Dinero: integer en COP (pesos colombianos, sin decimales)       ║
-- ║    - Timestamps con zona horaria (timestamptz)                       ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ─────────────────────────────────────────────────────────────
-- 0. RESET (idempotencia en desarrollo)
-- ─────────────────────────────────────────────────────────────
-- Permite correr esta migration múltiples veces sin errores de
-- "already exists". En producción, cada cambio va en su propia
-- migration y este bloque NO se usa.
--
-- CASCADE se encarga de los dependientes (triggers, policies, etc.).

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists audit_log           cascade;
drop table if exists reservas            cascade;
drop table if exists habitacion_imagenes cascade;
drop table if exists habitaciones        cascade;
drop table if exists pedido_items        cascade;
drop table if exists pedidos             cascade;
drop table if exists producto_variantes  cascade;
drop table if exists producto_imagenes   cascade;
drop table if exists productos           cascade;
drop table if exists categorias          cascade;
drop table if exists profiles            cascade;

drop function if exists log_audit()                  cascade;
drop function if exists is_admin(uuid)               cascade;
drop function if exists handle_new_user()            cascade;
drop function if exists set_updated_at()             cascade;

drop type if exists accion_audit     cascade;
drop type if exists estado_reserva   cascade;
drop type if exists estado_pedido    cascade;
drop type if exists metodo_pago      cascade;
drop type if exists rol_usuario      cascade;


-- ─────────────────────────────────────────────────────────────
-- 1. ENUMS (tipos de estado)
-- ─────────────────────────────────────────────────────────────

create type rol_usuario as enum ('admin', 'superadmin');

create type metodo_pago as enum ('efectivo', 'transferencia');

create type estado_pedido as enum (
  'pendiente_whatsapp',
  'confirmado',
  'en_camino',
  'entregado',
  'cancelado'
);

create type estado_reserva as enum (
  'pendiente',
  'confirmada',
  'en_curso',
  'completada',
  'cancelada'
);

create type accion_audit as enum ('create', 'update', 'delete', 'restore');


-- ─────────────────────────────────────────────────────────────
-- 2. FUNCIÓN HELPER — set_updated_at()
-- ─────────────────────────────────────────────────────────────
-- No referencia tablas, por eso puede crearse antes que cualquier schema.

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ─────────────────────────────────────────────────────────────
-- 3. PROFILES (extiende auth.users)
-- ─────────────────────────────────────────────────────────────

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol rol_usuario not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-crea un profile cuando se registra un nuevo usuario en auth.users.
-- El nombre se saca del raw_user_meta_data si está disponible.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, nombre, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    'admin'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ─────────────────────────────────────────────────────────────
-- 3b. FUNCIÓN HELPER — is_admin()
-- ─────────────────────────────────────────────────────────────
-- Va DESPUÉS de crear `profiles` porque `language sql` valida
-- referencias a tablas al crear la función.
-- SECURITY DEFINER evita recursión infinita con las RLS policies
-- que a su vez llaman a esta función.

create or replace function is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = check_user_id
      and rol in ('admin', 'superadmin')
  );
$$;


-- ─────────────────────────────────────────────────────────────
-- 4. DOMINIO E-COMMERCE
-- ─────────────────────────────────────────────────────────────

create table categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  icono text, -- nombre de ícono de lucide-react (ej: "leaf", "droplet")
  orden integer not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categorias_slug_idx on categorias(slug) where deleted_at is null;
create index categorias_orden_idx on categorias(orden) where deleted_at is null;

create trigger categorias_updated_at
  before update on categorias
  for each row execute function set_updated_at();


create table productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text not null unique,
  descripcion text,
  categoria_id uuid references categorias(id) on delete restrict,
  destacado boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index productos_slug_idx on productos(slug) where deleted_at is null;
create index productos_categoria_idx on productos(categoria_id) where deleted_at is null;
create index productos_destacado_idx on productos(destacado) where destacado = true and deleted_at is null;

create trigger productos_updated_at
  before update on productos
  for each row execute function set_updated_at();


create table producto_imagenes (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references productos(id) on delete cascade,
  url text not null,
  alt_text text,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index producto_imagenes_producto_idx on producto_imagenes(producto_id, orden);


create table producto_variantes (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references productos(id) on delete cascade,
  nombre text not null, -- "250ml", "500g", "Tamaño único"
  sku text unique,
  precio integer not null check (precio >= 0), -- COP sin decimales
  stock integer not null default 0 check (stock >= 0),
  stock_minimo integer not null default 5 check (stock_minimo >= 0),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index producto_variantes_producto_idx on producto_variantes(producto_id) where deleted_at is null;
create index producto_variantes_stock_bajo_idx on producto_variantes(producto_id) where stock <= stock_minimo and deleted_at is null;

create trigger producto_variantes_updated_at
  before update on producto_variantes
  for each row execute function set_updated_at();


create table pedidos (
  id uuid primary key default gen_random_uuid(),
  numero_orden bigint generated always as identity unique, -- correlativo humano
  cliente_nombre text not null,
  cliente_telefono text not null,
  cliente_email text,
  direccion_entrega text,
  metodo_pago metodo_pago not null,
  estado estado_pedido not null default 'pendiente_whatsapp',
  total integer not null check (total >= 0),
  notas text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pedidos_estado_idx on pedidos(estado) where deleted_at is null;
create index pedidos_created_at_idx on pedidos(created_at desc) where deleted_at is null;
create index pedidos_telefono_idx on pedidos(cliente_telefono) where deleted_at is null;

create trigger pedidos_updated_at
  before update on pedidos
  for each row execute function set_updated_at();


create table pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  producto_id uuid not null references productos(id) on delete restrict,
  variante_id uuid not null references producto_variantes(id) on delete restrict,
  cantidad integer not null check (cantidad > 0),
  precio_unitario integer not null check (precio_unitario >= 0), -- snapshot al momento del pedido
  subtotal integer not null check (subtotal >= 0),
  created_at timestamptz not null default now()
);

create index pedido_items_pedido_idx on pedido_items(pedido_id);
create index pedido_items_producto_idx on pedido_items(producto_id);


-- ─────────────────────────────────────────────────────────────
-- 5. DOMINIO HOSTAL
-- ─────────────────────────────────────────────────────────────

create table habitaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null, -- ej: "Habitación Lavanda"
  slug text not null unique,
  tipo text not null, -- ej: "doble", "familiar", "suite"
  capacidad integer not null check (capacidad > 0),
  precio_noche integer not null check (precio_noche >= 0), -- COP
  descripcion text,
  amenidades text[] not null default '{}', -- ej: ["wifi", "aire acondicionado", "baño privado"]
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index habitaciones_slug_idx on habitaciones(slug) where deleted_at is null;

create trigger habitaciones_updated_at
  before update on habitaciones
  for each row execute function set_updated_at();


create table habitacion_imagenes (
  id uuid primary key default gen_random_uuid(),
  habitacion_id uuid not null references habitaciones(id) on delete cascade,
  url text not null,
  alt_text text,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);

create index habitacion_imagenes_habitacion_idx on habitacion_imagenes(habitacion_id, orden);


create table reservas (
  id uuid primary key default gen_random_uuid(),
  numero_reserva bigint generated always as identity unique,
  habitacion_id uuid not null references habitaciones(id) on delete restrict,
  huesped_nombre text not null,
  huesped_telefono text not null,
  huesped_email text,
  fecha_check_in date not null,
  fecha_check_out date not null,
  numero_huespedes integer not null check (numero_huespedes > 0),
  estado estado_reserva not null default 'pendiente',
  total integer not null check (total >= 0),
  metodo_pago metodo_pago not null,
  notas text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (fecha_check_out > fecha_check_in)
);

create index reservas_habitacion_fechas_idx on reservas(habitacion_id, fecha_check_in, fecha_check_out) where deleted_at is null;
create index reservas_estado_idx on reservas(estado) where deleted_at is null;
create index reservas_check_in_idx on reservas(fecha_check_in) where deleted_at is null;

create trigger reservas_updated_at
  before update on reservas
  for each row execute function set_updated_at();


-- ─────────────────────────────────────────────────────────────
-- 6. AUDIT LOG
-- ─────────────────────────────────────────────────────────────

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id) on delete set null,
  entidad text not null, -- nombre de la tabla
  entidad_id uuid not null,
  accion accion_audit not null,
  cambios jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_entidad_idx on audit_log(entidad, entidad_id, created_at desc);
create index audit_log_usuario_idx on audit_log(usuario_id, created_at desc);


-- Trigger genérico de audit log para tablas críticas.
create or replace function log_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  action_type accion_audit;
  entity_id uuid;
  changes jsonb;
begin
  if tg_op = 'INSERT' then
    action_type := 'create';
    entity_id := new.id;
    changes := to_jsonb(new);
  elsif tg_op = 'UPDATE' then
    -- Detecta si es un soft delete o restore según el cambio en deleted_at.
    if old.deleted_at is null and new.deleted_at is not null then
      action_type := 'delete';
    elsif old.deleted_at is not null and new.deleted_at is null then
      action_type := 'restore';
    else
      action_type := 'update';
    end if;
    entity_id := new.id;
    changes := jsonb_build_object('before', to_jsonb(old), 'after', to_jsonb(new));
  elsif tg_op = 'DELETE' then
    action_type := 'delete';
    entity_id := old.id;
    changes := to_jsonb(old);
  end if;

  insert into audit_log (usuario_id, entidad, entidad_id, accion, cambios)
  values (auth.uid(), tg_table_name, entity_id, action_type, changes);

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger productos_audit
  after insert or update or delete on productos
  for each row execute function log_audit();

create trigger producto_variantes_audit
  after insert or update or delete on producto_variantes
  for each row execute function log_audit();

create trigger categorias_audit
  after insert or update or delete on categorias
  for each row execute function log_audit();

create trigger pedidos_audit
  after insert or update or delete on pedidos
  for each row execute function log_audit();

create trigger habitaciones_audit
  after insert or update or delete on habitaciones
  for each row execute function log_audit();

create trigger reservas_audit
  after insert or update or delete on reservas
  for each row execute function log_audit();


-- ─────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
-- Estrategia:
--   - Catálogo público (categorías, productos, variantes, imágenes,
--     habitaciones) → SELECT sin restricción (solo items no eliminados).
--   - Pedidos y reservas → crearlos es público (checkout), pero
--     leerlos/modificarlos solo admin.
--   - Profiles, audit_log → solo admin.

alter table profiles enable row level security;
alter table categorias enable row level security;
alter table productos enable row level security;
alter table producto_imagenes enable row level security;
alter table producto_variantes enable row level security;
alter table pedidos enable row level security;
alter table pedido_items enable row level security;
alter table habitaciones enable row level security;
alter table habitacion_imagenes enable row level security;
alter table reservas enable row level security;
alter table audit_log enable row level security;

-- ─── PROFILES ───
create policy "profiles: lectura propia o admin"
  on profiles for select
  using (id = auth.uid() or is_admin());

create policy "profiles: admin puede hacer todo"
  on profiles for all
  using (is_admin())
  with check (is_admin());

-- ─── CATÁLOGO PÚBLICO ───
create policy "categorias: lectura pública de activas"
  on categorias for select
  using (deleted_at is null);

create policy "categorias: admin gestiona"
  on categorias for all
  using (is_admin())
  with check (is_admin());

create policy "productos: lectura pública de activos"
  on productos for select
  using (deleted_at is null);

create policy "productos: admin gestiona"
  on productos for all
  using (is_admin())
  with check (is_admin());

create policy "producto_imagenes: lectura pública"
  on producto_imagenes for select
  using (
    exists (
      select 1 from productos
      where productos.id = producto_imagenes.producto_id
        and productos.deleted_at is null
    )
  );

create policy "producto_imagenes: admin gestiona"
  on producto_imagenes for all
  using (is_admin())
  with check (is_admin());

create policy "producto_variantes: lectura pública de activas"
  on producto_variantes for select
  using (deleted_at is null);

create policy "producto_variantes: admin gestiona"
  on producto_variantes for all
  using (is_admin())
  with check (is_admin());

create policy "habitaciones: lectura pública de activas"
  on habitaciones for select
  using (deleted_at is null);

create policy "habitaciones: admin gestiona"
  on habitaciones for all
  using (is_admin())
  with check (is_admin());

create policy "habitacion_imagenes: lectura pública"
  on habitacion_imagenes for select
  using (
    exists (
      select 1 from habitaciones
      where habitaciones.id = habitacion_imagenes.habitacion_id
        and habitaciones.deleted_at is null
    )
  );

create policy "habitacion_imagenes: admin gestiona"
  on habitacion_imagenes for all
  using (is_admin())
  with check (is_admin());

-- ─── PEDIDOS Y RESERVAS ───
-- INSERT público (checkout del cliente sin login), SELECT/UPDATE/DELETE solo admin.
create policy "pedidos: insert público"
  on pedidos for insert
  with check (estado = 'pendiente_whatsapp');

create policy "pedidos: admin ve y gestiona"
  on pedidos for select
  using (is_admin());

create policy "pedidos: admin actualiza"
  on pedidos for update
  using (is_admin())
  with check (is_admin());

create policy "pedidos: admin elimina"
  on pedidos for delete
  using (is_admin());

create policy "pedido_items: insert junto al pedido"
  on pedido_items for insert
  with check (
    exists (
      select 1 from pedidos
      where pedidos.id = pedido_items.pedido_id
        and pedidos.estado = 'pendiente_whatsapp'
    )
  );

create policy "pedido_items: admin ve"
  on pedido_items for select
  using (is_admin());

create policy "reservas: insert público"
  on reservas for insert
  with check (estado = 'pendiente');

create policy "reservas: admin ve y gestiona"
  on reservas for select
  using (is_admin());

create policy "reservas: admin actualiza"
  on reservas for update
  using (is_admin())
  with check (is_admin());

create policy "reservas: admin elimina"
  on reservas for delete
  using (is_admin());

-- ─── AUDIT LOG ───
create policy "audit_log: solo admin lee"
  on audit_log for select
  using (is_admin());
-- Nota: INSERT en audit_log lo hace la función log_audit() con security definer,
-- por eso no hacen falta policies de INSERT.


-- ─────────────────────────────────────────────────────────────
-- 8. COMENTARIOS (para documentación viva en la DB)
-- ─────────────────────────────────────────────────────────────

comment on table profiles is 'Perfiles de administradores (extiende auth.users).';
comment on table categorias is 'Categorías de productos del e-commerce (ej: Aceites, Tés, Cremas).';
comment on table productos is 'Productos del catálogo. Los precios y stock viven en producto_variantes.';
comment on table producto_variantes is 'Variantes de un producto (tamaños/presentaciones). Aquí vive el precio y stock.';
comment on table pedidos is 'Pedidos del e-commerce. Creados por checkout público, gestionados por admin.';
comment on table habitaciones is 'Habitaciones del hostal.';
comment on table reservas is 'Reservas de habitaciones del hostal.';
comment on table audit_log is 'Registro de auditoría: quién cambió qué y cuándo.';

comment on column productos.slug is 'Identificador URL-friendly único (ej: "aceite-de-romero-premium").';
comment on column producto_variantes.precio is 'Precio en pesos colombianos (COP) sin decimales.';
comment on column producto_variantes.stock_minimo is 'Umbral para alertas de stock bajo en el dashboard admin.';
comment on column pedidos.numero_orden is 'Correlativo humano. Formatear en la app como "P-000123".';
comment on column reservas.numero_reserva is 'Correlativo humano. Formatear en la app como "R-000123".';
