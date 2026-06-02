"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";

const links = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Comment ça marche", href: "#process" },
  { label: "Rôles", href: "#roles" },
  { label: "Contact", href: "#cta" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(245,249,253,0.86)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(197,218,240,0.9)" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="group">
            <BrandMark subtitle="Camberene Point · Case Bi" />
          </a>

          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="text-[13px] text-slate-500 hover:text-slate-950 transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a
              href="#cta"
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #165db2, #32c5ff 58%, #ff5b2e)", boxShadow: "0 8px 24px rgba(22,93,178,0.18)" }}
            >
              Demander une démo
            </a>
          </div>

          <button className="md:hidden text-slate-500 hover:text-slate-950" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden border-b border-sky-100"
            style={{ background: "rgba(245,249,253,0.96)", backdropFilter: "blur(20px)" }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-[15px] font-medium text-slate-700 hover:text-blue-700 transition-colors">
                  {l.label}
                </a>
              ))}
              <a
                href="#cta"
                onClick={() => setOpen(false)}
                className="mt-2 py-3 text-center text-[14px] font-semibold text-white rounded-xl"
                style={{ background: "linear-gradient(135deg, #165db2, #32c5ff 58%, #ff5b2e)" }}
              >
                Demander une démo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
