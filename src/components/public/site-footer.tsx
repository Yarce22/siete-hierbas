export function SiteFooter() {
  return (
    <footer className="border-t bg-white py-6 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} Siete Hierbas — Santa Rosa de Cabal,
          Colombia
        </span>
        <span className="text-xs">
          Hecho con herbolaria y un poco de código.
        </span>
      </div>
    </footer>
  );
}
