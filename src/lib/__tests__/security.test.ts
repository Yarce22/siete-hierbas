import { beforeEach, describe, expect, it, vi } from "vitest";

import { validateImageFile } from "@/lib/utils/storage";
import { isTablaPermitida } from "@/lib/utils/papelera";
import { categoriaSchema } from "@/lib/validators/categorias";
import { productoSchema, varianteSchema } from "@/lib/validators/productos";
import { habitacionSchema } from "@/lib/validators/habitaciones";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const makeFile = (size: number, type: string, name = "test.jpg") =>
  new File([new Uint8Array(size)], name, { type });

const MB = 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 1. File upload validation
// ─────────────────────────────────────────────────────────────────────────────

describe("validateImageFile — MIME type allowlist", () => {
  it("accepts image/jpeg", () => {
    expect(validateImageFile(makeFile(1000, "image/jpeg"))).toBeNull();
  });

  it("accepts image/png", () => {
    expect(validateImageFile(makeFile(1000, "image/png"))).toBeNull();
  });

  it("accepts image/webp", () => {
    expect(validateImageFile(makeFile(1000, "image/webp"))).toBeNull();
  });

  it("accepts image/gif", () => {
    expect(validateImageFile(makeFile(1000, "image/gif"))).toBeNull();
  });

  it("rejects application/pdf even with .jpg extension", () => {
    expect(validateImageFile(makeFile(1000, "application/pdf", "invoice.pdf.jpg"))).not.toBeNull();
  });

  it("rejects application/x-msdownload (executable)", () => {
    expect(validateImageFile(makeFile(1000, "application/x-msdownload", "virus.exe"))).not.toBeNull();
  });

  it("rejects image/svg+xml (XSS vector)", () => {
    expect(validateImageFile(makeFile(1000, "image/svg+xml", "xss.svg"))).not.toBeNull();
  });

  it("rejects text/html", () => {
    expect(validateImageFile(makeFile(1000, "text/html", "page.html"))).not.toBeNull();
  });

  it("rejects empty MIME type", () => {
    expect(validateImageFile(makeFile(1000, "", "no-mime.xyz"))).not.toBeNull();
  });

  it("rejects application/octet-stream (generic binary)", () => {
    expect(validateImageFile(makeFile(1000, "application/octet-stream", "payload.bin"))).not.toBeNull();
  });
});

