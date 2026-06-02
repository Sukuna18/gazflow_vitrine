import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [products, orders] = await Promise.all([
    prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.order.findMany({ include: { zone: true, items: { include: { product: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  return <AdminDashboard initialProducts={products} initialOrders={orders} />;
}
