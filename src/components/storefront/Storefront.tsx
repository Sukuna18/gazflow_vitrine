"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Clock3, MapPin, Menu, Minus, PackageCheck, Phone, Plus, ShieldCheck, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { money } from "@/lib/format";

type Product = { id: number; name: string; category: string; description: string; price: number; stock: number; weight: string | null; image: string; featured: boolean };
type Zone = { id: number; name: string; fee: number; eta: string };
type Cart = Record<number, number>;

export default function Storefront({ products, zones }: { products: Product[]; zones: Zone[] }) {
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [category, setCategory] = useState("Tous");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ reference: string; total: number } | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", notes: "", zoneId: zones[0]?.id ?? 0 });

  const categories = ["Tous", ...new Set(products.map((product) => product.category))];
  const visibleProducts = category === "Tous" ? products : products.filter((product) => product.category === category);
  const lines = products.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] }));
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
  const zone = zones.find((item) => item.id === form.zoneId);
  const total = subtotal + (zone?.fee ?? 0);

  function quantity(productId: number, next: number) {
    setCart((current) => {
      if (next <= 0) {
        const updated = { ...current };
        delete updated[productId];
        return updated;
      }
      return { ...current, [productId]: next };
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, items: lines.map((line) => ({ productId: line.id, quantity: line.quantity })) }) });
    const data = await response.json();
    setSending(false);
    if (!response.ok) return setError(data.error ?? "Impossible de valider la commande.");
    setResult(data);
    setCart({});
  }

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <main>
      <div className="announcement"><span>Livraison express a Dakar</span><span>Support client 7j/7</span><span>Paiement a la livraison</span></div>
      <header className="nav-shell">
        <a href="#" className="brand"><BrandLogo compact /></a>
        <nav className="desktop-nav"><a href="#catalogue">Nos produits</a><a href="#process">Comment ca marche</a><a href="#zones">Zones de livraison</a><a href="#contact">Contact</a></nav>
        <div className="nav-actions">
          <a className="phone-link" href="tel:+221338355409"><Phone size={16} /> 33 835 54 09</a>
          <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>Panier</span>{count > 0 ? <b>{count}</b> : null}</button>
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu"><Menu size={22} /></button>
        </div>
      </header>
      {mobileMenu ? <nav className="mobile-nav"><a href="#catalogue" onClick={() => setMobileMenu(false)}>Nos produits</a><a href="#process" onClick={() => setMobileMenu(false)}>Comment ca marche</a><a href="#zones" onClick={() => setMobileMenu(false)}>Livraison</a></nav> : null}

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Disponible maintenant a Dakar</p>
          <h1>Votre gaz.<br /><em>Sans attendre.</em></h1>
          <p className="hero-text">Bouteilles de gaz, kits et accessoires livres chez vous en toute securite. Une commande simple, un service local, une livraison rapide.</p>
          <div className="hero-actions"><a className="primary-button" href="#catalogue">Commander maintenant <ArrowRight size={17} /></a><a className="secondary-button" href="#process">Comment ca marche <ChevronDown size={16} /></a></div>
          <div className="hero-trust"><span><ShieldCheck size={17} /> Produits controles</span><span><Clock3 size={17} /> Livraison rapide</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob" />
          <div className="hero-circle circle-one" />
          <div className="hero-circle circle-two" />
          <Image className="hero-bottle" src="/images/topenergies/hero-bottle-transparent.png" alt="Bouteille de gaz Top Energies" width={450} height={620} priority />
          <div className="floating-card delivery-card"><span><Truck size={18} /></span><div><b>Livraison express</b><small>Chez vous rapidement</small></div></div>
          <div className="floating-card rating-card"><div className="stars">★★★★★</div><b>4.9 / 5</b><small>Clients satisfaits</small></div>
        </div>
      </section>

      <section className="benefit-strip">
        <div><Truck /><span><b>Livraison rapide</b><small>Partout a Dakar</small></span></div>
        <div><ShieldCheck /><span><b>Securite garantie</b><small>Produits verifies</small></span></div>
        <div><Phone /><span><b>Besoin d&apos;aide ?</b><small>Appelez-nous directement</small></span></div>
        <div><PackageCheck /><span><b>Stock disponible</b><small>Commande confirmee vite</small></span></div>
      </section>

      <section className="section" id="catalogue">
        <div className="section-heading">
          <div><p className="eyebrow orange">Notre catalogue</p><h2>Choisissez votre <em>energie.</em></h2><p>Des produits fiables pour la maison et les professionnels.</p></div>
          <div className="category-tabs">{categories.map((item) => <button className={item === category ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
        </div>
        <div className="products-grid">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} quantity={cart[product.id] ?? 0} setQuantity={(next) => quantity(product.id, next)} />)}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="section-heading centered"><div><p className="eyebrow orange">Simple et rapide</p><h2>Votre bouteille en <em>3 etapes.</em></h2><p>Commandez sans stress. On s&apos;occupe du reste.</p></div></div>
        <div className="process-grid">
          {[["01", "Choisissez", "Selectionnez votre bouteille ou vos accessoires.", ShoppingBag], ["02", "Commandez", "Indiquez votre adresse et votre telephone.", Phone], ["03", "Recevez", "Nous vous livrons rapidement a domicile.", Truck]].map(([number, title, text, Icon]) => <article className="process-card" key={number as string}><span>{number as string}</span><div><Icon size={23} /></div><h3>{title as string}</h3><p>{text as string}</p></article>)}
        </div>
      </section>

      <section className="zones-section" id="zones">
        <div>
          <p className="eyebrow light">Livraison locale</p>
          <h2>On vient jusqu&apos;a <em>vous.</em></h2>
          <p>Notre equipe dessert Dakar et sa banlieue avec un service fiable. Selectionnez votre zone au moment de confirmer la commande.</p>
          <div className="zone-list">{zones.map((item) => <div key={item.id}><MapPin size={17} /><b>{item.name}</b><span>{money(item.fee)}</span><small>{item.eta}</small></div>)}</div>
        </div>
        <div className="zone-image"><Image src="/images/gazflow/depot-fleet-yard.png" alt="Depot et flotte Top Energies" fill sizes="(max-width: 900px) 100vw, 45vw" className="object-cover" /><div><Truck size={23} /><b>Une equipe proche de vous</b><span>Preparation locale et livraison suivie</span></div></div>
      </section>

      <section className="cta-section" id="contact"><p className="eyebrow orange">Contact commercial</p><h2>Besoin de gaz <em>maintenant ?</em></h2><p>Commandez directement en ligne ou contactez notre point de vente.</p><div className="commercial-details"><span><MapPin size={16} /> Camberene Rond Point Case Bi</span><a href="tel:+221338355409"><Phone size={16} /> 33 835 54 09</a></div><div><a className="primary-button" href="#catalogue">Voir les produits <ArrowRight size={17} /></a><a className="secondary-button" href="tel:+221338355409"><Phone size={16} /> Appeler le service commercial</a></div></section>
      <footer><a href="#" className="brand"><BrandLogo /></a><p>Votre energie, livree simplement.</p><small>Camberene Rond Point Case Bi · 33 835 54 09 · © {year} Top Energies. Tous droits reserves. <a href="/admin">Administration</a></small></footer>

      {cartOpen ? <CartDrawer lines={lines} subtotal={subtotal} close={() => setCartOpen(false)} quantity={quantity} checkout={() => { setCartOpen(false); setCheckout(true); }} /> : null}
      {checkout ? <CheckoutModal form={form} setForm={setForm} zones={zones} total={total} close={() => { setCheckout(false); setResult(null); setError(""); }} submit={submit} sending={sending} error={error} result={result} /> : null}
    </main>
  );
}

