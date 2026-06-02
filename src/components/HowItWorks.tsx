"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Settings2, Layers, TrendingUp } from "lucide-react";

const steps = [
  { icon: Settings2, num: "01", color: "#165db2", title: "Configurez", desc: "Créez votre compte, ajoutez produits et seuils d'alerte, invitez votre équipe avec les bons rôles (Admin, Vendeur, Magasinier, Livreur).", tags: ["Produits", "Équipe", "Alertes"] },
  { icon: Layers, num: "02", color: "#32c5ff", title: "Opérez", desc: "Enregistrez ventes et commandes, assignez des livraisons, suivez les livreurs GPS en direct. Tout se synchronise automatiquement.", tags: ["Ventes", "Livraisons", "GPS"] },
  { icon: TrendingUp, num: "03", color: "#ff5b2e", title: "Analysez", desc: "Consultez dashboard et rapports en temps réel. Exportez vos données financières pour votre comptable en un clic.", tags: ["Dashboard", "Rapports", "Export"] },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="process" className="py-28 px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[12px] font-bold text-blue-600 tracking-[0.15em] uppercase mb-4">Comment ça marche</p>
          <h2 className="text-[36px] sm:text-[50px] font-extrabold text-slate-950 tracking-tight leading-[1.05]" style={{ fontFamily: "var(--font-cabinet)" }}>
            Opérationnel en <span className="text-fire">moins d&apos;une journée.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative">
          <div className="absolute top-14 left-[calc(16.5%+28px)] right-[calc(16.5%+28px)] h-px hidden lg:block" style={{ background: "linear-gradient(90deg, #165db2, #32c5ff, #ff5b2e)", opacity: 0.35 }} />
          {steps.map((s, i) => (
            <motion.div key={s.num} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center z-10 shrink-0" style={{ background: `${s.color}15`, border: `1.5px solid ${s.color}35` }}>
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
                <span className="text-[48px] font-extrabold leading-none" style={{ color: `${s.color}15`, fontFamily: "var(--font-cabinet)" }}>{s.num}</span>
              </div>
              <div className="rounded-2xl p-6 border bg-white shadow-[0_18px_40px_rgba(22,93,178,0.04)]" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-[18px] font-bold text-slate-950 mb-3" style={{ fontFamily: "var(--font-cabinet)" }}>{s.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-5">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 text-[11px] font-semibold rounded-lg" style={{ background: `${s.color}12`, color: s.color }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
