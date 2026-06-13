"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Flame, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import BrandLogo from "@/components/BrandLogo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";
import { loginSchema } from "@/lib/validations/login";

type LoginFormValues = z.infer<typeof loginSchema>;
type LoginResponse = { ok: boolean };

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutationApi<LoginResponse, LoginFormValues>(
    "/api/auth/login",
    "POST",
    {
      onSuccess: () => {
        toastMessage(
          "Connexion reussie. Bienvenue dans l'espace administrateur.",
          "success",
        );
        router.push("/admin");
        router.refresh();
      },
      onError: () => {
        form.setError("password", {
          message: "Email ou mot de passe incorrect.",
        });
      },
    },
  );

  return (
    <main className="admin-login">
      <div className="login-left-panel">
        <div className="login-bg-ring ring-1" />
        <div className="login-bg-ring ring-2" />
        <div className="login-bg-ring ring-3" />

        <div className="login-left-header">
          <BrandLogo />
        </div>

        <div className="login-left-content">
          <div className="login-left-badge">
            <ShieldCheck />
            <span>Acces securise</span>
          </div>
          <h2 className="login-left-title">
            Pilotez votre activite en toute serenite.
          </h2>
          <p className="login-left-desc">
            Gerez vos commandes, votre catalogue produit et vos zones de
            livraison depuis un espace centralise.
          </p>
        </div>

        <div className="login-left-footer">
          <b>Top Energies</b>
          <small>Distribution de gaz butane &middot; Dakar, Senegal</small>
        </div>
      </div>

      <div className="login-right-panel">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              loginMutation.mutate(values),
            )}
            className="login-form"
          >
            <div className="login-form-header">
              <div className="login-form-icon">
                <Flame />
              </div>
              <p className="login-eyebrow">Espace administrateur</p>
              <h1 className="login-title">Connexion</h1>
              <p className="login-subtitle">
                Connectez-vous pour acceder au tableau de bord.
              </p>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="login-field">
                  <FormLabel>Adresse email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoFocus
                      placeholder="admin@topenergies.sn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="login-field">
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="login-password-wrap">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        className="login-pw-toggle"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                        aria-label={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="login-submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <span className="login-spinner" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>

            <Link className="login-back" href="/">
              <ArrowLeft />
              Retour a la boutique
            </Link>
          </form>
        </Form>
      </div>
    </main>
  );
}
