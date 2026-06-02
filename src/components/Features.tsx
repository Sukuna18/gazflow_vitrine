"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Package, ShoppingCart, Truck, MapPin, BarChart3, ClipboardList, Users, Shield } from "lucide-react";

const features = [
  { icon: Package, title: "Stock temps réel", color: "#165db2", desc: "Bouteilles par catégorie, seuils d'alerte, historique complet des mouvements. Zéro rupture imprévue." },
  { icon: ShoppingCart, title: "Gestion des ventes", color: "#22c55e", desc: "Cash, crédit, Orange Money, Wave. Encaissements partiels, export, gestion du crédit client." },
  { icon: Truck, title: "Sessions livraison", color: "#ff5b2e", desc: "Assignez des missions liées à des ventes. Suivi statut et collecte du paiement à la livraison." },
  { icon: MapPin, title: "GPS en direct", color: "#32c5ff", desc: "Carte Google Maps interactive. Positions livreurs en temps réel, historique des routes." },
  { icon: BarChart3, title: "Rapports financiers", color: "#ec4899", desc: "CA annuel, marges réelles par produit, top clients, top produits. Export CSV et PDF." },
  { icon: ClipboardList, title: "Commandes fournisseurs", color: "#d81920", desc: "Créez des commandes, suivez leur statut. Réception auto avec mise à jour du stock." },
  { icon: Users, title: "4 rôles métier", color: "#06b6d4", desc: "Admin, Vendeur, Magasinier, Livreur. Chacun avec son espace et ses permissions précises." },
  { icon: Shield, title: "Audit & sécurité", color: "#84cc16", desc: "Journal complet de toutes les actions. JWT sécurisé, historique des transactions." },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="features" className="py-28 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-[12px] font-bold text-blue-600 tracking-[0.15em] uppercase mb-4">Fonctionnalités</p>
          <h2 className="text-[36px] sm:text-[52px] font-extrabold text-slate-950 tracking-tight leading-[1.05] mb-4" style={{ fontFamily: "var(--font-cabinet)" }}>
            Toute l&apos;exploitation, <span className="text-fire">sur le même tableau.</span>
          </h2>
          <p className="text-[15px] text-slate-500 max-w-md mx-auto">Survolez une carte pour en savoir plus sur chaque module.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }} className="flip h-[200px]">
              <div className="flip-inner">
                <div className="flip-f p-6 border flex flex-col justify-between shadow-[0_18px_40px_rgba(22,93,178,0.04)]" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}15` }}>
                      <f.icon size={20} style={{ color: f.color }} />
                    </div>
                    <h3 className="text-[14px] font-bold text-slate-950 leading-snug" style={{ fontFamily: "var(--font-cabinet)" }}>{f.title}</h3>
                  </div>
                  <div className="h-px mt-4" style={{ background: `linear-gradient(90deg, ${f.color}50, transparent)` }} />
                </div>
                <div className="flip-b p-5 flex flex-col justify-center border" style={{ background: `linear-gradient(135deg, ${f.color}12, ${f.color}06)`, borderColor: `${f.color}30` }}>
                  <f.icon size={16} style={{ color: f.color }} className="mb-3 opacity-80" />
                  <p className="text-[12.5px] text-slate-700 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
