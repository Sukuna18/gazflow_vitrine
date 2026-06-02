import { prisma } from "@/lib/prisma";
import Storefront from "@/components/storefront/Storefront";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, zones] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }] }),
    prisma.deliveryZone.findMany({ orderBy: { fee: "asc" } }),
  ]);
  return <Storefront products={products} zones={zones} />;
}
