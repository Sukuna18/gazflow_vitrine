"use client";

import { useRef, useState } from "react";
import { Edit2, GripVertical, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useFetchOne, useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";

type Partner = {
  id: number;
  name: string;
  type: string;
  image: string;
  href: string;
  theme: string;
  active: boolean;
  sortOrder: number;
};

type EditorState = {
  name: string;
  type: string;
  image: string;
  href: string;
  theme: "light" | "dark";
  active: boolean;
  sortOrder: number;
};

const emptyEditor: EditorState = {
  name: "",
  type: "",
  image: "",
  href: "",
  theme: "light",
  active: true,
  sortOrder: 0,
};

export default function AdminPartnersView() {
  const [editor, setEditor] = useState<{ open: boolean; partner: Partner | null }>({ open: false, partner: null });
  const [form, setForm] = useState<EditorState>(emptyEditor);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: partners = [], refetch } = useFetchOne<Partner[]>("partners", "/api/admin/partners");

  const createMutation = useMutationApi<Partner, EditorState>("/api/admin/partners", "POST", {
    onSuccess: () => { toastMessage("Partenaire ajoute.", "success"); setEditor({ open: false, partner: null }); refetch(); },
  });

  const updateMutation = useMutationApi<Partner, { id: number } & Partial<EditorState>>(
    (v) => `/api/admin/partners/${v.id}`, "PATCH",
    { onSuccess: () => { toastMessage("Partenaire mis a jour.", "success"); setEditor({ open: false, partner: null }); refetch(); } },
  );

  const deleteMutation = useMutationApi<{ ok: boolean }, number>(
    (id) => `/api/admin/partners/${id}`, "DELETE",
    { onSuccess: () => { toastMessage("Partenaire supprime.", "success"); setDeleteConfirm(null); refetch(); } },
  );

  function openCreate() {
    setForm({ ...emptyEditor, sortOrder: partners.length });
    setEditor({ open: true, partner: null });
  }

  function openEdit(partner: Partner) {
    setForm({
      name: partner.name,
      type: partner.type,
      image: partner.image,
      href: partner.href,
      theme: partner.theme as "light" | "dark",
      active: partner.active,
      sortOrder: partner.sortOrder,
    });
    setEditor({ open: true, partner });
  }

  async function uploadLogo(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/uploads/partners", { method: "POST", body: fd });
      const data = await res.json() as { path?: string; error?: string };
      if (!res.ok || !data.path) throw new Error(data.error ?? "Upload echoue");
      setForm((f) => ({ ...f, image: data.path! }));
    } catch { toastMessage("Erreur lors de l'upload du logo.", "error"); }
    finally { setUploading(false); }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.type || !form.image) {
      toastMessage("Remplissez tous les champs obligatoires.", "error");
      return;
    }
    if (editor.partner) updateMutation.mutate({ id: editor.partner.id, ...form });
    else createMutation.mutate(form);
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="admin-main">
      <header>
        <div>
          <p>Espace administrateur</p>
          <h1>Partenaires</h1>
        </div>
        <a href="/" target="_blank">Voir la boutique</a>
      </header>

      <section className="admin-panel">
        <div className="panel-title">
          <div>
            <p>Gestion du contenu</p>
            <h2>Logos partenaires affiches sur le site</h2>
          </div>
          <Button onClick={openCreate}><Plus /> Nouveau partenaire</Button>
        </div>

        {partners.length === 0 ? (
          <p className="admin-empty">Aucun partenaire. Ajoutez votre premier logo.</p>
        ) : (
          <div className="partners-admin-grid">
            {partners.map((partner) => (
              <div key={partner.id} className="partners-admin-card">
                <div className={`partners-admin-logo-wrap ${partner.theme}`}>
                  <img src={partner.image} alt={partner.name} className="partners-admin-logo" />
                </div>
                <div className="partners-admin-info">
                  <b>{partner.name}</b>
                  <small>{partner.type}</small>
                  <span className={`partners-admin-badge ${partner.active ? "active" : "inactive"}`}>
                    {partner.active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <div className="partners-admin-actions">
                  <span className="partners-admin-order" title="Ordre"><GripVertical size={14} />{partner.sortOrder + 1}</span>
                  <Button variant="outline" size="icon" className="icon-action" onClick={() => openEdit(partner)} title="Modifier"><Edit2 /></Button>
                  <Button variant="outline" size="icon" className="icon-action danger" onClick={() => setDeleteConfirm(partner.id)} title="Supprimer"><Trash2 /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editor.open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setEditor({ open: false, partner: null }); }}
        >
          <div className="relative w-full max-w-[550px] max-h-[94vh] overflow-auto rounded-2xl bg-white p-6">
            <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-3 text-slate-400" onClick={() => setEditor({ open: false, partner: null })}>
              <X />
            </Button>
            <p className="m-0 mb-1 text-[10px] font-black tracking-widest uppercase text-orange-600">Gestion des partenaires</p>
            <h2 className="mt-0 mb-4 text-xl font-bold text-slate-700">{editor.partner ? "Modifier le partenaire" : "Nouveau partenaire"}</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nom *</span>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="ex: TotalEnergies" required className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Type *</span>
                  <input type="text" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="ex: Energie" required className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400" />
                </label>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Logo *</span>
                <div className="flex items-center gap-3">
                  {form.image && (
                    <div className={`partners-admin-logo-wrap ${form.theme}`} style={{ width: 90, height: 52, flexShrink: 0 }}>
                      <img src={form.image} alt="" className="partners-admin-logo" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-1.5">
                    <input type="text" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="URL ou uploader" required className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400" />
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
                    <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      <Upload size={13} /> {uploading ? "Upload..." : "Uploader"}
                    </Button>
                  </div>
                </div>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Lien (URL)</span>
                <input type="url" value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))} placeholder="https://exemple.com" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400" />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Theme du logo</span>
                  <Select value={form.theme} onValueChange={(v) => setForm((f) => ({ ...f, theme: v as "light" | "dark" }))}>
                    <SelectTrigger className="!h-auto w-full bg-slate-50 px-3 py-2">
                      <SelectValue>{(value) => (value === "dark" ? "Sombre (fond fonce)" : "Clair (fond blanc)")}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair (fond blanc)</SelectItem>
                      <SelectItem value="dark">Sombre (fond fonce)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Ordre d&apos;affichage</span>
                  <input type="number" min={0} value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400" />
                </label>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="h-4 w-4" />
                Actif — {form.active ? "Visible sur le site" : "Masque"}
              </label>

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" onClick={() => setEditor({ open: false, partner: null })}>Annuler</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Enregistrement..." : (editor.partner ? "Mettre a jour" : "Ajouter")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce partenaire ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteConfirm!)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
