"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ImageUp, LoaderCircle, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";

import { money } from "@/lib/format";
import { useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";
import { productSchema } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Product = {
  id: number; slug: string; name: string; category: string; description: string;
  price: number; stock: number; weight: string | null; active: boolean; featured: boolean; image: string;
};
type ProductFormInput = z.input<typeof productSchema>;
type ProductFormValues = z.output<typeof productSchema>;

const emptyProduct = {
  slug: "", name: "", category: "Bouteilles", description: "",
  price: 0, stock: 0, weight: "", image: "", featured: false, active: true,
};

export default function AdminProductsView({ products }: { products: Product[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const productCreateMutation = useMutationApi<Product, ProductFormValues>(
    "/api/admin/products", "POST",
    { onSuccess: () => { setEditing(null); toastMessage("Produit ajoute.", "success"); router.refresh(); } },
  );
  const productPatchMutation = useMutationApi<Product, { id: number; data: Partial<Product> }>(
    ({ id }) => `/api/admin/products/${id}`, "PATCH",
    {
      getData: ({ data }) => data,
      onSuccess: (p) => { toastMessage(`${p.name} mis a jour.`, "success"); router.refresh(); },
    },
  );
  const productDeleteMutation = useMutationApi<{ ok: boolean }, { id: number }>(
    ({ id }) => `/api/admin/products/${id}`, "DELETE",
    {
      getData: () => undefined,
      onSuccess: () => { toastMessage("Produit supprime.", "success"); setDeleteTarget(null); router.refresh(); },
    },
  );

  function productPatch(id: number, data: Partial<Product>) {
    productPatchMutation.mutate({ id, data });
  }

  async function productSave(values: ProductFormValues) {
    if (!editing) return;
    if (editing.id) {
      await productPatchMutation.mutateAsync({ id: editing.id, data: { ...editing, ...values } });
      setEditing(null);
    } else {
      await productCreateMutation.mutateAsync(values);
    }
  }

  const saving = productCreateMutation.isPending || productPatchMutation.isPending;

  return (
    <section className="admin-main">
      <header>
        <div>
          <p>Espace administrateur</p>
          <h1>Catalogue</h1>
        </div>
        <a href="/" target="_blank">Voir la boutique</a>
      </header>

      <section className="admin-panel">
        <div className="panel-title">
          <div><p>Gestion du catalogue</p><h2>Produits affiches en boutique</h2></div>
          <Button onClick={() => setEditing(emptyProduct)}><Plus /> Ajouter</Button>
        </div>
        <div className="product-admin-list">
          {products.map((product) => (
            <div className="product-admin expanded" key={product.id}>
              <div className="admin-product-image">
                <Image src={product.image} alt="" fill className="object-contain" sizes="60px" unoptimized />
              </div>
              <div>
                <b>{product.name}</b>
                <small>{product.category} · {money(product.price)} · {product.active ? "Visible" : "Masque"}</small>
              </div>
              <Label>
                Stock
                <Input
                  key={product.stock}
                  type="number" min="0"
                  defaultValue={product.stock}
                  onBlur={(e) => productPatch(product.id, { stock: Number(e.target.value) })}
                />
              </Label>
              <Label className="switch-label">
                <Checkbox className="admin-checkbox" checked={product.featured}
                  onCheckedChange={(c) => productPatch(product.id, { featured: c === true })} /> Populaire
              </Label>
              <Label className="switch-label">
                <Checkbox className="admin-checkbox" checked={product.active}
                  onCheckedChange={(c) => productPatch(product.id, { active: c === true })} /> Visible
              </Label>
              <Button variant="outline" size="icon" className="icon-action" onClick={() => setEditing(product)}>
                <Pencil />
              </Button>
              <Button variant="outline" size="icon" className="icon-action danger"
                onClick={() => setDeleteTarget(product)}>
                <Trash2 />
              </Button>
              {productPatchMutation.isPending && <RefreshCw className="spin" />}
            </div>
          ))}
        </div>
      </section>

      {editing && (
        <ProductEditor
          product={editing}
          setProduct={setEditing}
          close={() => setEditing(null)}
          submit={productSave}
          saving={saving}
        />
      )}

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              <b>{deleteTarget?.name}</b> sera definitivement supprime. Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && productDeleteMutation.mutate({ id: deleteTarget.id })}
              disabled={productDeleteMutation.isPending}
            >
              {productDeleteMutation.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function productFormDefaults(product: Partial<Product>): ProductFormInput {
  return {
    slug: product.slug ?? "", name: product.name ?? "",
    category: product.category ?? "Bouteilles", description: product.description ?? "",
    price: product.price ?? 0, stock: product.stock ?? 0,
    weight: product.weight ?? "", image: product.image ?? "",
    featured: product.featured ?? false, active: product.active ?? true,
  };
}

function ProductEditor({
  product, setProduct, close, submit, saving,
}: {
  product: Partial<Product>;
  setProduct: (p: Partial<Product>) => void;
  close: () => void;
  submit: (v: ProductFormValues) => void;
  saving: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewImage, setPreviewImage] = useState(product.image ?? "");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const blobUrl = useRef("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: productFormDefaults(product),
  });
  const watchedName = form.watch("name");

  useEffect(() => {
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    blobUrl.current = "";
    setPendingFile(null);
    setPreviewImage(product.image ?? "");
  }, [product.id, product.image]);

  useEffect(() => {
    return () => { if (blobUrl.current) URL.revokeObjectURL(blobUrl.current); };
  }, []);

  function patchProduct<K extends keyof ProductFormInput>(name: K, value: ProductFormInput[K]) {
    setProduct({ ...product, [name]: value });
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    blobUrl.current = URL.createObjectURL(file);
    setPendingFile(file);
    setPreviewImage(blobUrl.current);
    form.setValue("image", "pending", { shouldValidate: true });
    setUploadError("");
    e.target.value = "";
  }

  async function handleSubmit(values: ProductFormValues) {
    let imagePath = values.image;
    if (pendingFile) {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", pendingFile);
        const res = await fetch("/api/admin/uploads/products", { method: "POST", body: fd });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const err = data?.error ?? "Impossible d'envoyer cette image.";
          setUploadError(err); toastMessage(err, "error"); return;
        }
        URL.revokeObjectURL(blobUrl.current); blobUrl.current = "";
        imagePath = data.path; setPreviewImage(data.path); setPendingFile(null);
      } catch {
        const err = "Impossible d'envoyer cette image. Reessayez.";
        setUploadError(err); toastMessage(err, "error"); return;
      } finally { setUploading(false); }
    }
    await submit({ ...values, image: imagePath });
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <Form {...form}>
        <form
          className="relative grid grid-cols-2 gap-3 w-full max-w-[650px] max-h-[94vh] overflow-auto rounded-2xl bg-white p-6"
          onSubmit={form.handleSubmit(handleSubmit, (e) => {
            const msg = Object.values(e)[0]?.message;
            if (msg) toastMessage(String(msg), "error");
          })}
        >
          <Button type="button" variant="ghost" size="icon" className="absolute right-3 top-3 text-slate-400" onClick={close}><X /></Button>
          <p className="col-span-2 m-0 text-[10px] font-black tracking-widest uppercase text-orange-600">
            {product.id ? "Modifier le produit" : "Nouveau produit"}
          </p>
          <h2 className="col-span-2 m-0 mb-1 text-xl font-bold text-slate-700">
            {watchedName || "Produit boutique"}
          </h2>

          {(["name", "slug", "category", "weight"] as const).map((name) => (
            <FormField key={name} control={form.control} name={name} render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>{{ name: "Nom", slug: "Slug unique", category: "Categorie", weight: "Poids" }[name]}</FormLabel>
                <FormControl>
                  <Input value={field.value ?? ""} onChange={(e) => { field.onChange(e); patchProduct(name, e.target.value); }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          ))}

          {(["price", "stock"] as const).map((name) => (
            <FormField key={name} control={form.control} name={name} render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>{{ price: "Prix FCFA", stock: "Stock" }[name]}</FormLabel>
                <FormControl>
                  <Input type="number" min="0" value={field.value}
                    onChange={(e) => { const v = Number(e.target.value); field.onChange(v); patchProduct(name, v); }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          ))}

          <FormField control={form.control} name="image" render={() => (
            <FormItem className="col-span-2 grid grid-cols-[76px_1fr] items-center gap-3 rounded-xl border border-dashed border-sky-200 bg-sky-50/50 p-3">
              <div className="relative grid size-[76px] place-items-center overflow-hidden rounded-lg bg-sky-100">
                {previewImage
                  ? <Image src={previewImage} alt="" fill sizes="76px" className="object-contain" unoptimized />
                  : <ImageUp />}
              </div>
              <div>
                <b className="text-[11px] font-bold">Image du produit</b>
                <small className="my-1 block text-[9px] text-slate-400">JPG, PNG ou WEBP · 5 Mo maximum</small>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} disabled={uploading || saving} className="hidden" />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading || saving}>
                  {uploading ? <LoaderCircle className="spin" /> : <ImageUp />}
                  {uploading ? "Envoi en cours..." : pendingFile ? "Image selectionnee" : product.image ? "Remplacer l'image" : "Choisir une image"}
                </Button>
                {uploadError ? <em>{uploadError}</em> : <FormMessage />}
              </div>
            </FormItem>
          )} />

          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem className="relative col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} onChange={(e) => { field.onChange(e); patchProduct("description", e.target.value); }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="col-span-2 flex gap-3">
            {(["featured", "active"] as const).map((name) => (
              <FormField key={name} control={form.control} name={name} render={({ field }) => (
                <FormItem className="flex items-center gap-2 min-w-[170px] rounded-lg border border-slate-200 px-3 py-2 cursor-pointer">
                  <FormLabel>
                    <FormControl>
                      <Checkbox className="admin-checkbox" checked={field.value}
                        onCheckedChange={(c) => { const v = c === true; field.onChange(v); patchProduct(name, v); }} />
                    </FormControl>
                    <span>
                      <b>{{ featured: "Populaire", active: "Visible" }[name]}</b>
                      <small>{{ featured: "Mettre le produit en avant", active: "Afficher dans la boutique" }[name]}</small>
                    </span>
                  </FormLabel>
                </FormItem>
              )} />
            ))}
          </div>

          <div className="col-span-2 flex justify-end pt-2">
            <Button type="submit" disabled={uploading || saving}>
              {uploading ? "Envoi de l'image..." : saving ? "Enregistrement..." : "Enregistrer le produit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
