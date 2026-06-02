"use client";
import { motion } from "motion/react";
import { ArrowRight, Package, TrendingUp, Truck, Zap } from "lucide-react";
import BrandMark from "./BrandMark";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg pt-24 pb-16 px-6">
      <div className="glow-orb w-[620px] h-[620px] top-[-210px] left-[-210px] bg-sky-300/20" />
      <div className="glow-orb w-[520px] h-[420px] bottom-[-120px] right-[-160px] bg-red-300/16" />

      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 40%, var(--bg) 100%)" }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-sky-100 bg-white/80 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="ping2 absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
          </span>
          <span className="text-[12px] font-semibold text-slate-600 tracking-wide">
            Top Energies · Distribution de gaz pilotée en temps réel
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }} className="mb-8">
          <BrandMark subtitle="Plateforme logistique & commerciale" textClassName="text-[20px] sm:text-[24px]" subtitleClassName="text-[10px] sm:text-[11px] text-slate-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-[48px] sm:text-[64px] lg:text-[78px] font-extrabold leading-[1.0] tracking-[-0.03em] text-slate-950 mb-6"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          Gérez votre dépôt<br />
          <span className="text-fire">avec plus d&apos;énergie.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[17px] text-slate-500 leading-[1.7] max-w-xl mb-10"
        >
          Stock, ventes, livraisons GPS, rapports financiers. Une seule plateforme pour les distributeurs qui veulent une exploitation rapide, lisible et fiable.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="flex flex-col sm:flex-row gap-3 mb-16">
          <a
            href="#cta"
            className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-white transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #165db2, #32c5ff 58%, #ff5b2e)", boxShadow: "0 12px 32px rgba(22,93,178,0.22)" }}
          >
            Demander une démo
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a href="#features" className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-[15px] text-slate-600 hover:text-slate-950 border border-sky-100 hover:border-sky-200 bg-white/70 transition-all duration-200">
            Voir les fonctionnalités
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.65 }} className="flex flex-wrap justify-center gap-4 mb-16">
          {[
            { icon: Package, value: "1 240+", label: "bouteilles suivies", color: "#165db2" },
            { icon: TrendingUp, value: "38,5M", label: "CA mensuel FCFA", color: "#22c55e" },
            { icon: Truck, value: "7", label: "livraisons actives", color: "#ff5b2e" },
            { icon: Zap, value: "47", label: "ventes aujourd'hui", color: "#32c5ff" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-sky-100 bg-white/75 shadow-[0_12px_30px_rgba(22,93,178,0.05)]">
              <s.icon size={14} style={{ color: s.color }} />
              <span className="text-[13px] font-bold text-slate-950" style={{ fontFamily: "var(--font-cabinet)" }}>{s.value}</span>
              <span className="text-[12px] text-slate-500">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 w-full max-w-5xl mx-auto bob">
        <MockupDashboard />
      </motion.div>
    </section>
  );
}

function MockupDashboard() {
  return (
    <div className="rounded-2xl border border-sky-100 overflow-hidden bg-white" style={{ boxShadow: "0 40px 100px rgba(22,93,178,0.12), 0 0 0 1px rgba(50,197,255,0.08)" }}>
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-sky-100 bg-[#f8fbff]">
        <div className="flex gap-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-12 py-1 rounded-md bg-white border border-sky-100 text-[11px] text-slate-400 font-mono">
            topenergies.sn/admin/dashboard
          </div>
        </div>
      </div>

      <div className="flex h-[340px]">
        <div className="w-[200px] shrink-0 border-r border-sky-100 p-4 hidden md:flex flex-col gap-1 bg-[#f8fbff]">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-50 mb-3">
            <div className="w-3.5 h-3.5 rounded bg-sky-300/70" />
            <div className="h-2.5 rounded-full bg-sky-400/70 w-16" />
          </div>
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg">
              <div className="w-3.5 h-3.5 rounded bg-sky-100" />
              <div className="h-2 rounded-full bg-sky-100" style={{ width: `${50 + i * 8}%` }} />
            </div>
          ))}
        </div>

        <div className="flex-1 p-5 overflow-hidden bg-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {[
              { color: "#165db2", v: "1 240", l: "Stock total" },
              { color: "#22c55e", v: "38,5M", l: "CA du mois" },
              { color: "#ff5b2e", v: "47", l: "Ventes/jour" },
              { color: "#32c5ff", v: "7", l: "En livraison" },
            ].map((k) => (
              <div key={k.l} className="rounded-xl p-3 border border-sky-100 bg-[#fbfdff]">
                <div className="w-5 h-5 rounded-md mb-2" style={{ background: `${k.color}20` }} />
                <div className="text-[11px] text-slate-400 mb-1">{k.l}</div>
                <div className="text-[16px] font-bold text-slate-950" style={{ fontFamily: "var(--font-cabinet)" }}>{k.v}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 rounded-xl border border-sky-100 bg-[#fbfdff] p-4">
              <div className="h-2 rounded-full bg-sky-100 w-28 mb-4" />
              <div className="flex items-end gap-1.5 h-[120px]">
                {[35,55,42,75,50,88,65,80,55,92,70,85].map((h,i) => (
                  <div key={i} className="flex-1 rounded-sm transition-all" style={{
                    height: `${h}%`,
                    background: i >= 10 ? "linear-gradient(to top, #165db2, #32c5ff)"
                      : i >= 8 ? "rgba(22,93,178,0.35)"
                      : "rgba(22,93,178,0.12)",
                  }} />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-sky-100 bg-[#fbfdff] p-4 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-[6px] border-sky-100 border-t-sky-400 border-r-red-400/60 mb-3" />
              <div className="space-y-1.5 w-full">
                {[["#165db2","Cash","62%"],["#ff5b2e","Crédit","24%"],["#22c55e","Mobile","14%"]].map(([c,l,v]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-sm" style={{ background: c as string }} />
                    <span className="text-[10px] text-slate-400 flex-1">{l}</span>
                    <span className="text-[10px] font-semibold text-slate-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
