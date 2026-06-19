"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Box,
  Globe2,
  Handshake,
  LayoutDashboard,
  LogOut,
  MapPinned,
  ShoppingBag,
  Users,
} from "lucide-react";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Vue generale", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/products", label: "Produits", icon: Box },
  { href: "/admin/zones", label: "Zones", icon: MapPinned },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/partners", label: "Partenaires", icon: Handshake },
  { href: "/admin/settings", label: "Site", icon: Globe2 },
  { href: "/admin/admins", label: "Administrateurs", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-side">
      <Link href="/" className="brand">
        <BrandLogo compact />
      </Link>
      <nav>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item${active ? " active" : ""}`}
            >
              <Icon /> <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <form action="/api/auth/logout" method="post">
        <Button type="submit" className="admin-logout">
          <LogOut /> Deconnexion
        </Button>
      </form>
    </aside>
  );
}
