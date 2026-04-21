/**
 * Supabase Database types.
 *
 * Este archivo se regenera automáticamente con:
 *   pnpm supabase gen types typescript --project-id <PROJECT_ID> > src/types/supabase.ts
 *
 * Placeholder hasta que se cree el primer schema y se genere desde el proyecto Supabase.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
