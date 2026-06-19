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
        <div className="admin-order-modal" onClick={(e) => { if (e.target === e.currentTarget) setEditTarget(null); }}>
          <div style={{ position: "relative", width: "min(460px,100%)", borderRadius: 20, padding: 24, background: "#fff" }}>
            <button className="modal-x" onClick={() => setEditTarget(null)}><X /></button>
            <p style={{ margin: "0 0 4px", color: "var(--orange)", fontSize: 11, fontWeight: 900, letterSpacing: ".15em", textTransform: "uppercase" }}>Livraison</p>
            <h2 style={{ margin: "0 0 18px" }}>Modifier la zone</h2>
            <ZoneEditForm
              zone={editTarget}
              saving={zonePatchMutation.isPending}
              onSave={(v) => zonePatchMutation.mutate({ id: editTarget.id, ...v })}
              onCancel={() => setEditTarget(null)}
            />
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="admin-order-modal" onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div style={{ position: "relative", width: "min(360px,100%)", borderRadius: 15, padding: 24, background: "#fff" }}>
            <p style={{ margin: "0 0 6px", color: "var(--orange)", fontSize: 11, fontWeight: 900 }}>Confirmation</p>
            <h2 style={{ margin: "0 0 8px" }}>Supprimer cette zone ?</h2>
            <small style={{ display: "block", marginBottom: 20, color: "#829590" }}><b>{deleteTarget.name}</b> sera definitivement supprimee. Impossible si des commandes y sont rattachees.</small>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="product-save-button" style={{ height: 36, borderRadius: 9, padding: "0 15px", border: 0, background: "#e4edf5", color: "#4a6275", boxShadow: "none" }} onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button className="product-save-button" style={{ height: 36, borderRadius: 9, padding: "0 15px", border: 0 }}
                onClick={() => zoneDeleteMutation.mutate({ id: deleteTarget.id })} disabled={zoneDeleteMutation.isPending}>
                {zoneDeleteMutation.isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
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
      <form onSubmit={form.handleSubmit(onSave)} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
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
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
          <button type="button" className="product-save-button"
            style={{ background: "#e4edf5", color: "#4a6275", boxShadow: "none" }}
            onClick={onCancel}>
            Annuler
          </button>
          <button type="submit" className="product-save-button" disabled={saving}>
            {saving ? "Enregistrement..." : "Mettre a jour"}
          </button>
        </div>
      </form>
    </Form>
  );
}
