-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  Siete Hierbas — Seed de datos iniciales                             ║
-- ║                                                                      ║
-- ║  Datos mínimos para arrancar: categorías típicas de herboristería.   ║
-- ║  Los productos los carga el admin desde el dashboard.                ║
-- ║                                                                      ║
-- ║  Uso:                                                                ║
-- ║    pnpm dlx supabase db reset  (aplica migrations + seed)            ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ─────────────────────────────────────────────────────────────
-- CATEGORÍAS INICIALES
-- ─────────────────────────────────────────────────────────────
-- Los íconos son nombres de lucide-react: https://lucide.dev/icons/

insert into categorias (nombre, slug, icono, orden) values
  ('Aceites esenciales', 'aceites-esenciales', 'droplet', 10),
  ('Tés e infusiones',   'tes-e-infusiones',   'cup-soda', 20),
  ('Cremas y ungüentos', 'cremas-y-unguentos', 'hand',     30),
  ('Tinturas',           'tinturas',           'flask-conical', 40),
  ('Hierbas secas',      'hierbas-secas',      'leaf',     50),
  ('Miel y derivados',   'miel-y-derivados',   'honey',    60),
  ('Suplementos',        'suplementos',        'pill',     70)
on conflict (slug) do nothing;
