create table site_config (
  id uuid primary key default gen_random_uuid(),
  info_bar_texto text not null default '',
  info_bar_visible boolean not null default false,
  historia_titulo text not null default 'Doce años cultivando sabiduría vegetal',
  historia_subtitulo text not null default 'Nuestra historia',
  historia_parrafo1 text not null default 'Siete Hierbas nació de una pregunta simple: ¿qué sabe el bosque que nosotros hemos olvidado? En 2012, en las faldas de los Andes colombianos, empezamos a cultivar, recolectar y transformar plantas medicinales con el respeto que merecen.',
  historia_parrafo2 text not null default 'Hoy somos herbolaria, hospedaje y escuela de bienestar. Un espacio donde el conocimiento ancestral se encuentra con la sensibilidad contemporánea.',
  historia_imagen_url text,
  hostal_titulo text not null default 'Descanso entre hierba y montaña',
  hostal_subtitulo text not null default 'El Hospedaje',
  hostal_parrafo text not null default 'Nuestro hospedaje boutique es una extensión del jardín. Habitaciones diseñadas para el silencio, con vista a la naturaleza andina, aromaterapia y acceso a termas. Un retiro genuino a minutos del centro de Santa Rosa de Cabal.',
  hostal_caracteristicas text[] not null default ARRAY['Desayuno herbal incluido'::text,'Acceso a termas cercanas','Aromaterapia y bienestar','Wifi y zonas de descanso'],
  por_que_titulo text not null default 'Una experiencia que trasciende',
  por_que_subtitulo text not null default '¿Por qué elegirnos?',
  por_que_cards jsonb not null default '[{"icono":"leaf","titulo":"Cultivo propio y ético","descripcion":"Nuestras plantas se cultivan o recolectan con prácticas agroecológicas, sin pesticidas ni aditivos."},{"icono":"flower","titulo":"Conocimiento ancestral","descripcion":"Trabajamos con sabedores locales y tradiciones medicinales del Eje Cafetero colombiano."},{"icono":"drop","titulo":"Elaboración artesanal","descripcion":"Cada tintura, aceite y preparado se elabora en pequeños lotes para garantizar frescura y potencia."},{"icono":"moon","titulo":"Bienestar integral","descripcion":"El hospedaje ofrece programas de retiro y descanso, no solo una cama: una experiencia completa."}]'::jsonb,
  updated_at timestamptz not null default now()
);

create table hero_slides (
  id uuid primary key default gen_random_uuid(),
  imagen_url text not null,
  titulo text not null default '',
  subtitulo text,
  boton_texto text not null default 'Explorar',
  boton_link text not null default '/tienda',
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index hero_slides_orden_idx on hero_slides(orden) where activo = true;
create trigger hero_slides_updated_at before update on hero_slides for each row execute function set_updated_at();

insert into site_config (id) values ('00000000-0000-0000-0000-000000000001');

alter table site_config enable row level security;
alter table hero_slides enable row level security;

create policy "site_config: lectura pública" on site_config for select using (true);
create policy "site_config: admin gestiona" on site_config for all using (is_admin()) with check (is_admin());
create policy "hero_slides: lectura pública de activos" on hero_slides for select using (activo = true);
create policy "hero_slides: admin gestiona" on hero_slides for all using (is_admin()) with check (is_admin());
