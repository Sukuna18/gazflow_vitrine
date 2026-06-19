"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Edit2, MapPin, Plus, Trash2, X } from "lucide-react";

import { useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";
import { zoneSchema } from "@/lib/validations/zone";
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
import { money } from "@/lib/format";

type Zone = { id: number; name: string; fee: number; eta: string };
type ZoneFormValues = z.infer<typeof zoneSchema>;

export default function AdminZonesView({ zones }: { zones: Zone[] }) {
  const router = useRouter();
  const [editTarget, setEditTarget] = useState<Zone | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Zone | null>(null);

  const zoneCreateMutation = useMutationApi<Zone, ZoneFormValues>(
    "/api/admin/zones", "POST",
    { onSuccess: (z) => { toastMessage(`${z.name} ajoutee.`, "success"); router.refresh(); } },
  );
  const zonePatchMutation = useMutationApi<Zone, { id: number } & ZoneFormValues>(
    ({ id }) => `/api/admin/zones/${id}`, "PATCH",
    {
      getData: ({ id: _id, ...data }) => data,
      onSuccess: (z) => { toastMessage(`${z.name} mis a jour.`, "success"); setEditTarget(null); router.refresh(); },
    },
  );
  const zoneDeleteMutation = useMutationApi<Zone, { id: number }>(
    ({ id }) => `/api/admin/zones/${id}`, "DELETE",
    {
      getData: () => undefined,
      onSuccess: () => { toastMessage("Zone supprimee.", "success"); setDeleteTarget(null); router.refresh(); },
    },
  );

  return (
    <section className="admin-main">
      <header>
        <div>
          <p>Espace administrateur</p>
          <h1>Zones de livraison</h1>
        </div>
        <a href="/" target="_blank">Voir la boutique</a>
      </header>

      <section className="admin-panel">
        <div className="panel-title">
          <div><p>Livraison</p><h2>Zones et tarifs</h2></div>
        </div>

        <ZoneCreateForm
          saving={zoneCreateMutation.isPending}
          onSave={async (v) => { await zoneCreateMutation.mutateAsync(v); }}
        />

        <div className="zone-admin-list">
          {zones.map((zone) => (
            <div key={zone.id} className="zone-admin-row">
              <div className="zone-admin-name">
                <MapPin size={13} />
                <b>{zone.name}</b>
              </div>
              <span className="zone-admin-fee">{money(zone.fee)}</span>
              <span className="zone-admin-eta">{zone.eta}</span>
              <div className="zone-admin-actions">
                <Button variant="outline" size="icon" className="icon-action" onClick={() => setEditTarget(zone)} title="Modifier">
                  <Edit2 />
                </Button>
                <Button variant="outline" size="icon" className="icon-action danger" onClick={() => setDeleteTarget(zone)} title="Supprimer">
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {editTarget && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setEditTarget(null); }}
        >
          <div className="relative w-full max-w-[460px] rounded-2xl bg-white p-6">
            <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-3 text-slate-400" onClick={() => setEditTarget(null)}>
              <X />
            </Button>
            <p className="m-0 mb-1 text-[10px] font-black tracking-widest uppercase text-orange-600">Livraison</p>
            <h2 className="mt-0 mb-5 text-xl font-bold text-slate-700">Modifier la zone</h2>
            <ZoneEditForm
              zone={editTarget}
              saving={zonePatchMutation.isPending}
              onSave={(v) => zonePatchMutation.mutate({ id: editTarget.id, ...v })}
              onCancel={() => setEditTarget(null)}
            />
          </div>
        </div>
      )}

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette zone ?</AlertDialogTitle>
            <AlertDialogDescription>
              <b>{deleteTarget?.name}</b> sera definitivement supprimee. Impossible si des commandes y sont rattachees.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && zoneDeleteMutation.mutate({ id: deleteTarget.id })}
              disabled={zoneDeleteMutation.isPending}
            >
              {zoneDeleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function ZoneCreateForm({ saving, onSave }: { saving: boolean; onSave: (v: ZoneFormValues) => Promise<void> }) {
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
    defaultValues: { name: "", fee: 0, eta: "" },
  });

  async function submit(v: ZoneFormValues) {
    await onSave(v);
    form.reset();
  }

  return (
    <Form {...form}>
      <form className="admin-inline-form" onSubmit={form.handleSubmit(submit)}>
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Nom de zone</FormLabel>
            <FormControl><Input placeholder="ex: Dakar centre" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="fee" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Frais FCFA</FormLabel>
            <FormControl>
              <Input type="number" min="0" placeholder="2000" value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="eta" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Delai</FormLabel>
            <FormControl><Input placeholder="30 - 45 min" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={saving}><Plus /> Ajouter</Button>
      </form>
    </Form>
  );
}

function ZoneEditForm({ zone, saving, onSave, onCancel }: {
  zone: Zone; saving: boolean;
  onSave: (v: ZoneFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
    defaultValues: { name: zone.name, fee: zone.fee, eta: zone.eta },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="flex flex-col gap-3">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Nom de zone</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="fee" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Frais FCFA</FormLabel>
            <FormControl>
              <Input type="number" min="0" value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="eta" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Delai estimé</FormLabel>
            <FormControl><Input placeholder="30 - 45 min" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex gap-2 justify-end mt-1">
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Mettre a jour"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
