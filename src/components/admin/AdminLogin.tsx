"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
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
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
          className="login-card"
        >
          <Link href="/" className="brand">
            <BrandLogo />
          </Link>

          <div className="login-icon">
            <LockKeyhole />
          </div>

          <p>Administration Top Energies</p>
          <h1>Pilotez vos commandes.</h1>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Votre mot de passe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="primary-button wide"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </Button>

          <Link className="back-link" href="/">
            Retour a la boutique
          </Link>
        </form>
      </Form>
    </main>
  );
}
