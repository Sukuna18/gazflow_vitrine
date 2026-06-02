"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Crown, ShoppingBag, Warehouse, Bike } from "lucide-react";

const roles = [
  { icon: Crown, color: "#165db2", title: "Administrateur", desc: "Vision totale sur l'activité. Rapports, utilisateurs, fournisseurs, géolocalisation.", perms: ["Dashboard complet", "Rapports financiers", "Gestion équipe", "Géolocalisation"] },
  { icon: ShoppingBag, color: "#22c55e", title: "Vendeur", desc: "Enregistre les ventes, gère les encaissements et les crédits clients.", perms: ["Créer des ventes", "Encaissements", "Gestion clients", "Historique"] },
  { icon: Warehouse, color: "#32c5ff", title: "Magasinier", desc: "Supervise les stocks, réceptionne les commandes, gère les inventaires.", perms: ["Inventaire", "Réception commandes", "Mouvements stock", "Alertes"] },
  { icon: Bike, color: "#ff5b2e", title: "Livreur", desc: "Application mobile dédiée. Reçoit ses missions et confirme les livraisons.", perms: ["App mobile", "Mes missions", "Navigation GPS", "Paiement"] },
];

export default function Roles() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="roles" className="py-28 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-14">
          <p className="text-[12px] font-bold text-blue-600 tracking-[0.15em] uppercase mb-4">Multi-rôles</p>
          <h2 className="text-[36px] sm:text-[50px] font-extrabold text-slate-950 tracking-tight leading-[1.05] max-w-xl" style={{ fontFamily: "var(--font-cabinet)" }}>
            Chaque profil <span className="text-fire">à sa place.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl p-6 border transition-all duration-300 group cursor-default bg-white shadow-[0_18px_40px_rgba(22,93,178,0.04)]"
              style={{ borderColor: "var(--border)" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${r.color}40`;
                e.currentTarget.style.boxShadow = `0 0 40px ${r.color}10`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "0 18px 40px rgba(22,93,178,0.04)";
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `${r.color}15` }}>
                <r.icon size={21} style={{ color: r.color }} />
              </div>
              <h3 className="text-[15px] font-bold text-slate-950 mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>{r.title}</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed mb-5">{r.desc}</p>
              <div className="flex flex-col gap-1.5">
                {r.perms.map((p) => (
                  <div key={p} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full shrink-0" style={{ background: r.color }} />
                    <span className="text-[12px] text-slate-600">{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
