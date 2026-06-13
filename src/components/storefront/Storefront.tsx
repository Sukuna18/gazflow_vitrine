"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, CheckCircle2, ChevronDown, Clock3, Home, MapPin, Menu, Minus, PackageCheck, Phone, Plus, Quote, ShieldCheck, ShoppingBag, Star, Trash2, Truck, X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { money } from "@/lib/format";
import { toastMessage } from "@/lib/toast";

type Product = { id: number; name: string; category: string; description: string; price: number; stock: number; weight: string | null; image: string; featured: boolean };
type Zone = { id: number; name: string; fee: number; eta: string };
type Settings = { phoneDisplay: string; phoneHref: string; address: string; heroEyebrow: string; heroTitle: string; heroAccent: string; heroDescription: string; announcementOne: string; announcementTwo: string; announcementThree: string; contactTitle: string; contactDescription: string };
type Cart = Record<number, number>;
const CART_STORAGE_KEY = "top-energies-cart";

export default function Storefront({ products, zones, settings }: { products: Product[]; zones: Zone[]; settings: Settings }) {
  const [cart, setCart] = useState<Cart>({});
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [category, setCategory] = useState("Tous");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ reference: string; total: number } | null>(null);
  const [error, setError] = useState("");
  const [introVisible, setIntroVisible] = useState(true);
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "", zoneId: zones[0]?.id ?? 0 });

  const categories = ["Tous", ...new Set(products.map((product) => product.category))];
  const visibleProducts = category === "Tous" ? products : products.filter((product) => product.category === category);
  const lines = products.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] }));
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
  const zone = zones.find((item) => item.id === form.zoneId);
  const total = subtotal + (zone?.fee ?? 0);

  useEffect(() => {
    if (window.sessionStorage.getItem("top-energies-intro-seen")) {
      setIntroVisible(false);
      return;
    }
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem("top-energies-intro-seen", "true");
      setIntroVisible(false);
    }, 2450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "{}") as Cart;
      const restored = Object.fromEntries(products.flatMap((product) => {
        const amount = Number(stored[product.id]);
        return Number.isInteger(amount) && amount > 0 && product.stock > 0 ? [[product.id, Math.min(amount, product.stock)]] : [];
      }));
      setCart(restored);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setCartReady(true);
    }
  }, [products]);

  useEffect(() => {
    if (cartReady) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, cartReady]);

  function quantity(productId: number, next: number) {
    const product = products.find((item) => item.id === productId);
    const currentAmount = cart[productId] ?? 0;
    setCart((current) => {
      if (next <= 0) {
        const updated = { ...current };
        delete updated[productId];
        return updated;
      }
      return { ...current, [productId]: next };
    });
    if (!product) return;
    if (next <= 0 && currentAmount > 0) {
      toastMessage(`${product.name} a ete retire du panier.`, "success");
    } else if (currentAmount === 0 && next > 0) {
      toastMessage(`${product.name} est dans votre panier.`, "success");
    } else if (currentAmount !== next && next > 0) {
      toastMessage(`${product.name}: ${next} article${next > 1 ? "s" : ""}.`, "success");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, items: lines.map((line) => ({ productId: line.id, quantity: line.quantity })) }) });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message = data?.error ?? "Impossible de valider la commande.";
        setError(message);
        toastMessage(message, "error");
        return;
      }
      setResult(data);
      setCart({});
      toastMessage(`Commande confirmee. Reference ${data.reference}.`, "success");
    } catch {
      const message = "Impossible de joindre le serveur. Reessayez.";
      setError(message);
      toastMessage(message, "error");
    } finally {
      setSending(false);
    }
  }

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <main>
      {introVisible ? <div className="site-intro" aria-label="Chargement Top Energies"><div className="intro-orbit orbit-a" /><div className="intro-orbit orbit-b" /><div className="intro-logo"><BrandLogo /><p>Votre energie, livree simplement.</p><span><i /> Preparation de votre experience <i /></span></div><div className="intro-progress"><b /></div></div> : null}
      <div className="announcement"><span>{settings.announcementOne}</span><span>{settings.announcementTwo}</span><span>{settings.announcementThree}</span></div>
      <header className="nav-shell">
        <a href="#" className="brand"><BrandLogo compact /></a>
        <nav className="desktop-nav"><a href="#catalogue">Nos produits</a><a href="#process">Comment ca marche</a><a href="#zones">Zones de livraison</a><a href="#contact">Contact</a></nav>
        <div className="nav-actions">
          <a className="phone-link" href={`tel:${settings.phoneHref}`}><Phone size={16} /> {settings.phoneDisplay}</a>
          <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>Panier</span>{count > 0 ? <b key={count} className="cart-count">{count}</b> : null}</button>
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu"><Menu size={22} /></button>
        </div>
      </header>
      {mobileMenu ? <nav className="mobile-nav"><a href="#catalogue" onClick={() => setMobileMenu(false)}>Nos produits</a><a href="#process" onClick={() => setMobileMenu(false)}>Comment ca marche</a><a href="#zones" onClick={() => setMobileMenu(false)}>Livraison</a></nav> : null}

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> {settings.heroEyebrow}</p>
          <h1>{settings.heroTitle}<br /><em>{settings.heroAccent}</em></h1>
          <p className="hero-text">{settings.heroDescription}</p>
          <div className="hero-actions"><a className="primary-button" href="#catalogue">Commander maintenant <ArrowRight size={17} /></a><a className="secondary-button" href="#process">Comment ca marche <ChevronDown size={16} /></a></div>
          <div className="hero-trust"><span><ShieldCheck size={17} /> Produits controles</span><span><Clock3 size={17} /> Livraison rapide</span></div>
        </div>
        <HeroProductSwipe products={products} />
      </section>

      <motion.section className="benefit-strip" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .6 }}>
        <div><Truck /><span><b>Livraison rapide</b><small>Partout a Dakar</small></span></div>
        <div><ShieldCheck /><span><b>Securite garantie</b><small>Produits verifies</small></span></div>
        <div><Phone /><span><b>Besoin d&apos;aide ?</b><small>Appelez-nous directement</small></span></div>
        <div><PackageCheck /><span><b>Stock disponible</b><small>Commande confirmee vite</small></span></div>
      </motion.section>

      <motion.section className="section" id="catalogue" initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}>
        <div className="section-heading">
          <div><p className="eyebrow orange">Notre catalogue</p><h2>Choisissez votre <em>energie.</em></h2><p>Des produits fiables pour la maison et les professionnels.</p></div>
          <div className="category-tabs">{categories.map((item) => <button className={item === category ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
        </div>
        <div className="products-grid">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} quantity={cart[product.id] ?? 0} setQuantity={(next) => quantity(product.id, next)} />)}
        </div>
      </motion.section>

      <motion.section className="process-section" id="process" initial={{ opacity: 0, y: 38 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}>
        <div className="section-heading centered"><div><p className="eyebrow orange">Simple et rapide</p><h2>Votre bouteille en <em>3 etapes.</em></h2><p>Commandez sans stress. On s&apos;occupe du reste.</p></div></div>
        <div className="process-grid">
          <ProcessCard number="01" title="Choisissez" text="Selectionnez votre bouteille ou vos accessoires."><ChooseIllustration /></ProcessCard>
          <ProcessCard number="02" title="Commandez" text="Indiquez votre adresse et votre telephone."><OrderIllustration /></ProcessCard>
          <ProcessCard number="03" title="Recevez" text="Nous vous livrons rapidement a domicile."><DeliveryIllustration /></ProcessCard>
        </div>
      </motion.section>

      <motion.section className="zones-section" id="zones" initial={{ opacity: 0, y: 38 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}>
        <div>
          <p className="eyebrow light">Livraison locale</p>
          <h2>On vient jusqu&apos;a <em>vous.</em></h2>
          <p>Notre equipe dessert Dakar et sa banlieue avec un service fiable. Selectionnez votre zone au moment de confirmer la commande.</p>
          <div className="zone-list">{zones.map((item) => <div key={item.id}><MapPin size={17} /><b>{item.name}</b><span>{money(item.fee)}</span><small>{item.eta}</small></div>)}</div>
        </div>
        <div className="zone-image"><Image src="/images/gazflow/depot-fleet-yard.png" alt="Depot et flotte Top Energies" fill sizes="(max-width: 900px) 100vw, 45vw" className="object-cover" /><div><Truck size={23} /><b>Une equipe proche de vous</b><span>Preparation locale et livraison suivie</span></div></div>
      </motion.section>

      <Testimonials />
      <PartnersMarquee />
      <PromoMarquee />

      <section className="cta-section" id="contact"><p className="eyebrow orange">Contact commercial</p><h2>{settings.contactTitle}</h2><p>{settings.contactDescription}</p><div className="commercial-details"><span><MapPin size={16} /> {settings.address}</span><a href={`tel:${settings.phoneHref}`}><Phone size={16} /> {settings.phoneDisplay}</a></div><div><a className="primary-button" href="#catalogue">Voir les produits <ArrowRight size={17} /></a><a className="secondary-button" href={`tel:${settings.phoneHref}`}><Phone size={16} /> Appeler le service commercial</a></div></section>
      <footer><a href="#" className="brand"><BrandLogo /></a><p>Votre energie, livree simplement.</p><small>{settings.address} · {settings.phoneDisplay} · © {year} Top Energies. Tous droits reserves. <a href="/admin">Administration</a></small></footer>

      {cartOpen ? <CartDrawer lines={lines} subtotal={subtotal} close={() => setCartOpen(false)} quantity={quantity} checkout={() => { setCartOpen(false); setCheckout(true); }} /> : null}
      {checkout ? <CheckoutModal form={form} setForm={setForm} zones={zones} total={total} close={() => { setCheckout(false); setResult(null); setError(""); }} submit={submit} sending={sending} error={error} result={result} /> : null}
    </main>
  );
}

