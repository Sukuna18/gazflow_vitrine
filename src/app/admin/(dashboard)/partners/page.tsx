import type { Metadata } from "next";
import AdminPartnersView from "@/components/admin/AdminPartnersView";

export const metadata: Metadata = { title: "Partenaires" };

export default function PartnersPage() {
  return <AdminPartnersView />;
}
