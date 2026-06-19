"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";
import { adminSchema } from "@/lib/validations/admin";
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
} from "@/components/ui/alert-dialog";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Admin = { id: number; name: string; email: string; active: boolean; createdAt: Date | string };
type AdminFormValues = z.infer<typeof adminSchema>;

export default function AdminAdminsView({
  admins, currentAdminId,
}: {
  admins: Admin[];
  currentAdminId: number;
}) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);

  const adminCreateMutation = useMutationApi<Admin, AdminFormValues>(
    "/api/admin/admins", "POST",
    { onSuccess: (a) => { toastMessage(`${a.email} peut maintenant se connecter.`, "success"); router.refresh(); } },
  );
  const adminDeleteMutation = useMutationApi<{ id: number }, { id: number }>(
    ({ id }) => `/api/admin/admins/${id}`, "DELETE",
    { getData: () => undefined, onSuccess: () => { toastMessage("Compte supprime.", "success"); setDeleteTarget(null); router.refresh(); } },
  );

  return (
    <section className="admin-main">
      <header>
        <div>
          <p>Espace administrateur</p>
          <h1>Administrateurs</h1>
        </div>
        <a href="/" target="_blank">Voir la boutique</a>
      </header>

      <section className="admin-panel">
        <div className="panel-title">
          <div><p>Acces au tableau de bord</p><h2>Comptes administrateurs</h2></div>
        </div>
        <AdminCreateForm
          saving={adminCreateMutation.isPending}
          onSave={async (v) => { await adminCreateMutation.mutateAsync(v); }}
        />
        <div className="admin-user-list">
          {admins.map((admin) => (
            <div key={admin.id}>
              <div>
                <b>{admin.name}</b>
                <small>{admin.email}{admin.id === currentAdminId ? " · Votre compte" : ""}</small>
              </div>
              <span>{new Date(admin.createdAt).toLocaleDateString("fr-FR")}</span>
              <Button variant="outline" size="icon"
                disabled={admin.id === currentAdminId}
                className="icon-action danger"
                onClick={() => setDeleteTarget(admin)}
                title={admin.id === currentAdminId ? "Vous ne pouvez pas supprimer votre propre compte" : "Supprimer"}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce compte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte <b>{deleteTarget?.email}</b> sera definitivement supprime. Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && adminDeleteMutation.mutate({ id: deleteTarget.id })}
              disabled={adminDeleteMutation.isPending}
            >
              {adminDeleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function AdminCreateForm({ saving, onSave }: { saving: boolean; onSave: (v: AdminFormValues) => Promise<void> }) {
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function submit(v: AdminFormValues) {
    await onSave(v);
    form.reset();
  }

  return (
    <Form {...form}>
      <form className="admin-inline-form admin-user-form" onSubmit={form.handleSubmit(submit)}>
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Nom complet</FormLabel>
            <FormControl><Input placeholder="Nom complet" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" placeholder="email@exemple.sn" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Mot de passe</FormLabel>
            <FormControl><Input type="password" placeholder="8 caracteres min." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={saving}><Plus /> Ajouter</Button>
      </form>
    </Form>
  );
}
