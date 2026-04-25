-- Agrega campo onboarding_completado a profiles
-- Usado por el tour de onboarding de driver.js para persistir el estado del usuario
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_completado boolean NOT NULL DEFAULT false;
