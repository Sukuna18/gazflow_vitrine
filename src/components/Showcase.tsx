"use client";
import { motion } from "motion/react";
import { BarChart3, CreditCard, MapPin, Package, ShieldCheck, Truck } from "lucide-react";

const panels = [
  {
    icon: Package,
    title: "Stock sous contrôle",
    text: "Vue instantanée des bouteilles disponibles, faibles rotations, ruptures et réceptions fournisseurs.",
    accent: "#165db2",
  },
  {
    icon: CreditCard,
    title: "Ventes et paiements",
    text: "Cash, crédit, mobile money et suivi du recouvrement sans tableur parallèle.",
    accent: "#ff5b2e",
  },
  {
    icon: Truck,
    title: "Livraisons pilotées",
    text: "Missions assignées, encaissements à la livraison, retours terrain suivis proprement.",
    accent: "#22c55e",
  },
  {
    icon: MapPin,
    title: "Positionnement terrain",
    text: "Visibilité GPS des livreurs et historique des sessions pour mieux gérer les tournées.",
    accent: "#32c5ff",
  },
  {
    icon: BarChart3,
    title: "Rapports dirigeant",
    text: "Chiffre d'affaires, marges, top produits et performance dépôt lisibles en quelques secondes.",
    accent: "#d81920",
  },
  {
    icon: ShieldCheck,
    title: "Audit fiable",
    text: "Chaque action laisse une trace. Moins d'erreurs silencieuses, plus de responsabilité terrain.",
    accent: "#0f4b90",
  },
];

export default function Showcase() {
  return (
    <section className="py-28 px-6 relative section-fade">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start"
        >
          <div>
            <p className="text-[12px] font-bold text-blue-600 tracking-[0.15em] uppercase mb-4">Vue produit</p>
            <h2 className="text-[36px] sm:text-[52px] font-extrabold text-slate-950 tracking-tight leading-[1.04] mb-5" style={{ fontFamily: "var(--font-cabinet)" }}>
              Une vitrine complète, pas juste un hero <span className="text-fire">et quelques cartes.</span>
            </h2>
            <p className="text-[16px] text-slate-600 leading-8 max-w-xl mb-8">
              Top Energies centralise l&apos;opération quotidienne d&apos;un dépôt de gaz: stock, ventes, fournisseurs, livreurs,
              géolocalisation et finances. Le point fort n&apos;est pas la quantité de modules, mais leur cohérence sur le terrain.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["Moins de pertes", "Chaque mouvement stock est tracé et rapproché des ventes ou réceptions."],
                ["Moins d'attente", "Le vendeur et le magasinier travaillent sur la même donnée en temps réel."],
                ["Plus de visibilité", "Le responsable voit immédiatement les écarts, retards et anomalies."],
                ["Plus de rigueur", "Les rôles limitent les actions et rendent l'organisation plus nette."],
              ].map(([title, text]) => (
                <div key={title} className="surface rounded-2xl p-5 bg-white/90">
                  <div className="text-[15px] font-bold text-slate-950 mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>{title}</div>
                  <p className="text-[13px] text-slate-600 leading-6">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {panels.map((panel, index) => (
              <motion.div
                key={panel.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="surface rounded-2xl p-5 bg-white/92"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${panel.accent}14` }}>
                  <panel.icon size={20} style={{ color: panel.accent }} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-950 mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>{panel.title}</h3>
                <p className="text-[13px] text-slate-600 leading-6">{panel.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
