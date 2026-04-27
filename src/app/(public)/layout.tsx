import { CartProvider } from "@/components/public/cart-provider";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { GrainOverlay } from "@/components/public/grain-overlay";
import { SiteCursor } from "@/components/public/site-cursor";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div
        className="sh-public flex min-h-screen flex-col"
        style={{ background: "var(--sh-dark)", color: "var(--sh-cream)" }}
      >
        <GrainOverlay />
        <SiteCursor />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </CartProvider>
  );
}
