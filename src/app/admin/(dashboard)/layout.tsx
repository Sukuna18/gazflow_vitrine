import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <main className="admin-shell">
      <AdminSidebar />
      {children}
    </main>
  );
}
