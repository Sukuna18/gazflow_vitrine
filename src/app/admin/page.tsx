import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  const [products, orders, zones, settings, admins] = await Promise.all([
    prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.order.findMany({ include: { zone: true, items: { include: { product: true } } }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.deliveryZone.findMany({ orderBy: { fee: "asc" } }),
    prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.admin.findMany({ select: { id: true, name: true, email: true, active: true, createdAt: true }, orderBy: { createdAt: "asc" } }),
  ]);
  return <AdminDashboard initialProducts={products} initialOrders={orders} initialZones={zones} initialSettings={settings} initialAdmins={admins} currentAdminId={admin.id} />;
}
