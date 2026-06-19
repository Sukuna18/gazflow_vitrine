"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronRight, Edit2, Eye, EyeOff, Plus, Trash2, Upload, X } from "lucide-react";
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
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  published: boolean;
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
    onSuccess: () => {
      toastMessage("Article cree avec succes.", "success");
      setEditor({ open: false, post: null });
      refetch();
    },
  });

  const updateMutation = useMutationApi<Post, { id: number } & Partial<EditorState>>(
    (v) => `/api/admin/blog/${v.id}`,
    "PATCH",
    {
      onSuccess: () => {
        toastMessage("Article mis a jour.", "success");
        setEditor({ open: false, post: null });
        refetch();
      },
    },
  );

  const deleteMutation = useMutationApi<{ ok: boolean }, number>(
    (id) => `/api/admin/blog/${id}`,
    "DELETE",
    {
      onSuccess: () => {
        toastMessage("Article supprime.", "success");
        setDeleteConfirm(null);
        refetch();
      },
    },
  );

  function openCreate() {
    setForm(emptyEditor);
    setSlugTouched(false);
    setEditor({ open: true, post: null });
  }

  async function openEdit(post: Post) {
    setEditor({ open: true, post });
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: "Chargement...",
      coverImage: post.coverImage ?? "",
      category: post.category,
      published: post.published,
    });
    setSlugTouched(true);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`);
      const full = await res.json() as { content: string };
      setForm((f) => ({ ...f, content: full.content ?? "" }));
    } catch {
      setForm((f) => ({ ...f, content: "" }));
    }
  }

  useEffect(() => {
    if (!slugTouched && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
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
    } catch {
      toastMessage("Erreur lors de l'upload de l'image.", "error");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.slug || !form.excerpt || !form.content) {
      toastMessage("Remplissez tous les champs obligatoires.", "error");
      return;
    }
    if (editor.post) {
      updateMutation.mutate({ id: editor.post.id, ...form });
    } else {
      createMutation.mutate(form);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="admin-blog">
      <div className="admin-blog-header">
        <div className="admin-blog-title">
          <BookOpen size={20} />
          <span>Articles de blog</span>
        </div>
        <button className="admin-blog-new-btn" onClick={openCreate}>
          <Plus size={15} /> Nouvel article
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="admin-blog-empty">
          <BookOpen size={32} />
          <p>Aucun article. Publiez votre premier article de blog.</p>
          <button className="admin-blog-new-btn" onClick={openCreate}>
            <Plus size={14} /> Creer un article
          </button>
        </div>
      ) : (
        <div className="admin-blog-list">
          <div className="admin-blog-list-head">
            <span>Titre</span>
            <span>Categorie</span>
            <span>Statut</span>
            <span>Date</span>
            <span>Actions</span>
          </div>
          {posts.map((post) => (
            <div key={post.id} className="admin-blog-row">
              <div className="admin-blog-row-title">
                {post.coverImage && (
                  <img src={post.coverImage} alt="" className="admin-blog-thumb" />
                )}
                <div>
                  <span className="admin-blog-row-name">{post.title}</span>
                  <span className="admin-blog-row-slug">/{post.slug}</span>
                </div>
              </div>
              <span className="admin-blog-row-cat">{post.category}</span>
              <span className={`admin-blog-status ${post.published ? "published" : "draft"}`}>
                {post.published ? <><Eye size={11} /> Publie</> : <><EyeOff size={11} /> Brouillon</>}
              </span>
              <span className="admin-blog-row-date">{formatDate(post.createdAt)}</span>
              <div className="admin-blog-row-actions">
                <button className="admin-blog-edit-btn" onClick={() => openEdit(post)} title="Modifier">
                  <Edit2 size={14} />
                </button>
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="admin-blog-preview-btn" title="Voir">
                  <ChevronRight size={14} />
                </a>
                <button className="admin-blog-delete-btn" onClick={() => setDeleteConfirm(post.id)} title="Supprimer">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editor.open && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setEditor({ open: false, post: null }); }}>
          <div className="admin-blog-editor">
            <div className="admin-blog-editor-header">
              <h2>{editor.post ? "Modifier l'article" : "Nouvel article"}</h2>
              <button className="modal-close" onClick={() => setEditor({ open: false, post: null })}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-blog-editor-body">
              <div className="admin-blog-editor-row">
                <div className="admin-blog-field full">
                  <label>Titre <span>*</span></label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Titre de l'article"
                    required
                  />
                </div>
              </div>

              <div className="admin-blog-editor-row two-cols">
                <div className="admin-blog-field">
                  <label>Slug <span>*</span></label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: slugify(e.target.value) })); }}
                    placeholder="url-de-l-article"
                    required
                  />
                </div>
                <div className="admin-blog-field">
                  <label>Categorie</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-blog-field full">
                <label>Resume <span>*</span></label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Breve description (affiché dans les listes et pour le SEO)"
                  rows={2}
                  required
                />
              </div>

              <div className="admin-blog-field full">
                <label>Image de couverture</label>
                <div className="admin-blog-cover-row">
                  {form.coverImage && (
                    <img src={form.coverImage} alt="cover" className="admin-blog-cover-preview" />
                  )}
                  <div className="admin-blog-cover-inputs">
                    <input
                      type="text"
                      value={form.coverImage}
                      onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                      placeholder="URL de l'image ou uploader"
                    />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      style={{ display: "none" }}
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); }}
                    />
                    <button type="button" className="admin-blog-upload-btn" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      <Upload size={13} /> {uploading ? "Upload..." : "Uploader"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-blog-field full">
                <label>
                  Contenu <span>*</span>
                  <small className="admin-blog-html-hint"> — HTML basique accepte (&lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt;, etc.)</small>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="<p>Contenu de l'article...</p>"
                  rows={12}
                  required
                />
              </div>

              <div className="admin-blog-published-row">
                <label className="admin-blog-toggle">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  />
                  <span className="admin-blog-toggle-track" />
                  Publier l'article
                </label>
                <small>{form.published ? "Visible sur le site" : "Brouillon — non visible"}</small>
              </div>

              <div className="admin-blog-editor-footer">
                <button type="button" className="admin-blog-cancel-btn" onClick={() => setEditor({ open: false, post: null })}>
                  Annuler
                </button>
                <button type="submit" className="admin-blog-save-btn" disabled={isPending}>
                  {isPending ? "Enregistrement..." : (editor.post ? "Mettre a jour" : "Creer l'article")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="modal-backdrop">
          <div className="admin-confirm-modal">
            <p>Supprimer cet article definitivement ?</p>
            <div className="admin-confirm-actions">
              <button onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button
                className="danger"
                onClick={() => deleteMutation.mutate(deleteConfirm!)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
