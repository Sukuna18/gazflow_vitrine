import { prisma } from "@/lib/prisma";
import AdminOrdersView from "@/components/admin/AdminOrdersView";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { zone: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return <AdminOrdersView orders={orders} />;
}
