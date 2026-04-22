// ╔══════════════════════════════════════════════════════════════════════╗
// ║  Tipos de la base de datos — PLACEHOLDER                             ║
// ║                                                                      ║
// ║  Regenerar con:                                                      ║
// ║    pnpm dlx supabase gen types typescript \                          ║
// ║      --project-id <PROJECT_ID> > src/types/supabase.ts               ║
// ║                                                                      ║
// ║  Mientras tanto, este archivo declara un subset mínimo que usan      ║
// ║  las queries públicas. Coincide con el schema de                     ║
// ║  supabase/migrations/20260421100000_schema_base.sql.                 ║
// ╚══════════════════════════════════════════════════════════════════════╝

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: string;
          nombre: string;
          slug: string;
          descripcion: string | null;
          icono: string | null;
          orden: number;
          activo: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["categorias"]["Row"]> & {
          nombre: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["categorias"]["Row"]>;
      };
      productos: {
        Row: {
          id: string;
          categoria_id: string | null;
          nombre: string;
          slug: string;
          descripcion_corta: string | null;
          descripcion: string | null;
          activo: boolean;
          destacado: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["productos"]["Row"]> & {
          nombre: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["productos"]["Row"]>;
      };
      producto_imagenes: {
        Row: {
          id: string;
          producto_id: string;
          url: string;
          alt: string | null;
          orden: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["producto_imagenes"]["Row"]> & {
          producto_id: string;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["producto_imagenes"]["Row"]>;
      };
      producto_variantes: {
        Row: {
          id: string;
          producto_id: string;
          nombre: string;
          sku: string | null;
          precio: number;
          stock: number;
          stock_minimo: number;
          activo: boolean;
          orden: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["producto_variantes"]["Row"]> & {
          producto_id: string;
          nombre: string;
          precio: number;
        };
        Update: Partial<Database["public"]["Tables"]["producto_variantes"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: { check_user_id?: string };
        Returns: boolean;
      };
    };
    Enums: {
      rol_usuario: "admin" | "superadmin" | "cliente";
      estado_pedido:
        | "pendiente_whatsapp"
        | "confirmado"
        | "preparando"
        | "enviado"
        | "entregado"
        | "cancelado";
      estado_reserva:
        | "pendiente"
        | "confirmada"
        | "cancelada"
        | "completada"
        | "no_show";
    };
  };
}
