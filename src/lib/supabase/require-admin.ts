import { createClient } from "./server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase: null as null, error: "No autenticado." as string };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return { supabase: null as null, error: "Sin permisos de administrador." as string };

  return { supabase, error: null as null };
}
