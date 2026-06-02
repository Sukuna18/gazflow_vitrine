"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setSending(false);
    if (!response.ok) return setError("Mot de passe incorrect.");
    router.push("/admin");
    router.refresh();
  }

  return <main className="admin-login"><form onSubmit={submit} className="login-card"><Link href="/" className="brand"><BrandLogo /></Link><div className="login-icon"><LockKeyhole /></div><p>Administration Top Energies</p><h1>Pilotez vos commandes.</h1><label>Mot de passe<input type="password" autoFocus required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Votre mot de passe" /></label>{error ? <small>{error}</small> : null}<button className="primary-button wide" disabled={sending}>{sending ? "Connexion..." : "Se connecter"}</button><Link className="back-link" href="/">Retour a la boutique</Link></form></main>;
}
