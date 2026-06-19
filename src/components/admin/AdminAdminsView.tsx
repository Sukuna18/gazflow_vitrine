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

      {deleteTarget && (
        <div className="admin-order-modal" onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div style={{ position: "relative", width: "min(360px,100%)", borderRadius: 15, padding: 24, background: "#fff" }}>
            <p style={{ margin: "0 0 6px", color: "var(--orange)", fontSize: 11, fontWeight: 900 }}>Confirmation</p>
            <h2 style={{ margin: "0 0 8px" }}>Supprimer ce compte ?</h2>
            <small style={{ display: "block", marginBottom: 20, color: "#829590" }}>Le compte <b>{deleteTarget.email}</b> sera definitivement supprime. Cette action est irreversible.</small>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="modal-btn modal-btn-cancel" onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button className="modal-btn modal-btn-danger"
                onClick={() => adminDeleteMutation.mutate({ id: deleteTarget.id })} disabled={adminDeleteMutation.isPending}>
                {adminDeleteMutation.isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
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
