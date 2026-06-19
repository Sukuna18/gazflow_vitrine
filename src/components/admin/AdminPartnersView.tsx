"use client";

import { useRef, useState } from "react";
import { Edit2, GripVertical, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        <div className="admin-order-modal" onClick={(e) => { if (e.target === e.currentTarget) setEditor({ open: false, partner: null }); }}>
          <div className="blog-editor-modal">
            <button className="modal-x" onClick={() => setEditor({ open: false, partner: null })}><X /></button>
            <p>Gestion des partenaires</p>
            <h2>{editor.partner ? "Modifier le partenaire" : "Nouveau partenaire"}</h2>

            <form onSubmit={handleSubmit} className="blog-editor-form">
              <div className="blog-editor-2col">
                <label>
                  <span className="field-lbl">Nom <em>*</em></span>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="ex: TotalEnergies" required />
                </label>
                <label>
                  <span className="field-lbl">Type <em>*</em></span>
                  <input type="text" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} placeholder="ex: Energie" required />
                </label>
              </div>

              <label>
                <span className="field-lbl">Logo <em>*</em></span>
                <div className="blog-editor-cover">
                  {form.image && (
                    <div className={`partners-admin-logo-wrap ${form.theme}`} style={{ width: 90, height: 52, flexShrink: 0 }}>
                      <img src={form.image} alt="" className="partners-admin-logo" />
                    </div>
                  )}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <input type="text" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="URL ou uploader" required />
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
                    <button type="button" className="upload-trigger" style={{ width: "fit-content" }} onClick={() => fileRef.current?.click()} disabled={uploading}>
                      <Upload size={13} /> {uploading ? "Upload..." : "Uploader"}
                    </button>
                  </div>
                </div>
              </label>

              <label>
                <span className="field-lbl">Lien (URL)</span>
                <input type="url" value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))} placeholder="https://exemple.com" />
              </label>

              <div className="blog-editor-2col">
                <label>
                  <span className="field-lbl">Theme du logo</span>
                  <select value={form.theme} onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value as "light" | "dark" }))}>
                    <option value="light">Clair (fond blanc)</option>
                    <option value="dark">Sombre (fond fonce)</option>
                  </select>
                </label>
                <label>
                  <span className="field-lbl">Ordre d'affichage</span>
                  <input type="number" min={0} value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))} />
                </label>
              </div>

              <label className="blog-editor-toggle-row">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
                Actif — {form.active ? "Visible sur le site" : "Masque"}
              </label>

              <div className="product-editor-actions">
                <button type="button" className="product-save-button" style={{ background: "#e4edf5", color: "#4a6275", boxShadow: "none", marginRight: 8 }} onClick={() => setEditor({ open: false, partner: null })}>
                  Annuler
                </button>
                <button type="submit" className="product-save-button" disabled={isPending}>
                  {isPending ? "Enregistrement..." : (editor.partner ? "Mettre a jour" : "Ajouter")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="admin-order-modal">
          <div style={{ position: "relative", width: "min(360px,100%)", borderRadius: 15, padding: 24, background: "#fff" }}>
            <p style={{ margin: "0 0 6px", color: "var(--orange)", fontSize: 11, fontWeight: 900 }}>Confirmation</p>
            <h2 style={{ margin: "0 0 18px" }}>Supprimer ce partenaire ?</h2>
            <small style={{ display: "block", marginBottom: 20, color: "#829590" }}>Cette action est irreversible.</small>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
              <button className="product-save-button" style={{ height: 36, borderRadius: 9, padding: "0 15px", border: 0 }}
                onClick={() => deleteMutation.mutate(deleteConfirm!)} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
