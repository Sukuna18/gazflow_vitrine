import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <div className="nf-shell">
      <div className="nf-blob" />
      <div className="nf-ring nf-ring-lg" />
      <div className="nf-ring nf-ring-md" />

      <span className="nf-ghost" aria-hidden="true">404</span>

      <span className="nf-particle nf-p-a" aria-hidden="true" />
      <span className="nf-particle nf-p-b" aria-hidden="true" />
      <span className="nf-particle nf-p-c" aria-hidden="true" />

      <header className="nf-nav">
        <Link href="/" aria-label="Accueil">
          <BrandLogo />
        </Link>
      </header>

      <main className="nf-main">
        <div className="nf-visual">
          <Image
            src="/images/topenergies/hero-bottle-transparent.png"
            alt="Bouteille de gaz perdue"
            width={280}
            height={400}
            className="nf-bottle"
            priority
          />
          <div className="nf-card">
            <span className="nf-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <div>
              <b>Livraison impossible</b>
              <small>Adresse introuvable</small>
            </div>
          </div>
          <div className="nf-badge-status">
            <span />
            <p>En attente d'une adresse valide</p>
          </div>
        </div>

        <div className="nf-copy">
          <p className="eyebrow nf-eyebrow">
            <span />
            Erreur 404
          </p>
          <h1 className="nf-h1">
            Cette page<br />
            <em>s'est perdue</em>
          </h1>
          <p className="nf-desc">
            L'adresse que vous cherchez n'existe pas ou a été déplacée.
            Notre livreur tourne en rond depuis un moment.
          </p>
          <div className="nf-actions">
            <Link href="/" className="primary-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Retour à l'accueil
            </Link>
            <Link href="/#produits" className="secondary-button nf-secondary">
              Voir nos produits
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
