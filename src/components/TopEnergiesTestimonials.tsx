"use client";

import { motion } from "motion/react";

const trustMarks = [
  { mark: "DAKAROIS", label: "Restaurant Le Dakarois", sector: "Restauration" },
  { mark: "BAOBAB", label: "Boulangerie Baobab", sector: "Boulangerie" },
  { mark: "FANN", label: "Résidence Fann", sector: "Résidentiel" },
  { mark: "SANDAGA", label: "Marché Sandaga", sector: "Commerce" },
  { mark: "THIAROYE", label: "Usine Thiaroye", sector: "Usage intensif" },
  { mark: "PRINCIPAL", label: "Hôpital Principal", sector: "Institution" },
];

const metrics = [
  { value: "6 à 35", label: "kg visibles" },
  { value: "1", label: "point de vente clair" },
  { value: "3", label: "familles d’offre" },
];

export default function TopEnergiesTestimonials() {
  return (
    <section className="px-5 py-18 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="topenergies-trust-shell"
        >
          <div className="topenergies-trust-copy">
            <div className="te-section-cap">
              <p className="te-kicker te-kicker-dark">Section 07</p>
              <div className="te-section-line te-section-line-dark" />
            </div>
            <p className="te-kicker te-kicker-dark">Ils nous font confiance</p>
            <h2 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[0.88] tracking-[-0.06em] text-white sm:text-6xl">
              Une preuve sociale plus premium, traitée comme une signature de marque.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
              Les clients servis apparaissent comme une constellation de marques, pendant que la section garde des
              chiffres simples et une ambiance beaucoup plus dense que l’ancien bloc.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="topenergies-trust-metric"
                >
                  <p className="font-display text-4xl font-semibold leading-none tracking-[-0.06em] text-white">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.26em] text-white/46">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="topenergies-trust-grid">
            {trustMarks.map((company, index) => (
              <motion.article
                key={company.mark}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="topenergies-trust-card"
              >
                <p className="topenergies-trust-mark">{company.mark}</p>
                <p className="mt-3 text-sm font-semibold text-white/88">{company.label}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/46">{company.sector}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
