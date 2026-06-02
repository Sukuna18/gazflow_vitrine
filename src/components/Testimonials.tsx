"use client";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Responsable dépôt",
    company: "Camberene Point",
    quote: "Avant, on recoupait stock, ventes et livraisons sur plusieurs supports. Avec Top Energies, on voit les écarts beaucoup plus vite.",
  },
  {
    name: "Superviseur terrain",
    company: "Distribution urbaine",
    quote: "Le suivi des livreurs et des paiements à la livraison évite beaucoup de flou. C'est plus simple à contrôler et à expliquer.",
  },
  {
    name: "Gestionnaire commercial",
    company: "Dépôt multi-utilisateurs",
    quote: "Le gros gain, c'est la lisibilité. Chacun a son rôle, et le tableau de bord nous sert vraiment pour piloter l'activité.",
  },
];

const faqs = [
  ["Le produit est-il adapté à un seul dépôt ?", "Oui. Il fonctionne pour un dépôt unique comme pour une structure avec plusieurs profils et plus de volume."],
  ["Peut-on commencer petit puis étendre l'usage ?", "Oui. Le socle couvre déjà stock, ventes, équipe et reporting. Tu peux démarrer avec le coeur opérationnel."],
  ["Faut-il une équipe technique interne ?", "Non. La plateforme est pensée pour être utilisée par des équipes métier avec un accompagnement au démarrage."],
  ["Est-ce utile si je livre aussi les clients ?", "Oui. Le volet livraison et géolocalisation fait partie des usages les plus différenciants du produit."],
];

export default function Testimonials() {
  return (
    <section className="py-28 px-6 section-fade">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_0.95fr] gap-8 items-start">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="mb-10"
          >
            <p className="text-[12px] font-bold text-blue-600 tracking-[0.15em] uppercase mb-4">Retour terrain</p>
            <h2 className="text-[34px] sm:text-[48px] font-extrabold text-slate-950 tracking-tight leading-[1.05] mb-4" style={{ fontFamily: "var(--font-cabinet)" }}>
              Une vitrine plus crédible avec des <span className="text-fire">arguments d&apos;usage.</span>
            </h2>
            <p className="text-[15px] text-slate-600 leading-7 max-w-xl">
              Au lieu d&apos;un simple discours marketing, la page doit rassurer sur l&apos;usage quotidien: contrôle, fluidité et traçabilité.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.name + item.company}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="surface rounded-2xl p-6 bg-white/94"
              >
                <p className="text-[15px] text-slate-700 leading-7 mb-4">“{item.quote}”</p>
                <div className="text-[13px] font-semibold text-slate-950">{item.name}</div>
                <div className="text-[12px] text-slate-500">{item.company}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="surface rounded-[2rem] p-7 bg-white/94"
        >
          <p className="text-[12px] font-bold text-red-600 tracking-[0.15em] uppercase mb-4">FAQ rapide</p>
          <div className="space-y-5">
            {faqs.map(([q, a]) => (
              <div key={q} className="border-b border-sky-100 pb-5 last:border-b-0 last:pb-0">
                <div className="text-[15px] font-bold text-slate-950 mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>{q}</div>
                <p className="text-[13px] text-slate-600 leading-6">{a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