const reviews = [
  { name: "Awa Ndiaye", role: "Cliente a Camberene", text: "J'ai commande ma bouteille en quelques minutes. L'equipe m'a rappelee rapidement et la livraison etait simple." },
  { name: "Moussa Diop", role: "Restaurateur", text: "Pour mon activite, la disponibilite compte beaucoup. Je trouve mes bouteilles et mes accessoires au meme endroit." },
  { name: "Fatou Sarr", role: "Cliente reguliere", text: "Le service est clair, la commande facile et je sais tout de suite combien la livraison va couter." },
];

function Testimonials() {
  return <motion.section className="testimonials-section" initial={{ opacity: 0, y: 38 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }}><div className="testimonials-heading"><p className="eyebrow orange">Paroles de clients</p><h2>Ils en parlent <em>mieux que nous.</em></h2><p>Des commandes simples, un service local et une equipe joignable.</p></div><div className="reviews-grid">{reviews.map((review, index) => <motion.article className="review-card" key={review.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .55, delay: index * .1, ease: [0.22, 1, 0.36, 1] }}><Quote className="review-quote" /><div className="review-stars">{Array.from({ length: 5 }, (_, star) => <Star key={star} fill="currentColor" />)}</div><p>{review.text}</p><div><span>{String(index + 1).padStart(2, "0")}</span><div><b>{review.name}</b><small>{review.role}</small></div></div></motion.article>)}</div></motion.section>;
}

