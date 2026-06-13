import { prisma } from "@/lib/prisma";
import AdminProductsView from "@/components/admin/AdminProductsView";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { id: "desc" } });
  return <AdminProductsView products={products} />;
}
