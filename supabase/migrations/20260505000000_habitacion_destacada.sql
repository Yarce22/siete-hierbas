ALTER TABLE habitaciones
  ADD COLUMN IF NOT EXISTS destacada boolean NOT NULL DEFAULT false;