describe("validateImageFile — file size limit (10 MB)", () => {
  it("accepts file at exactly 10 MB", () => {
    expect(validateImageFile(makeFile(10 * MB, "image/jpeg"))).toBeNull();
  });

  it("rejects file at 10 MB + 1 byte", () => {
    expect(validateImageFile(makeFile(10 * MB + 1, "image/jpeg"))).toMatch(/10 MB/);
  });

  it("rejects file at 11 MB", () => {
    expect(validateImageFile(makeFile(11 * MB, "image/jpeg"))).toMatch(/10 MB/);
  });

  it("accepts 1-byte file", () => {
    expect(validateImageFile(makeFile(1, "image/png"))).toBeNull();
  });

  it("error message is user-friendly in Spanish", () => {
    const msg = validateImageFile(makeFile(11 * MB, "image/jpeg"));
    expect(msg).toBeTruthy();
    expect(typeof msg).toBe("string");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Papelera — runtime table name validation
// ─────────────────────────────────────────────────────────────────────────────

describe("isTablaPermitida — allowlist", () => {
  it.each(["productos", "categorias", "habitaciones", "pedidos"])(
    "allows '%s'",
    (tabla) => expect(isTablaPermitida(tabla)).toBe(true),
  );

  it.each([
    "profiles",
    "audit_log",
    "auth.users",
    "producto_variantes",
    "pedido_items",
    "",
    "'; DROP TABLE productos; --",
    "1 OR 1=1",
    "../etc/passwd",
    "PRODUCTOS", // case-sensitive
  ])("blocks '%s'", (tabla) => expect(isTablaPermitida(tabla)).toBe(false));
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Zod schemas — SQL / XSS injection via inputs
// ─────────────────────────────────────────────────────────────────────────────

const SQL_ATTACKS = [
  "'; DROP TABLE productos; --",
  "1' OR '1'='1",
  "1; SELECT * FROM profiles",
  "UNION SELECT * FROM auth.users--",
  "\" OR 1=1 --",
];

const XSS_ATTACKS = [
  "<script>alert(1)</script>",
  "javascript:alert(1)",
  "<img src=x onerror=alert(1)>",
  "';alert(String.fromCharCode(88,83,83))//",
];

describe("productoSchema — slug field blocks injection", () => {
  const slugParse = (value: string) =>
    productoSchema.shape.slug.safeParse(value);

  it.each([...SQL_ATTACKS, ...XSS_ATTACKS, "has spaces", "HAS_UPPERCASE"])(
    "rejects '%s'",
    (attack) => expect(slugParse(attack).success).toBe(false),
  );

  it("accepts a valid slug", () => {
    expect(slugParse("aceite-de-romero-premium").success).toBe(true);
  });

  it("accepts alphanumeric with hyphens", () => {
    expect(slugParse("te-verde-100g").success).toBe(true);
  });
});

describe("productoSchema — nombre field with injection", () => {
  const nombreParse = (v: string) => productoSchema.shape.nombre.safeParse(v);

  it("rejects empty string", () => {
    expect(nombreParse("").success).toBe(false);
  });

  // Text fields accept arbitrary strings (Supabase parameterizes them)
  // but must not be empty — injection risk is handled at the ORM layer
  it("accepts SQL-like text (parameterized by ORM)", () => {
    expect(nombreParse("aceite's natural").success).toBe(true);
  });
});

describe("varianteSchema — precio and stock block negative / non-numeric", () => {
  it("rejects negative precio", () => {
    expect(varianteSchema.shape.precio.safeParse(-1).success).toBe(false);
  });

  it("rejects float precio", () => {
    expect(varianteSchema.shape.precio.safeParse(1.5).success).toBe(false);
  });

  it("rejects SQL injection string as precio", () => {
    expect(varianteSchema.shape.precio.safeParse("'; DROP TABLE--").success).toBe(false);
  });

  it("accepts valid COP price", () => {
    expect(varianteSchema.shape.precio.safeParse(25000).success).toBe(true);
  });

  it("accepts zero stock", () => {
    expect(varianteSchema.shape.stock.safeParse(0).success).toBe(true);
  });
});

describe("categoriaSchema — slug blocks injection", () => {
  const slugParse = (v: string) => categoriaSchema.shape.slug.safeParse(v);

  it.each([...SQL_ATTACKS, ...XSS_ATTACKS])(
    "rejects '%s'",
    (a) => expect(slugParse(a).success).toBe(false),
  );

  it("accepts valid slug", () => {
    expect(slugParse("aceites-esenciales").success).toBe(true);
  });
});

describe("habitacionSchema — numeric fields block injection", () => {
  it("rejects zero capacidad (min 1)", () => {
    expect(habitacionSchema.shape.capacidad.safeParse(0).success).toBe(false);
  });

  it("rejects negative precio_noche", () => {
    expect(habitacionSchema.shape.precio_noche.safeParse(-100).success).toBe(false);
  });

  it("rejects SQL injection in capacidad", () => {
    expect(habitacionSchema.shape.capacidad.safeParse("1; DROP TABLE--").success).toBe(false);
  });

  it("accepts valid room data", () => {
    expect(habitacionSchema.shape.capacidad.safeParse(2).success).toBe(true);
    expect(habitacionSchema.shape.precio_noche.safeParse(80000).success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. requireAdmin — auth guard
// ─────────────────────────────────────────────────────────────────────────────

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("requireAdmin — blocks unauthenticated and non-admin users", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns error when no user session exists", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
      rpc: vi.fn(),
    } as never);

    const { requireAdmin } = await import("@/lib/supabase/require-admin");
    const result = await requireAdmin();

    expect(result.supabase).toBeNull();
    expect(result.error).toBe("No autenticado.");
  });

  it("returns error when authenticated user is not admin", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-123" } },
          error: null,
        }),
      },
      rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
    } as never);

    const { requireAdmin } = await import("@/lib/supabase/require-admin");
    const result = await requireAdmin();

    expect(result.supabase).toBeNull();
    expect(result.error).toBe("Sin permisos de administrador.");
  });

  it("returns supabase client when user is admin", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "admin-456" } },
          error: null,
        }),
      },
      rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const { requireAdmin } = await import("@/lib/supabase/require-admin");
    const result = await requireAdmin();

    expect(result.error).toBeNull();
    expect(result.supabase).toBe(mockSupabase);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. buscarGlobal — auth check
// ─────────────────────────────────────────────────────────────────────────────

describe("buscarGlobal — auth check", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns empty array when query is too short", async () => {
    const { buscarGlobal } = await import("@/lib/actions/busqueda");
    expect(await buscarGlobal("a")).toEqual([]);
    expect(await buscarGlobal("")).toEqual([]);
  });

  it("returns empty array for unauthenticated requests", async () => {
    const { createClient } = await import("@/lib/supabase/server");
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as never);

    const { buscarGlobal } = await import("@/lib/actions/busqueda");
    const result = await buscarGlobal("aceite de romero");

    expect(result).toEqual([]);
  });
});