const promoItems = ["Livraison rapide a Dakar", "Bouteilles disponibles", "Paiement a la livraison", "Accessoires gaz", "Service local"];
function PromoMarquee() {
  return <section className="promo-marquee" aria-label="Informations commerciales"><div>{[...promoItems, ...promoItems].map((item, index) => <span key={`${item}-${index}`}><i /><b>{item}</b></span>)}</div></section>;
}

const partners = [
  { name: "TotalEnergies", type: "Energie", image: "/images/partners/totalenergies.png", href: "https://totalenergies.com/", theme: "light" },
  { name: "Terrou-Bi", type: "Hotellerie", image: "/images/partners/terrou-bi.svg", href: "https://terroubi.com/fr/", theme: "dark" },
];
function PartnersMarquee() {
  const repeatedPartners = Array.from({ length: 5 }, () => partners).flat();
  return <section className="partners-section"><div className="partners-heading"><p className="eyebrow orange">Ils nous font confiance</p><span>Partenaires & collaborations</span></div><div className="partners-window"><div className="partners-track">{repeatedPartners.map((partner, index) => <a className={`partner-logo ${partner.theme}`} href={partner.href} target="_blank" rel="noreferrer" key={`${partner.name}-${index}`}><Image src={partner.image} alt={`Logo ${partner.name}`} width={190} height={72} sizes="190px" /><small>{partner.type}</small></a>)}</div></div></section>;
}

