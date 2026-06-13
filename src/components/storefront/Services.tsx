"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Headphones, Settings2, Wrench, X } from "lucide-react";
import { toastMessage } from "@/lib/toast";

type ServiceType = "installation" | "assistance" | "entretien";

const services = [
  {
    type: "installation" as ServiceType,
    icon: Wrench,
    eyebrow: "Sur site",
    title: "Installation de gaz",
    description: "Pose et raccordement de vos équipements gaz par nos techniciens certifiés. Devis gratuit.",
    accent: "orange",
  },
  {
    type: "assistance" as ServiceType,
    icon: Headphones,
    eyebrow: "Urgences & pannes",
    title: "Assistance technique",
    description: "Un technicien disponible pour diagnostiquer et résoudre vos problèmes rapidement.",
    accent: "blue",
  },
  {
    type: "entretien" as ServiceType,
    icon: Settings2,
    eyebrow: "Préventif",
    title: "Entretien & maintenance",
    description: "Révision périodique de vos installations pour garantir sécurité et longévité.",
    accent: "green",
  },
];

export default function ServicesSection() {
  const [open, setOpen] = useState<ServiceType | null>(null);
  const active = services.find((s) => s.type === open) ?? null;

  return (
    <>
      <motion.section
        className="services-section"
        id="prestations"
        initial={{ opacity: 0, y: 38 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-heading centered">
          <div>
            <p className="eyebrow orange">Nos prestations</p>
            <h2>Un accompagnement <em>complet.</em></h2>
            <p>Installation, assistance ou entretien — notre équipe intervient à domicile.</p>
          </div>
        </div>

        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.type}
                className={`service-card service-card--${service.accent}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="service-card-icon">
                  <Icon />
                </div>
                <p className="service-card-eyebrow">{service.eyebrow}</p>
                <h3>{service.title}</h3>
                <p className="service-card-desc">{service.description}</p>
                <button className="service-card-cta" onClick={() => setOpen(service.type)}>
                  Faire une demande <ArrowRight size={14} />
                </button>
              </motion.article>
            );
          })}
        </div>
      </motion.section>

      {open && active && (
        <ServiceModal service={active} close={() => setOpen(null)} />
      )}
    </>
  );
}

function ServiceModal({
  service,
  close,
}: {
  service: (typeof services)[number];
  close: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    const fd = new FormData(event.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: service.type, ...body }),
      });
      if (!res.ok) {
        toastMessage("Impossible d'envoyer la demande. Reessayez.", "error");
        return;
      }
      setDone(true);
    } catch {
      toastMessage("Impossible de joindre le serveur.", "error");
    } finally {
      setSending(false);
    }
  }

  const Icon = service.icon;

  return (
    <div className="overlay modal-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="service-modal">
        <button className="modal-close" onClick={close} aria-label="Fermer">
          <X size={20} />
        </button>

        {done ? (
          <div className="success">
            <span><CheckCircle2 size={26} /></span>
            <p>Demande envoyee</p>
            <h3>Nous vous contactons rapidement.</h3>
            <small>Notre équipe vous rappellera dans les plus brefs délais pour confirmer l&apos;intervention.</small>
            <button className="primary-button wide" onClick={close} style={{ marginTop: 20 }}>
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="service-modal-header">
              <span className={`service-modal-icon service-modal-icon--${service.accent}`}>
                <Icon size={20} />
              </span>
              <p className="product-category">{service.eyebrow}</p>
              <h3>{service.title}</h3>
            </div>

            <form onSubmit={submit}>
              <label>
                Nom complet
                <input name="name" required placeholder="Votre nom" />
              </label>
              <label>
                Téléphone
                <input name="phone" required placeholder="+221 77 000 00 00" />
              </label>

              {service.type === "installation" && (
                <>
                  <label style={{ gridColumn: "span 2" }}>
                    Adresse de l&apos;intervention
                    <input name="address" required placeholder="Quartier, rue, numéro..." />
                  </label>
                  <label>
                    Type de logement
                    <select name="logement" required>
                      <option value="">Choisir...</option>
                      <option value="Résidentiel">Résidentiel</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industriel">Industriel</option>
                    </select>
                  </label>
                  <label>
                    Points d&apos;utilisation
                    <select name="points" required>
                      <option value="">Choisir...</option>
                      <option value="1 point">1 point (cuisinière)</option>
                      <option value="2 points">2 points</option>
                      <option value="3 points">3 points</option>
                      <option value="4 points et plus">4 points et plus</option>
                    </select>
                  </label>
                  <label>
                    Date souhaitée (optionnel)
                    <input name="date" type="date" />
                  </label>
                  <label style={{ gridColumn: "span 2" }}>
                    Remarques (optionnel)
                    <textarea name="message" placeholder="Informations complémentaires utiles..." />
                  </label>
                </>
              )}

              {(service.type === "assistance" || service.type === "entretien") && (
                <label style={{ gridColumn: "span 2" }}>
                  {service.type === "assistance" ? "Description du problème" : "Description de la demande"}
                  <textarea
                    name="description"
                    required
                    placeholder={
                      service.type === "assistance"
                        ? "Décrivez votre problème : fuite, panne, bruit anormal..."
                        : "Décrivez ce qui nécessite un entretien : date dernière révision, équipements concernés..."
                    }
                  />
                </label>
              )}

              <button type="submit" disabled={sending} className="primary-button wide" style={{ gridColumn: "span 2" }}>
                {sending ? "Envoi en cours..." : "Envoyer ma demande"} {!sending && <ArrowRight size={15} />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
