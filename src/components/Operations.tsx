"use client";
import { motion } from "motion/react";
import { ArrowRightLeft, Boxes, FileSpreadsheet, Gauge, ReceiptText, UserRoundCog } from "lucide-react";

const items = [
  { icon: Boxes, title: "Inventaire & seuils", text: "Produits, catégories, alertes basses et mouvements enregistrés proprement.", accent: "#165db2" },
  { icon: ReceiptText, title: "Cycle de vente", text: "Vente, facture, crédit client, encaissement partiel et historique centralisés.", accent: "#ff5b2e" },
  { icon: ArrowRightLeft, title: "Commandes & réceptions", text: "Création des commandes fournisseur puis injection directe en stock à la réception.", accent: "#32c5ff" },
  { icon: Gauge, title: "Pilotage manager", text: "KPIs journaliers et mensuels sans consolidation manuelle en fin de semaine.", accent: "#d81920" },
  { icon: UserRoundCog, title: "Permissions claires", text: "Chaque rôle voit uniquement ce qui lui sert et agit dans son périmètre réel.", accent: "#0f4b90" },
  { icon: FileSpreadsheet, title: "Exports métier", text: "CSV et PDF pour la direction, la comptabilité et les points de contrôle terrain.", accent: "#22c55e" },
];

export default function Operations() {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="surface rounded-[2rem] p-7 bg-white/92 sticky top-24"
          >
            <p className="text-[12px] font-bold text-blue-600 tracking-[0.15em] uppercase mb-4">Cas d&apos;usage</p>
            <h2 className="text-[34px] sm:text-[48px] font-extrabold text-slate-950 tracking-tight leading-[1.04] mb-4" style={{ fontFamily: "var(--font-cabinet)" }}>
              Conçu pour un dépôt qui vend, livre et <span className="text-fire">rend des comptes.</span>
            </h2>
            <p className="text-[15px] text-slate-600 leading-7 mb-6">
              La vitrine doit montrer le produit tel qu&apos;il sert réellement. Ici, l&apos;objectif n&apos;est pas de faire joli uniquement,
              mais de montrer pourquoi l&apos;outil remplace les tableaux dispersés et les suivis improvisés.
            </p>
            <div className="rounded-2xl border border-sky-100 bg-[#f7fbff] p-5">
              <div className="text-[13px] font-semibold text-slate-900 mb-3">Ce que le responsable gagne</div>
              <div className="space-y-3 text-[13px] text-slate-600 leading-6">
                <p>Une lecture fiable des stocks disponibles et des besoins de réapprovisionnement.</p>
                <p>Une visibilité claire sur les ventes du jour, les paiements reçus et les crédits encore ouverts.</p>
                <p>Une preuve traçable des opérations terrain et des responsabilités de chaque rôle.</p>
              </div>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="surface rounded-2xl p-6 bg-white/94"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.accent}14` }}>
                  <item.icon size={19} style={{ color: item.accent }} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-950 mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>{item.title}</h3>
                <p className="text-[13px] text-slate-600 leading-6">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
