"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, PackageCheck, ShoppingBag, Truck } from "lucide-react";

import { money } from "@/lib/format";
import { useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Status = "NEW" | "CONFIRMED" | "PREPARING" | "DELIVERING" | "DELIVERED" | "CANCELLED";
type Order = {
  id: number; reference: string; customerName: string; phone: string;
  address: string; notes: string | null; status: Status; total: number;
  createdAt: Date | string; zone: { name: string };
  items: { id: number; quantity: number; unitPrice: number; product: { name: string } }[];
};
type Product = { id: number; stock: number };

const labels: Record<Status, string> = {
  NEW: "Nouvelle", CONFIRMED: "Confirmee", PREPARING: "Preparation",
  DELIVERING: "En livraison", DELIVERED: "Livree", CANCELLED: "Annulee",
};
const statuses = Object.keys(labels) as Status[];

export default function AdminDashboardView({
  products, orders,
}: {
  products: Product[];
  orders: Order[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Order | null>(null);

  const stats = useMemo(() => ({
    orders: orders.length,
    pending: orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length,
    revenue: orders.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0),
    low: products.filter((p) => p.stock < 10).length,
  }), [orders, products]);

  const orderPatchMutation = useMutationApi<Order, { id: number; status: Status }>(
    ({ id }) => `/api/admin/orders/${id}`,
    "PATCH",
    {
      getData: ({ status }) => ({ status }),
      onSuccess: (order) => {
        setSelected((cur) => cur?.id === order.id ? { ...cur, status: order.status as Status } : cur);
        toastMessage(`Statut: ${labels[order.status as Status]}.`, "success");
        router.refresh();
      },
    },
  );

  return (
    <section className="admin-main">
      <header>
        <div>
          <p>Espace administrateur</p>
          <h1>Vue generale</h1>
        </div>
        <a href="/" target="_blank">Voir la boutique</a>
      </header>

      <div className="stat-grid">
        <Stat icon={ShoppingBag} label="Commandes" value={String(stats.orders)} />
        <Stat icon={Truck} label="A traiter" value={String(stats.pending)} />
        <Stat icon={BarChart3} label="CA commandes" value={money(stats.revenue)} />
        <Stat icon={PackageCheck} label="Stocks faibles" value={String(stats.low)} />
      </div>

      <Panel kicker="Activite recente" title="Dernieres commandes">
        <OrdersTable
          orders={orders.slice(0, 8)}
          setSelected={setSelected}
          busy={orderPatchMutation.isPending}
          patch={(id, status) => orderPatchMutation.mutate({ id, status })}
        />
      </Panel>

      {selected && <OrderDetails selected={selected} close={() => setSelected(null)} />}
    </section>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof ShoppingBag; label: string; value: string }) {
  return (
    <article className="stat-card">
      <Icon />
      <p>{label}</p>
      <b>{value}</b>
    </article>
  );
}

function Panel({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="admin-panel">
      <div className="panel-title">
        <div><p>{kicker}</p><h2>{title}</h2></div>
      </div>
      {children}
    </section>
  );
}

export function OrdersTable({
  orders, setSelected, busy, patch,
}: {
  orders: Order[];
  setSelected: (o: Order) => void;
  busy: boolean;
  patch: (id: number, status: Status) => void;
}) {
  return (
    <div className="orders-table">
      {orders.length ? orders.map((order) => (
        <div className="order-row" key={order.id}>
          <Button variant="ghost" className="order-ref" onClick={() => setSelected(order)}>
            <b>{order.reference}</b>
            <small>{new Date(order.createdAt).toLocaleDateString("fr-FR")} · {order.customerName}</small>
          </Button>
          <span>{order.zone.name}</span>
          <b>{money(order.total)}</b>
          <Select value={order.status} onValueChange={(v) => patch(order.id, v as Status)} disabled={busy}>
            <SelectTrigger className={`status admin-status-trigger ${order.status.toLowerCase()}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="admin-select-content">
              {statuses.map((s) => (
                <SelectItem className="admin-select-item" key={s} value={s}>{labels[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )) : <p className="admin-empty">Aucune commande pour le moment.</p>}
    </div>
  );
}

export function OrderDetails({ selected, close }: { selected: Order; close: () => void }) {
  return (
    <div className="admin-order-modal">
      <div>
        <Button variant="ghost" size="icon" onClick={close}>×</Button>
        <p>{selected.reference}</p>
        <h2>{selected.customerName}</h2>
        <small>{selected.phone} · {selected.zone.name}</small>
        <address>{selected.address}</address>
        {selected.notes && <i>{selected.notes}</i>}
        <div className="modal-order-lines">
          {selected.items.map((item) => (
            <div key={item.id}>
              <span>{item.quantity} × {item.product.name}</span>
              <b>{money(item.quantity * item.unitPrice)}</b>
            </div>
          ))}
        </div>
        <strong>{money(selected.total)}</strong>
      </div>
    </div>
  );
}
