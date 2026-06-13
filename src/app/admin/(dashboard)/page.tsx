import { prisma } from "@/lib/prisma";
import AdminDashboardView from "@/components/admin/AdminDashboardView";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [products, orders] = await Promise.all([
    prisma.product.findMany({ orderBy: { id: "desc" } }),
    prisma.order.findMany({
      include: { zone: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);
  return <AdminDashboardView products={products} orders={orders} />;
}
