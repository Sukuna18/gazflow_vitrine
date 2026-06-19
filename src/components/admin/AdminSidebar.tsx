"use client";

import { useState } from "react";
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
  const [confirm, setConfirm] = useState(false);

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
      <Button type="button" className="admin-logout" onClick={() => setConfirm(true)}>
        <LogOut /> Deconnexion
      </Button>

      {confirm && (
        <div className="admin-order-modal" onClick={(e) => { if (e.target === e.currentTarget) setConfirm(false); }}>
          <div style={{ position: "relative", width: "min(340px,100%)", borderRadius: 15, padding: 24, background: "#fff" }}>
            <p style={{ margin: "0 0 6px", color: "var(--orange)", fontSize: 11, fontWeight: 900 }}>Confirmation</p>
            <h2 style={{ margin: "0 0 8px" }}>Se deconnecter ?</h2>
            <small style={{ display: "block", marginBottom: 20, color: "#829590" }}>Vous serez redirige vers la page de connexion.</small>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="product-save-button" style={{ height: 36, borderRadius: 9, padding: "0 15px", border: 0, background: "#e4edf5", color: "#4a6275", boxShadow: "none" }} onClick={() => setConfirm(false)}>Annuler</button>
              <form action="/api/auth/logout" method="post" style={{ margin: 0 }}>
                <button type="submit" className="product-save-button" style={{ height: 36, borderRadius: 9, padding: "0 15px", border: 0 }}>
                  Se deconnecter
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
