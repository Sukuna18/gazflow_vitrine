import { prisma } from "@/lib/prisma";
import Storefront from "@/components/storefront/Storefront";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, zones, settings] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }] }),
    prisma.deliveryZone.findMany({ orderBy: { fee: "asc" } }),
    prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
  ]);
  return <Storefront products={products} zones={zones} settings={settings} />;
}