function ProcessCard({ number, title, text, children }: { number: string; title: string; text: string; children: React.ReactNode }) {
  return <motion.article className="process-card" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: .58, delay: Number(number) * .1, ease: [0.22, 1, 0.36, 1] }}><span>{number}</span><div className="process-illustration">{children}</div><h3>{title}</h3><p>{text}</p></motion.article>;
}

function ChooseIllustration() {
  return <div className="choose-scene"><div className="mini-product"><Image src="/images/topenergies/products/butane-cylinder-classic.png" alt="" fill sizes="130px" className="object-contain" /></div><div className="mini-choice-copy"><i /><i /><b>12 kg</b></div><span><Plus size={16} /></span></div>;
}

function OrderIllustration() {
  return <div className="order-scene"><div className="mini-phone"><div /><i /><i /><i /><span><Check size={13} /></span></div><div className="mini-order-pill"><Phone size={13} /><b>Commande validee</b></div></div>;
}

function DeliveryIllustration() {
  return <div className="delivery-scene"><div className="delivery-sun" /><div className="delivery-road"><i /><i /><i /><i /></div><div className="mini-truck"><Truck size={28} /></div><div className="mini-home"><Home size={28} /><span><CheckCircle2 size={14} /></span></div></div>;
}

function HeroProductSwipe({ products }: { products: Product[] }) {
  const slides = products.filter((product) => product.category === "Bouteilles").slice(0, 4);
  const touchStart = useRef<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  const slide = useCallback((direction: 1 | -1) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    setActive(0);
  }, [products.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(() => slide(1), 3200);
    return () => window.clearInterval(timer);
  }, [paused, slide, slides.length]);

  const product = slides[active];
  if (!product) return null;

  return <div className="hero-visual hero-swipe" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={(event) => { setPaused(true); touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { const start = touchStart.current; const end = event.changedTouches[0].clientX; if (start !== null && Math.abs(start - end) > 42) slide(start > end ? 1 : -1); touchStart.current = null; setPaused(false); }}>
    <div className="hero-blob" />
    <div className="hero-energy energy-a" /><div className="hero-energy energy-b" /><div className="hero-energy energy-c" />
    <div className="hero-circle circle-one" />
    <div className="hero-circle circle-two" />
    <div className="hero-product-frame"><Image key={product.id} className="hero-product" src={product.image} alt={product.name} width={520} height={620} priority={active === 0} /></div>
    <div className="floating-card delivery-card"><span><Truck size={18} /></span><div><b>Livraison express</b><small>Chez vous rapidement</small></div></div>
    <div className="floating-card rating-card"><p>{product.category}</p><b>{product.name}</b><small>{money(product.price)}</small></div>
  </div>;
}

