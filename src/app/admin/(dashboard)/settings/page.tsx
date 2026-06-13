import { prisma } from "@/lib/prisma";
import AdminSettingsView from "@/components/admin/AdminSettingsView";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return <AdminSettingsView settings={settings} />;
}
