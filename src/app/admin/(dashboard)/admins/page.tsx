import { prisma } from "@/lib/prisma";
import { currentAdmin } from "@/lib/auth";
import AdminAdminsView from "@/components/admin/AdminAdminsView";

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  const [me, admins] = await Promise.all([
    currentAdmin(),
    prisma.admin.findMany({
      select: { id: true, name: true, email: true, active: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return <AdminAdminsView admins={admins} currentAdminId={me!.id} />;
}