function ProductCard({ product, quantity, setQuantity }: { product: Product; quantity: number; setQuantity: (next: number) => void }) {
  return <motion.article className="product-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}>
    {product.featured ? <span className="product-badge">Populaire</span> : null}
    <div className="product-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" className="object-contain" /></div>
    <p className="product-category">{product.category}</p><h3>{product.name}</h3><p className="product-desc">{product.description}</p>
    <div className="product-bottom"><div><b>{money(product.price)}</b><small>{product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}</small></div>{quantity ? <div className="quantity"><button onClick={() => setQuantity(quantity - 1)}><Minus size={14} /></button><b>{quantity}</b><button disabled={quantity >= product.stock} onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button></div> : <button disabled={!product.stock} className="add-button" onClick={() => setQuantity(1)}><Plus size={17} /></button>}</div>
  </motion.article>;
}

function CartDrawer({ lines, subtotal, close, quantity, checkout }: { lines: (Product & { quantity: number })[]; subtotal: number; close: () => void; quantity: (id: number, next: number) => void; checkout: () => void }) {
  return <div className="overlay"><aside className="cart-drawer"><div className="drawer-title"><div><p>Votre panier</p><h3>{lines.length ? `${lines.length} produit${lines.length > 1 ? "s" : ""}` : "Panier vide"}</h3></div><button onClick={close}><X /></button></div><div className="cart-lines">{lines.length ? lines.map((line) => <div className="cart-line" key={line.id}><div className="mini-image"><Image src={line.image} alt="" fill className="object-contain" sizes="80px" /></div><div><b>{line.name}</b><small>{money(line.price)}</small><div className="quantity small"><button onClick={() => quantity(line.id, line.quantity - 1)}><Minus size={12} /></button><b>{line.quantity}</b><button onClick={() => quantity(line.id, line.quantity + 1)}><Plus size={12} /></button><button className="trash" onClick={() => quantity(line.id, 0)}><Trash2 size={13} /></button></div></div></div>) : <div className="empty-cart"><ShoppingBag size={35} /><p>Votre panier attend sa premiere bouteille.</p><button onClick={close}>Voir le catalogue</button></div>}</div>{lines.length ? <div className="drawer-footer"><div><span>Sous-total</span><b>{money(subtotal)}</b></div><small>Les frais de livraison sont calcules selon votre zone.</small><button className="primary-button wide" onClick={checkout}>Continuer <ArrowRight size={16} /></button></div> : null}</aside></div>;
}

function CheckoutModal({ form, setForm, zones, total, close, submit, sending, error, result }: { form: { customerName: string; phone: string; address: string; notes: string; zoneId: number }; setForm: React.Dispatch<React.SetStateAction<typeof form>>; zones: Zone[]; total: number; close: () => void; submit: (event: React.FormEvent<HTMLFormElement>) => void; sending: boolean; error: string; result: { reference: string; total: number } | null }) {
  return <div className="overlay modal-overlay"><div className="checkout-modal"><button className="modal-close" onClick={close}><X /></button>{result ? <div className="success"><span><Check /></span><p>Commande confirmee</p><h3>Merci pour votre confiance.</h3><small>Reference: <b>{result.reference}</b></small><strong>{money(result.total)}</strong><p>Notre equipe vous appellera pour confirmer la livraison.</p><button className="primary-button wide" onClick={close}>Fermer</button></div> : <><p className="product-category">Derniere etape</p><h3>Informations de livraison</h3><form onSubmit={submit}><label>Nom complet<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Votre nom" /></label><label>Telephone<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+221 77 000 00 00" /></label><label>Adresse<textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Quartier, rue et point de repere" /></label><label>Zone de livraison<select value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: Number(e.target.value) })}>{zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name} - {money(zone.fee)}</option>)}</select></label><label>Note (optionnel)<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Precision utile pour le livreur" /></label>{error ? <p className="form-error">{error}</p> : null}<div className="checkout-total"><span>Total a payer a la livraison</span><b>{money(total)}</b></div><button disabled={sending} className="primary-button wide">{sending ? "Validation..." : "Confirmer ma commande"} <ArrowRight size={16} /></button></form></>}</div></div>;
}
