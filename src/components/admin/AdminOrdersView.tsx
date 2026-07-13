"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastMessage } from "@/lib/toast";
import { useMutationApi } from "@/hooks/useApi";
import { OrdersTable, OrderDetails } from "./AdminDashboardView";

type Status = "NEW" | "CONFIRMED" | "PREPARING" | "DELIVERING" | "DELIVERED" | "CANCELLED";
type Order = {
  id: number; reference: string; customerName: string; phone: string;
  address: string; notes: string | null; status: Status; subtotal: number; deliveryFee: number; total: number;
  createdAt: Date | string; zone: { name: string };
  items: { id: number; quantity: number; unitPrice: number; product: { name: string } }[];
};

const labels: Record<Status, string> = {
  NEW: "Nouvelle", CONFIRMED: "Confirmee", PREPARING: "Preparation",
  DELIVERING: "En livraison", DELIVERED: "Livree", CANCELLED: "Annulee",
};

export default function AdminOrdersView({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Order | null>(null);

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
          <h1>Commandes</h1>
        </div>
        <a href="/" target="_blank">Voir la boutique</a>
      </header>

      <section className="admin-panel">
        <div className="panel-title">
          <div><p>Suivi logistique</p><h2>Toutes les commandes</h2></div>
        </div>
        <OrdersTable
          orders={orders}
          setSelected={setSelected}
          busy={orderPatchMutation.isPending}
          patch={(id, status) => orderPatchMutation.mutate({ id, status })}
        />
      </section>

      {selected && <OrderDetails selected={selected} close={() => setSelected(null)} />}
    </section>
  );
}
