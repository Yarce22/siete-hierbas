import { getSiteConfig } from "@/lib/queries/site-config";

export async function InfoBar() {
  const config = await getSiteConfig();
  if (!config.info_bar_visible || !config.info_bar_texto.trim()) return null;

  return (
    <div
      style={{
        background: "var(--sh-dark-2)",
        borderBottom: "1px solid rgba(228,215,184,0.08)",
        textAlign: "center",
        padding: "0.55rem 1rem",
        fontSize: "0.72rem",
        letterSpacing: "0.12em",
        color: "var(--sh-cream-2)",
        fontFamily: "var(--sh-sans)",
      }}
    >
      {config.info_bar_texto}
    </div>
  );
}
