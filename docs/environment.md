# Variables de Entorno

Copiá este bloque a un archivo **`.env.local`** en el root del proyecto y completá los valores reales.

```bash
# ─────────────────────────────────────────────────────────────
# Siete Hierbas — Environment variables
# ─────────────────────────────────────────────────────────────

# Supabase (obtener desde https://app.supabase.com/project/<id>/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase Service Role (SOLO en server — NUNCA exponer al cliente)
# Necesario para operaciones admin que bypassean RLS (seeds, jobs internos)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# WhatsApp del negocio (formato internacional, sin + ni espacios)
# Ej: 573001234567 para +57 300 123 4567
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567

# URL base del sitio (para SEO, Open Graph, emails)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Cómo obtener las credenciales de Supabase

1. Entrá a [app.supabase.com](https://app.supabase.com) y creá un proyecto nuevo (o seleccioná el existente).
2. En el sidebar, andá a **Project Settings → API**.
3. Copiá:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (**⚠️ NUNCA commitear ni exponer al cliente**)

## Archivos ignorados por git

`.env.local` ya está en `.gitignore` (viene por default con Next.js). **No** commitear valores reales.

Para CI/CD, usar variables de entorno del proveedor (Vercel, GitHub Actions, etc.).
