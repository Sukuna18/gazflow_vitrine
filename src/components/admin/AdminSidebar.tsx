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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogTrigger render={<Button type="button" className="admin-logout"><LogOut /> Deconnexion</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Se deconnecter ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous serez redirige vers la page de connexion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="product-save-button"
              style={{ height: 36, borderRadius: 9, padding: "0 15px", border: 0, background: "#e4edf5", color: "#4a6275", boxShadow: "none" }}
              onClick={() => setConfirm(false)}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              className="product-save-button"
              style={{ height: 36, borderRadius: 9, padding: "0 15px", border: 0 }}
              onClick={() => {
                const form = document.createElement("form");
                form.method = "post";
                form.action = "/api/auth/logout";
                document.body.appendChild(form);
                form.submit();
              }}
            >
              Se deconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
