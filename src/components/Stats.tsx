"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  { value: 12000, suffix: "+", label: "Bouteilles suivies", sub: "en stock cumulé" },
  { value: 98, suffix: "%", label: "Disponibilité", sub: "uptime garanti" },
  { value: 3500, suffix: "+", label: "Ventes / mois", sub: "sur la plateforme" },
  { value: 15, suffix: "", label: "Dépôts actifs", sub: "utilisent Top Energies" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);

  return <span ref={ref}>{val.toLocaleString("fr")}{suffix}</span>;
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="stats" className="py-20 px-6 relative" ref={ref}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(50,197,255,0.06), transparent)" }} />
      <div className="absolute inset-x-0 top-0 h-px shimmer-line" />
      <div className="absolute inset-x-0 bottom-0 h-px shimmer-line" />

      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
            <div className="text-[42px] sm:text-[52px] font-extrabold leading-none mb-1.5 text-fire" style={{ fontFamily: "var(--font-cabinet)" }}>
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <p className="text-[14px] font-semibold text-slate-950 mb-0.5">{s.label}</p>
            <p className="text-[12px] text-slate-500">{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
