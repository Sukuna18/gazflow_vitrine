"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import BrandMark from "./BrandMark";

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "" });

  return (
    <section id="cta" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(50,197,255,0.08), transparent)" }} />
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px shimmer-line" />

      <div className="relative max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <BrandMark iconClassName="h-14 w-14 rounded-[1.4rem]" withText={false} />
          </div>
          <h2 className="text-[36px] sm:text-[52px] font-extrabold text-slate-950 tracking-tight leading-[1.05] mb-4" style={{ fontFamily: "var(--font-cabinet)" }}>
            Prêt à digitaliser
            <br />
            <span className="text-fire">votre dépôt ?</span>
          </h2>
          <p className="text-[15px] text-slate-500 max-w-md mx-auto">Démo gratuite · Onboarding personnalisé · Réponse en moins de 24h.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }}>
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-14">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)", border: "1.5px solid rgba(34,197,94,0.3)" }}>
                <CheckCircle2 size={30} className="text-green-500" />
              </div>
              <h3 className="text-[20px] font-bold text-slate-950" style={{ fontFamily: "var(--font-cabinet)" }}>Merci {form.name} !</h3>
              <p className="text-slate-500 text-center">Notre équipe vous recontacte sous 24h sur <strong className="text-slate-950">{form.email || form.phone}</strong>.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="rounded-2xl border border-sky-100 p-8 bg-white shadow-[0_24px_56px_rgba(22,93,178,0.08)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { k: "name", label: "Votre nom *", ph: "Mamadou Diallo", type: "text", req: true },
                  { k: "company", label: "Dépôt / entreprise *", ph: "Top Energies Camberene", type: "text", req: true },
                  { k: "phone", label: "Téléphone *", ph: "+221 77 000 00 00", type: "tel", req: true },
                  { k: "email", label: "Email (optionnel)", ph: "contact@depot.sn", type: "email", req: false },
                ].map((f) => (
                  <div key={f.k}>
                    <label className="block text-[12px] font-semibold text-slate-500 mb-2">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.ph}
                      required={f.req}
                      value={form[f.k as keyof typeof form]}
                      onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#f8fbff] border border-sky-100 text-slate-950 text-[14px] placeholder:text-slate-400 focus:outline-none transition-colors"
                      onFocus={e => (e.target.style.borderColor = "rgba(50,197,255,0.55)")}
                      onBlur={e => (e.target.style.borderColor = "rgb(224 242 254)")}
                    />
                  </div>
                ))}
              </div>
              <button type="submit" className="group w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-semibold text-[15px] text-white transition-all duration-200" style={{ background: "linear-gradient(135deg, #165db2, #32c5ff 58%, #ff5b2e)", boxShadow: "0 10px 28px rgba(22,93,178,0.18)" }}>
                Demander ma démo gratuite
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-4">Aucun engagement · Gratuit · Réponse sous 24h</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
