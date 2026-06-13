import { prisma } from "@/lib/prisma";
import AdminZonesView from "@/components/admin/AdminZonesView";

export const dynamic = "force-dynamic";

export default async function ZonesPage() {
  const zones = await prisma.deliveryZone.findMany({ orderBy: { id: "desc" } });
  return <AdminZonesView zones={zones} />;
}
