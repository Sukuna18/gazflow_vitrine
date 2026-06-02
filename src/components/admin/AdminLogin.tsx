"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validations/login";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) return setError(result.error.issues[0].message);
    setSending(true);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data) });
    setSending(false);
    if (!response.ok) return setError("Email ou mot de passe incorrect.");
    router.push("/admin");
    router.refresh();
  }

  return <main className="admin-login"><form onSubmit={submit} className="login-card"><Link href="/" className="brand"><BrandLogo /></Link><div className="login-icon"><LockKeyhole /></div><p>Administration Top Energies</p><h1>Pilotez vos commandes.</h1><Label>Email<Input type="email" autoFocus required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@topenergies.sn" /></Label><Label>Mot de passe<Input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Votre mot de passe" /></Label>{error ? <small>{error}</small> : null}<Button className="primary-button wide" disabled={sending}>{sending ? "Connexion..." : "Se connecter"}</Button><Link className="back-link" href="/">Retour a la boutique</Link></form></main>;
}
