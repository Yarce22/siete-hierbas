alter table site_config
  add column if not exists popup_activo boolean not null default false,
  add column if not exists popup_imagen_url text,
  add column if not exists popup_link text not null default '';
