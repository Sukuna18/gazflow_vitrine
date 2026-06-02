import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return <AdminLogin />;
}
