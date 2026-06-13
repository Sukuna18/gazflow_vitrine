"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

import { useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";
import { zoneSchema } from "@/lib/validations/zone";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Zone = { id: number; name: string; fee: number; eta: string };
type ZoneFormValues = z.infer<typeof zoneSchema>;

export default function AdminZonesView({ zones }: { zones: Zone[] }) {
  const router = useRouter();

  const zoneCreateMutation = useMutationApi<Zone, ZoneFormValues>(
    "/api/admin/zones", "POST",
    { onSuccess: (z) => { toastMessage(`${z.name} disponible.`, "success"); router.refresh(); } },
  );
  const zonePatchMutation = useMutationApi<Zone, { id: number; data: Partial<Zone> }>(
    ({ id }) => `/api/admin/zones/${id}`, "PATCH",
    { getData: ({ data }) => data, onSuccess: (z) => { toastMessage(`${z.name} mis a jour.`, "success"); router.refresh(); } },
  );
  const zoneDeleteMutation = useMutationApi<Zone, { id: number }>(
    ({ id }) => `/api/admin/zones/${id}`, "DELETE",
    { getData: () => undefined, onSuccess: () => { toastMessage("Zone retiree.", "success"); router.refresh(); } },
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
            <div key={zone.id}>
              <Input defaultValue={zone.name}
                onBlur={(e) => zonePatchMutation.mutate({ id: zone.id, data: { name: e.target.value } })} />
              <Input type="number" defaultValue={zone.fee}
                onBlur={(e) => zonePatchMutation.mutate({ id: zone.id, data: { fee: Number(e.target.value) } })} />
              <Input defaultValue={zone.eta}
                onBlur={(e) => zonePatchMutation.mutate({ id: zone.id, data: { eta: e.target.value } })} />
              <Button variant="outline" size="icon" className="icon-action danger"
                onClick={() => zoneDeleteMutation.mutate({ id: zone.id })}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      </section>
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
            <FormControl><Input placeholder="Nom de zone" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="fee" render={({ field }) => (
          <FormItem className="admin-form-field">
            <FormLabel>Frais FCFA</FormLabel>
            <FormControl>
              <Input type="number" min="0" placeholder="Frais FCFA" value={field.value}
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
