"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BarChart3, Box, LayoutDashboard, LogOut, PackageCheck, RefreshCw, ShoppingBag, Truck } from "lucide-react";
import { money } from "@/lib/format";
import BrandLogo from "@/components/BrandLogo";

type Product = { id: number; name: string; category: string; price: number; stock: number; active: boolean; featured: boolean; image: string };
type Status = "NEW" | "CONFIRMED" | "PREPARING" | "DELIVERING" | "DELIVERED" | "CANCELLED";
type Order = { id: number; reference: string; customerName: string; phone: string; address: string; notes: string | null; status: Status; total: number; createdAt: Date | string; zone: { name: string }; items: { id: number; quantity: number; unitPrice: number; product: { name: string } }[] };
const labels: Record<Status, string> = { NEW: "Nouvelle", CONFIRMED: "Confirmee", PREPARING: "Preparation", DELIVERING: "En livraison", DELIVERED: "Livree", CANCELLED: "Annulee" };
const statuses = Object.keys(labels) as Status[];

export default function AdminDashboard({ initialProducts, initialOrders }: { initialProducts: Product[]; initialOrders: Order[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [tab, setTab] = useState<"dashboard" | "orders" | "products">("dashboard");
  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState("");

  const stats = useMemo(() => ({
    orders: orders.length,
    pending: orders.filter((order) => !["DELIVERED", "CANCELLED"].includes(order.status)).length,
    revenue: orders.filter((order) => order.status !== "CANCELLED").reduce((sum, order) => sum + order.total, 0),
    low: products.filter((product) => product.stock < 10).length,
  }), [orders, products]);

  async function productPatch(id: number, data: Partial<Product>) {
    setBusy(`p-${id}`);
    const response = await fetch(`/api/admin/products/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const updated = await response.json();
    setBusy("");
    if (response.ok) setProducts((current) => current.map((product) => product.id === id ? { ...product, ...updated } : product));
  }
  async function orderPatch(id: number, status: Status) {
    setBusy(`o-${id}`);
    const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const updated = await response.json();
    setBusy("");
    if (response.ok) {
      setOrders((current) => current.map((order) => order.id === id ? { ...order, status: updated.status } : order));
      setSelected((current) => current?.id === id ? { ...current, status: updated.status } : current);
    }
  }

  return <main className="admin-shell">
    <aside className="admin-side"><Link href="/" className="brand"><BrandLogo compact /></Link><nav><button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}><LayoutDashboard /> Vue generale</button><button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}><ShoppingBag /> Commandes</button><button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}><Box /> Produits</button></nav><form action="/api/auth/logout" method="post"><button><LogOut /> Deconnexion</button></form></aside>
    <section className="admin-main"><header><div><p>Espace administrateur</p><h1>{tab === "dashboard" ? "Vue generale" : tab === "orders" ? "Commandes" : "Catalogue"}</h1></div><a href="/" target="_blank">Voir la boutique</a></header>
      {tab === "dashboard" ? <><div className="stat-grid"><Stat icon={ShoppingBag} label="Commandes" value={String(stats.orders)} /><Stat icon={Truck} label="A traiter" value={String(stats.pending)} /><Stat icon={BarChart3} label="CA commandes" value={money(stats.revenue)} /><Stat icon={PackageCheck} label="Stocks faibles" value={String(stats.low)} /></div><section className="admin-panel"><div className="panel-title"><div><p>Activite recente</p><h2>Dernieres commandes</h2></div><button onClick={() => setTab("orders")}>Tout afficher</button></div><Orders orders={orders.slice(0, 8)} setSelected={setSelected} busy={busy} patch={orderPatch} /></section></> : null}
      {tab === "orders" ? <section className="admin-panel"><div className="panel-title"><div><p>Suivi logistique</p><h2>Toutes les commandes</h2></div><span>{orders.length} commandes</span></div><Orders orders={orders} setSelected={setSelected} busy={busy} patch={orderPatch} /></section> : null}
      {tab === "products" ? <section className="admin-panel"><div className="panel-title"><div><p>Gestion du stock</p><h2>Produits et disponibilite</h2></div><span>{products.length} produits</span></div><div className="product-admin-list">{products.map((product) => <div className="product-admin" key={product.id}><div className="admin-product-image"><Image src={product.image} alt="" fill className="object-contain" sizes="60px" /></div><div><b>{product.name}</b><small>{product.category} · {money(product.price)}</small></div><label>Stock<input type="number" min="0" value={product.stock} onChange={(event) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, stock: Number(event.target.value) } : item))} onBlur={(event) => productPatch(product.id, { stock: Number(event.target.value) })} /></label><label className="switch-label"><input type="checkbox" checked={product.featured} onChange={(event) => productPatch(product.id, { featured: event.target.checked })} /> Populaire</label><label className="switch-label"><input type="checkbox" checked={product.active} onChange={(event) => productPatch(product.id, { active: event.target.checked })} /> Visible</label>{busy === `p-${product.id}` ? <RefreshCw className="spin" size={16} /> : null}</div>)}</div></section> : null}
    </section>
    {selected ? <div className="admin-order-modal"><div><button onClick={() => setSelected(null)}>×</button><p>{selected.reference}</p><h2>{selected.customerName}</h2><small>{selected.phone} · {selected.zone.name}</small><address>{selected.address}</address>{selected.notes ? <i>{selected.notes}</i> : null}<div className="modal-order-lines">{selected.items.map((item) => <div key={item.id}><span>{item.quantity} × {item.product.name}</span><b>{money(item.quantity * item.unitPrice)}</b></div>)}</div><strong>{money(selected.total)}</strong></div></div> : null}
  </main>;
}

function Stat({ icon: Icon, label, value }: { icon: typeof ShoppingBag; label: string; value: string }) { return <article className="stat-card"><Icon /><p>{label}</p><b>{value}</b></article>; }
function Orders({ orders, setSelected, busy, patch }: { orders: Order[]; setSelected: (order: Order) => void; busy: string; patch: (id: number, status: Status) => void }) { return <div className="orders-table">{orders.length ? orders.map((order) => <div className="order-row" key={order.id}><button className="order-ref" onClick={() => setSelected(order)}><b>{order.reference}</b><small>{new Date(order.createdAt).toLocaleDateString("fr-FR")} · {order.customerName}</small></button><span>{order.zone.name}</span><b>{money(order.total)}</b><select className={`status ${order.status.toLowerCase()}`} disabled={busy === `o-${order.id}`} value={order.status} onChange={(event) => patch(order.id, event.target.value as Status)}>{statuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}</select></div>) : <p className="admin-empty">Aucune commande pour le moment.</p>}</div>; }
