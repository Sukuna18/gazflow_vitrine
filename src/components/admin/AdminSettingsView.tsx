"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";
import { settingsSchema } from "@/lib/validations/settings";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Settings = z.infer<typeof settingsSchema>;

export default function AdminSettingsView({ settings }: { settings: Settings }) {
  const router = useRouter();

  const settingsPatchMutation = useMutationApi<Settings, Settings>(
    "/api/admin/settings", "PATCH",
    { onSuccess: () => { toastMessage("Informations enregistrees.", "success"); router.refresh(); } },
  );

  const form = useForm<Settings>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  useEffect(() => { form.reset(settings); }, [form, settings]);

  async function submit(values: Settings) {
    const updated = await settingsPatchMutation.mutateAsync(values).catch(() => null);
    if (updated) form.reset(updated);
  }

  const fields: { name: keyof Settings; label: string; area?: boolean }[] = [
    { name: "phoneDisplay", label: "Telephone affiche" },
    { name: "phoneHref", label: "Telephone pour les liens" },
    { name: "address", label: "Adresse commerciale", area: true },
    { name: "heroEyebrow", label: "Sur-titre du hero" },
    { name: "heroTitle", label: "Titre du hero" },
    { name: "heroAccent", label: "Accent du hero" },
    { name: "heroDescription", label: "Description du hero", area: true },
    { name: "announcementOne", label: "Annonce 1" },
    { name: "announcementTwo", label: "Annonce 2" },
    { name: "announcementThree", label: "Annonce 3" },
    { name: "contactTitle", label: "Titre contact" },
    { name: "contactDescription", label: "Description contact", area: true },
  ];

  return (
    <section className="admin-main">
      <header>
        <div>
          <p>Espace administrateur</p>
          <h1>Informations du site</h1>
        </div>
        <a href="/" target="_blank">Voir la boutique</a>
      </header>

      <section className="admin-panel">
        <div className="panel-title">
          <div><p>Contenu editable</p><h2>Informations commerciales du site</h2></div>
        </div>
        <Form {...form}>
          <form className="admin-settings-form" onSubmit={form.handleSubmit(submit)}>
            {fields.map(({ name, label, area }) => (
              <FormField key={name} control={form.control} name={name} render={({ field }) => (
                <FormItem className={`admin-form-field${area ? " wide-field" : ""}`}>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    {area
                      ? <Textarea value={field.value ?? ""} onChange={field.onChange} />
                      : <Input value={field.value ?? ""} onChange={field.onChange} />}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ))}
            <Button type="submit" className="admin-primary" disabled={settingsPatchMutation.isPending}>
              Enregistrer les informations
            </Button>
          </form>
        </Form>
      </section>
    </section>
  );
}