function ProductCard({ product, quantity, setQuantity }: { product: Product; quantity: number; setQuantity: (next: number) => void }) {
  return <article className="product-card">
    {product.featured ? <span className="product-badge">Populaire</span> : null}
    <div className="product-image"><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" className="object-contain" /></div>
    <p className="product-category">{product.category}</p><h3>{product.name}</h3><p className="product-desc">{product.description}</p>
    <div className="product-bottom"><div><b>{money(product.price)}</b><small>{product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock"}</small></div>{quantity ? <div className="quantity"><button onClick={() => setQuantity(quantity - 1)}><Minus size={14} /></button><b>{quantity}</b><button disabled={quantity >= product.stock} onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button></div> : <button disabled={!product.stock} className="add-button" onClick={() => setQuantity(1)}><Plus size={17} /></button>}</div>
  </article>;
}

function CartDrawer({ lines, subtotal, close, quantity, checkout }: { lines: (Product & { quantity: number })[]; subtotal: number; close: () => void; quantity: (id: number, next: number) => void; checkout: () => void }) {
  return <div className="overlay"><aside className="cart-drawer"><div className="drawer-title"><div><p>Votre panier</p><h3>{lines.length ? `${lines.length} produit${lines.length > 1 ? "s" : ""}` : "Panier vide"}</h3></div><button onClick={close}><X /></button></div><div className="cart-lines">{lines.length ? lines.map((line) => <div className="cart-line" key={line.id}><div className="mini-image"><Image src={line.image} alt="" fill className="object-contain" sizes="80px" /></div><div><b>{line.name}</b><small>{money(line.price)}</small><div className="quantity small"><button onClick={() => quantity(line.id, line.quantity - 1)}><Minus size={12} /></button><b>{line.quantity}</b><button onClick={() => quantity(line.id, line.quantity + 1)}><Plus size={12} /></button><button className="trash" onClick={() => quantity(line.id, 0)}><Trash2 size={13} /></button></div></div></div>) : <div className="empty-cart"><ShoppingBag size={35} /><p>Votre panier attend sa premiere bouteille.</p><button onClick={close}>Voir le catalogue</button></div>}</div>{lines.length ? <div className="drawer-footer"><div><span>Sous-total</span><b>{money(subtotal)}</b></div><small>Les frais de livraison sont calcules selon votre zone.</small><button className="primary-button wide" onClick={checkout}>Continuer <ArrowRight size={16} /></button></div> : null}</aside></div>;
}

function CheckoutModal({ form, setForm, zones, total, close, submit, sending, error, result }: { form: { customerName: string; phone: string; address: string; notes: string; zoneId: number }; setForm: React.Dispatch<React.SetStateAction<typeof form>>; zones: Zone[]; total: number; close: () => void; submit: (event: React.FormEvent<HTMLFormElement>) => void; sending: boolean; error: string; result: { reference: string; total: number } | null }) {
  return <div className="overlay modal-overlay"><div className="checkout-modal"><button className="modal-close" onClick={close}><X /></button>{result ? <div className="success"><span><Check /></span><p>Commande confirmee</p><h3>Merci pour votre confiance.</h3><small>Reference: <b>{result.reference}</b></small><strong>{money(result.total)}</strong><p>Notre equipe vous appellera pour confirmer la livraison.</p><button className="primary-button wide" onClick={close}>Fermer</button></div> : <><p className="product-category">Derniere etape</p><h3>Informations de livraison</h3><form onSubmit={submit}><label>Nom complet<input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Votre nom" /></label><label>Telephone<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+221 77 000 00 00" /></label><label>Adresse<textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Quartier, rue et point de repere" /></label><label>Zone de livraison<select value={form.zoneId} onChange={(e) => setForm({ ...form, zoneId: Number(e.target.value) })}>{zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name} - {money(zone.fee)}</option>)}</select></label><label>Note (optionnel)<textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Precision utile pour le livreur" /></label>{error ? <p className="form-error">{error}</p> : null}<div className="checkout-total"><span>Total a payer a la livraison</span><b>{money(total)}</b></div><button disabled={sending} className="primary-button wide">{sending ? "Validation..." : "Confirmer ma commande"} <ArrowRight size={16} /></button></form></>}</div></div>;
}
