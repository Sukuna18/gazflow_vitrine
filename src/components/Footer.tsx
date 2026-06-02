import BrandMark from "./BrandMark";

export default function Footer() {
  return (
    <footer className="border-t border-sky-100 px-6 py-12 bg-white/60">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <BrandMark subtitle="Gestion intelligente de dépôts de gaz" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="relative flex w-2 h-2">
              <span className="ping2 absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </div>
            <span className="text-[12px] text-slate-500">Tous systèmes opérationnels</span>
          </div>
          <span className="text-[12px] text-slate-400">© {new Date().getFullYear()} Top Energies</span>
        </div>
      </div>
    </footer>
  );
}
