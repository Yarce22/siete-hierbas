export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          accion: Database["public"]["Enums"]["accion_audit"]
          cambios: Json | null
          created_at: string
          entidad: string
          entidad_id: string
          id: string
          usuario_id: string | null
        }
        Insert: {
          accion: Database["public"]["Enums"]["accion_audit"]
          cambios?: Json | null
          created_at?: string
          entidad: string
          entidad_id: string
          id?: string
          usuario_id?: string | null
        }
        Update: {
          accion?: Database["public"]["Enums"]["accion_audit"]
          cambios?: Json | null
          created_at?: string
          entidad?: string
          entidad_id?: string
          id?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      categorias: {
        Row: {
          created_at: string
          deleted_at: string | null
          icono: string | null
          id: string
          nombre: string
          orden: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          icono?: string | null
          id?: string
          nombre: string
          orden?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          icono?: string | null
          id?: string
          nombre?: string
          orden?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      habitacion_imagenes: {
        Row: {
          alt_text: string | null
          created_at: string
          habitacion_id: string
          id: string
          orden: number
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          habitacion_id: string
          id?: string
          orden?: number
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          habitacion_id?: string
          id?: string
          orden?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "habitacion_imagenes_habitacion_id_fkey"
            columns: ["habitacion_id"]
            isOneToOne: false
            referencedRelation: "habitaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_slides: {
        Row: {
          id: string
          imagen_url: string
          titulo: string
          subtitulo: string | null
          boton_texto: string
          boton_link: string
          orden: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          imagen_url: string
          titulo?: string
          subtitulo?: string | null
          boton_texto?: string
          boton_link?: string
          orden?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          imagen_url?: string
          titulo?: string
          subtitulo?: string | null
          boton_texto?: string
          boton_link?: string
          orden?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_config: {
        Row: {
          id: string
          info_bar_texto: string
          info_bar_visible: boolean
          historia_titulo: string
          historia_subtitulo: string
          historia_parrafo1: string
          historia_parrafo2: string
          historia_imagen_url: string | null
          hostal_titulo: string
          hostal_subtitulo: string
          hostal_parrafo: string
          hostal_caracteristicas: string[]
          por_que_titulo: string
          por_que_subtitulo: string
          por_que_cards: Json
          updated_at: string
        }
        Insert: {
          id?: string
          info_bar_texto?: string
          info_bar_visible?: boolean
          historia_titulo?: string
          historia_subtitulo?: string
          historia_parrafo1?: string
          historia_parrafo2?: string
          historia_imagen_url?: string | null
          hostal_titulo?: string
          hostal_subtitulo?: string
          hostal_parrafo?: string
          hostal_caracteristicas?: string[]
          por_que_titulo?: string
          por_que_subtitulo?: string
          por_que_cards?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          info_bar_texto?: string
          info_bar_visible?: boolean
          historia_titulo?: string
          historia_subtitulo?: string
          historia_parrafo1?: string
          historia_parrafo2?: string
          historia_imagen_url?: string | null
          hostal_titulo?: string
          hostal_subtitulo?: string
          hostal_parrafo?: string
          hostal_caracteristicas?: string[]
          por_que_titulo?: string
          por_que_subtitulo?: string
          por_que_cards?: Json
          updated_at?: string
        }
        Relationships: []
      }
      habitaciones: {
        Row: {
          amenidades: string[]
          capacidad: number
          created_at: string
          deleted_at: string | null
          descripcion: string | null
          destacada: boolean
          id: string
          nombre: string
          precio_noche: number
          slug: string
          tipo: string
          updated_at: string
        }
        Insert: {
          amenidades?: string[]
          capacidad: number
          created_at?: string
          deleted_at?: string | null
          descripcion?: string | null
          destacada?: boolean
          id?: string
          nombre: string
          precio_noche: number
          slug: string
          tipo: string
          updated_at?: string
        }
        Update: {
          amenidades?: string[]
          capacidad?: number
          created_at?: string
          deleted_at?: string | null
          descripcion?: string | null
          destacada?: boolean
          id?: string
          nombre?: string
          precio_noche?: number
          slug?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      pedido_items: {
        Row: {
          cantidad: number
          created_at: string
          id: string
          pedido_id: string
          precio_unitario: number
          producto_id: string
          subtotal: number
          variante_id: string
        }
        Insert: {
          cantidad: number
          created_at?: string
          id?: string
          pedido_id: string
          precio_unitario: number
          producto_id: string
          subtotal: number
          variante_id: string
        }
        Update: {
          cantidad?: number
          created_at?: string
          id?: string
          pedido_id?: string
          precio_unitario?: number
          producto_id?: string
          subtotal?: number
          variante_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedido_items_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_items_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "producto_variantes"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_email: string | null
          cliente_nombre: string
          cliente_telefono: string
          created_at: string
          deleted_at: string | null
          direccion_entrega: string | null
          estado: Database["public"]["Enums"]["estado_pedido"]
          id: string
          metodo_pago: Database["public"]["Enums"]["metodo_pago"]
          notas: string | null
          numero_orden: number
          total: number
          updated_at: string
        }
        Insert: {
          cliente_email?: string | null
          cliente_nombre: string
          cliente_telefono: string
          created_at?: string
          deleted_at?: string | null
          direccion_entrega?: string | null
          estado?: Database["public"]["Enums"]["estado_pedido"]
          id?: string
          metodo_pago: Database["public"]["Enums"]["metodo_pago"]
          notas?: string | null
          numero_orden?: never
          total: number
          updated_at?: string
        }
        Update: {
          cliente_email?: string | null
          cliente_nombre?: string
          cliente_telefono?: string
          created_at?: string
          deleted_at?: string | null
          direccion_entrega?: string | null
          estado?: Database["public"]["Enums"]["estado_pedido"]
          id?: string
          metodo_pago?: Database["public"]["Enums"]["metodo_pago"]
          notas?: string | null
          numero_orden?: never
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      producto_imagenes: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          orden: number
          producto_id: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          orden?: number
          producto_id: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          orden?: number
          producto_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "producto_imagenes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      producto_variantes: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          nombre: string
          precio: number
          producto_id: string
          sku: string | null
          stock: number
          stock_minimo: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          nombre: string
          precio: number
          producto_id: string
          sku?: string | null
          stock?: number
          stock_minimo?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          nombre?: string
          precio?: number
          producto_id?: string
          sku?: string | null
          stock?: number
          stock_minimo?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "producto_variantes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          categoria_id: string | null
          created_at: string
          deleted_at: string | null
          descripcion: string | null
          destacado: boolean
          id: string
          nombre: string
          slug: string
          updated_at: string
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string
          deleted_at?: string | null
          descripcion?: string | null
          destacado?: boolean
          id?: string
          nombre: string
          slug: string
          updated_at?: string
        }
        Update: {
          categoria_id?: string | null
          created_at?: string
          deleted_at?: string | null
          descripcion?: string | null
          destacado?: boolean
          id?: string
          nombre?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nombre: string
          rol: Database["public"]["Enums"]["rol_usuario"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          nombre: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nombre?: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          updated_at?: string
        }
        Relationships: []
      }
      reservas: {
        Row: {
          created_at: string
          deleted_at: string | null
          estado: Database["public"]["Enums"]["estado_reserva"]
          fecha_check_in: string
          fecha_check_out: string
          habitacion_id: string
          huesped_email: string | null
          huesped_nombre: string
          huesped_telefono: string
          id: string
          metodo_pago: Database["public"]["Enums"]["metodo_pago"]
          notas: string | null
          numero_huespedes: number
          numero_reserva: number
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha_check_in: string
          fecha_check_out: string
          habitacion_id: string
          huesped_email?: string | null
          huesped_nombre: string
          huesped_telefono: string
          id?: string
          metodo_pago: Database["public"]["Enums"]["metodo_pago"]
          notas?: string | null
          numero_huespedes: number
          numero_reserva?: never
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          estado?: Database["public"]["Enums"]["estado_reserva"]
          fecha_check_in?: string
          fecha_check_out?: string
          habitacion_id?: string
          huesped_email?: string | null
          huesped_nombre?: string
          huesped_telefono?: string
          id?: string
          metodo_pago?: Database["public"]["Enums"]["metodo_pago"]
          notas?: string | null
          numero_huespedes?: number
          numero_reserva?: never
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservas_habitacion_id_fkey"
            columns: ["habitacion_id"]
            isOneToOne: false
            referencedRelation: "habitaciones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { check_user_id?: string }; Returns: boolean }
    }
    Enums: {
      accion_audit: "create" | "update" | "delete" | "restore"
      estado_pedido:
        | "pendiente_whatsapp"
        | "confirmado"
        | "en_camino"
        | "entregado"
        | "cancelado"
      estado_reserva:
        | "pendiente"
        | "confirmada"
        | "en_curso"
        | "completada"
        | "cancelada"
      metodo_pago: "efectivo" | "transferencia"
      rol_usuario: "admin" | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      accion_audit: ["create", "update", "delete", "restore"],
      estado_pedido: [
        "pendiente_whatsapp",
        "confirmado",
        "en_camino",
        "entregado",
        "cancelado",
      ],
      estado_reserva: [
        "pendiente",
        "confirmada",
        "en_curso",
        "completada",
        "cancelada",
      ],
      metodo_pago: ["efectivo", "transferencia"],
      rol_usuario: ["admin", "superadmin"],
    },
  },
} as const
