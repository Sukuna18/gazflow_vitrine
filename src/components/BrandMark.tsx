interface BrandMarkProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  subtitleClassName?: string;
  withText?: boolean;
  subtitle?: string;
}

export default function BrandMark({
  className,
  iconClassName,
  textClassName,
  subtitleClassName,
  withText = true,
  subtitle = "Camberene Point · Dakar",
}: BrandMarkProps) {
  return (
    <div className={["flex items-center gap-3", className].filter(Boolean).join(" ")}>
      <div
        className={[
          "relative flex items-center justify-center rounded-[1.15rem] bg-white ring-1 ring-sky-100 shadow-[0_18px_40px_rgba(22,93,178,0.14)]",
          iconClassName ?? "h-11 w-11",
        ].join(" ")}
      >
        <svg viewBox="0 0 100 100" className="h-[88%] w-[88%]" aria-hidden="true">
          <defs>
            <linearGradient id="vitrine-blue" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#32c5ff" />
              <stop offset="100%" stopColor="#165db2" />
            </linearGradient>
            <linearGradient id="vitrine-red" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#ff5b2e" />
              <stop offset="100%" stopColor="#d81920" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="48" r="33" fill="none" stroke="url(#vitrine-blue)" strokeWidth="8" />
          <path d="M15 61 C28 51, 39 33, 64 22 C77 17, 88 17, 91 24 C94 30, 89 39, 82 46" fill="none" stroke="url(#vitrine-red)" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M14 60 C22 70, 37 74, 56 75 C70 76, 83 72, 91 64" fill="none" stroke="url(#vitrine-red)" strokeWidth="6.5" strokeLinecap="round" />
          <path d="M54 22 L33 47 H48 L39 73 L67 43 H51 Z" fill="url(#vitrine-red)" />
        </svg>
      </div>
      {withText && (
        <div className="min-w-0">
          <div
            className={["text-[16px] font-extrabold leading-none tracking-[-0.03em] text-slate-950", textClassName]
              .filter(Boolean)
              .join(" ")}
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Top Energies
          </div>
          <div
            className={["mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500", subtitleClassName]
              .filter(Boolean)
              .join(" ")}
          >
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
}
