"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Edit2, Eye, EyeOff, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchOne, useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
};

const CATEGORIES = ["Actualites", "Conseils", "Produits", "Securite", "Autre"];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

type EditorState = {
  title: string; slug: string; excerpt: string; content: string;
  coverImage: string; category: string; published: boolean;
};

const emptyEditor: EditorState = {
  title: "", slug: "", excerpt: "", content: "",
  coverImage: "", category: "Actualites", published: false,
};

export default function AdminBlogView() {
  const [editor, setEditor] = useState<{ open: boolean; post: Post | null }>({ open: false, post: null });
  const [form, setForm] = useState<EditorState>(emptyEditor);
  const [slugTouched, setSlugTouched] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: posts = [], refetch } = useFetchOne<Post[]>("blog-posts", "/api/admin/blog");

  const createMutation = useMutationApi<Post, EditorState>("/api/admin/blog", "POST", {
    onSuccess: () => { toastMessage("Article cree avec succes.", "success"); setEditor({ open: false, post: null }); refetch(); },
  });

  const updateMutation = useMutationApi<Post, { id: number } & Partial<EditorState>>(
    (v) => `/api/admin/blog/${v.id}`, "PATCH",
    { onSuccess: () => { toastMessage("Article mis a jour.", "success"); setEditor({ open: false, post: null }); refetch(); } },
  );

  const deleteMutation = useMutationApi<{ ok: boolean }, number>(
    (id) => `/api/admin/blog/${id}`, "DELETE",
    { onSuccess: () => { toastMessage("Article supprime.", "success"); setDeleteConfirm(null); refetch(); } },
  );

  function openCreate() {
    setForm(emptyEditor);
    setSlugTouched(false);
    setEditor({ open: true, post: null });
  }

  async function openEdit(post: Post) {
    setEditor({ open: true, post });
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: "Chargement...", coverImage: post.coverImage ?? "", category: post.category, published: post.published });
    setSlugTouched(true);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`);
      const full = await res.json() as { content: string };
      setForm((f) => ({ ...f, content: full.content ?? "" }));
    } catch { setForm((f) => ({ ...f, content: "" })); }
  }

  useEffect(() => {
    if (!slugTouched && form.title) setForm((f) => ({ ...f, slug: slugify(f.title) }));
  }, [form.title, slugTouched]);

  async function uploadCover(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/uploads/blog", { method: "POST", body: fd });
      const data = await res.json() as { path?: string; error?: string };
      if (!res.ok || !data.path) throw new Error(data.error ?? "Upload echoue");
      setForm((f) => ({ ...f, coverImage: data.path! }));
    } catch { toastMessage("Erreur lors de l'upload de l'image.", "error"); }
    finally { setUploading(false); }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.slug || !form.excerpt || !form.content) {
      toastMessage("Remplissez tous les champs obligatoires.", "error");
      return;
    }
    if (editor.post) updateMutation.mutate({ id: editor.post.id, ...form });
    else createMutation.mutate(form);
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <section className="admin-main">
      <header>
        <div>
          <p>Espace administrateur</p>
          <h1>Blog</h1>
        </div>
        <a href="/" target="_blank">Voir la boutique</a>
      </header>

      <section className="admin-panel">
        <div className="panel-title">
          <div><p>Gestion du contenu</p><h2>Articles publies en ligne</h2></div>
          <Button onClick={openCreate}><Plus /> Nouvel article</Button>
        </div>

        {posts.length === 0 ? (
          <p className="admin-empty">Aucun article. Publiez votre premier contenu.</p>
        ) : (
          <div className="blog-admin-list">
            <div className="blog-admin-head">
              <span>Article</span>
              <span>Categorie</span>
              <span>Statut</span>
              <span>Date</span>
              <span></span>
            </div>
            {posts.map((post) => (
              <div key={post.id} className="blog-admin-row">
                <div className="blog-admin-row-title">
                  {post.coverImage && <img src={post.coverImage} alt="" className="blog-admin-thumb" />}
                  <div>
                    <b>{post.title}</b>
                    <small>/{post.slug}</small>
                  </div>
                </div>
                <span>{post.category}</span>
                <span className={`blog-admin-badge ${post.published ? "published" : "draft"}`}>
                  {post.published ? <><Eye size={10} /> Publie</> : <><EyeOff size={10} /> Brouillon</>}
                </span>
                <span>{formatDate(post.createdAt)}</span>
                <div className="blog-admin-actions">
                  <Button variant="outline" size="icon" className="icon-action" onClick={() => openEdit(post)} title="Modifier"><Edit2 /></Button>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="icon-action" style={{ display: "grid", placeItems: "center", width: 29, height: 29, border: "1px solid #dce8ed", borderRadius: 8, color: "#176a91", background: "#fff", textDecoration: "none" }} title="Voir"><ChevronRight size={14} /></a>
                  <Button variant="outline" size="icon" className="icon-action danger" onClick={() => setDeleteConfirm(post.id)} title="Supprimer"><Trash2 /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editor.open && (
        <div className="admin-order-modal" onClick={(e) => { if (e.target === e.currentTarget) setEditor({ open: false, post: null }); }}>
          <div className="blog-editor-modal">
            <button className="modal-x" onClick={() => setEditor({ open: false, post: null })}><X /></button>
            <p>Gestion du contenu</p>
            <h2>{editor.post ? "Modifier l'article" : "Nouvel article"}</h2>

            <form onSubmit={handleSubmit} className="blog-editor-form">
              <label>
                <span className="field-lbl">Titre <em>*</em></span>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Titre de l'article" required />
              </label>

              <div className="blog-editor-2col">
                <label>
                  <span className="field-lbl">Slug <em>*</em></span>
                  <input type="text" value={form.slug} onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: slugify(e.target.value) })); }} placeholder="url-de-l-article" required />
                </label>
                <label>
                  <span className="field-lbl">Categorie</span>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
              </div>

              <label>
                <span className="field-lbl">Resume <em>*</em></span>
                <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} placeholder="Breve description (SEO et listes)" rows={2} required />
              </label>

              <label>
                <span className="field-lbl">Image de couverture</span>
                <div className="blog-editor-cover">
                  {form.coverImage && <img src={form.coverImage} alt="cover" className="blog-editor-cover-preview" />}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    <input type="text" value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))} placeholder="URL ou uploader" />
                    <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />
                    <button type="button" className="upload-trigger" style={{ width: "fit-content" }} onClick={() => fileRef.current?.click()} disabled={uploading}>
                      <Upload size={13} /> {uploading ? "Upload..." : "Uploader"}
                    </button>
                  </div>
                </div>
              </label>

              <label>
                <span className="field-lbl">Contenu <em>*</em> <span style={{ color: "#87a0ae", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>— HTML accepte</span></span>
                <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="<p>Contenu de l'article...</p>" rows={10} required />
              </label>

              <label className="blog-editor-toggle-row">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
                Publier — {form.published ? "Visible sur le site" : "Brouillon"}
              </label>

              <div className="product-editor-actions">
                <button type="button" className="product-save-button" style={{ background: "#e4edf5", color: "#4a6275", boxShadow: "none", marginRight: 8 }} onClick={() => setEditor({ open: false, post: null })}>
                  Annuler
                </button>
                <button type="submit" className="product-save-button" disabled={isPending}>
                  {isPending ? "Enregistrement..." : (editor.post ? "Mettre a jour" : "Creer")}
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
            <h2 style={{ margin: "0 0 18px" }}>Supprimer cet article ?</h2>
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
