"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useForm,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";
import {
  BarChart3,
  Box,
  Globe2,
  ImageUp,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MapPinned,
  PackageCheck,
  Pencil,
  Plus,
  RefreshCw,
  ShoppingBag,
  Trash2,
  Truck,
  Users,
  X,
} from "lucide-react";
import { money } from "@/lib/format";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutationApi } from "@/hooks/useApi";
import { toastMessage } from "@/lib/toast";
import { adminSchema } from "@/lib/validations/admin";
import { productSchema } from "@/lib/validations/product";
import { settingsSchema } from "@/lib/validations/settings";
import { zoneSchema } from "@/lib/validations/zone";

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  weight: string | null;
  active: boolean;
  featured: boolean;
  image: string;
};
type ProductFormInput = z.input<typeof productSchema>;
type ProductFormValues = z.output<typeof productSchema>;
type ZoneFormValues = z.infer<typeof zoneSchema>;
type SettingsFormValues = z.infer<typeof settingsSchema>;
type AdminFormValues = z.infer<typeof adminSchema>;
type Zone = { id: number; name: string; fee: number; eta: string };
type Settings = {
  phoneDisplay: string;
  phoneHref: string;
  address: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  announcementOne: string;
  announcementTwo: string;
  announcementThree: string;
  contactTitle: string;
  contactDescription: string;
};
type Status =
  | "NEW"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELLED";
type Order = {
  id: number;
  reference: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string | null;
  status: Status;
  total: number;
  createdAt: Date | string;
  zone: { name: string };
  items: {
    id: number;
    quantity: number;
    unitPrice: number;
    product: { name: string };
  }[];
};
type Admin = {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: Date | string;
};
type Tab =
  | "dashboard"
  | "orders"
  | "products"
  | "zones"
  | "settings"
  | "admins";
const labels: Record<Status, string> = {
  NEW: "Nouvelle",
  CONFIRMED: "Confirmee",
  PREPARING: "Preparation",
  DELIVERING: "En livraison",
  DELIVERED: "Livree",
  CANCELLED: "Annulee",
};
const statuses = Object.keys(labels) as Status[];
const emptyProduct = {
  slug: "",
  name: "",
  category: "Bouteilles",
  description: "",
  price: 0,
  stock: 0,
  weight: "",
  image: "",
  featured: false,
  active: true,
};
export default function AdminDashboard({
  initialProducts,
  initialOrders,
  initialZones,
  initialSettings,
  initialAdmins,
  currentAdminId,
}: {
  initialProducts: Product[];
  initialOrders: Order[];
  initialZones: Zone[];
  initialSettings: Settings;
  initialAdmins: Admin[];
  currentAdminId: number;
}) {
  const router = useRouter();
  const products = initialProducts;
  const orders = initialOrders;
  const zones = initialZones;
  const settings = initialSettings;
  const admins = initialAdmins;
  const [tab, setTab] = useState<Tab>("dashboard");
  const [selected, setSelected] = useState<Order | null>(null);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [message, setMessage] = useState("");

  const stats = useMemo(
    () => ({
      orders: orders.length,
      pending: orders.filter(
        (order) => !["DELIVERED", "CANCELLED"].includes(order.status),
      ).length,
      revenue: orders
        .filter((order) => order.status !== "CANCELLED")
        .reduce((sum, order) => sum + order.total, 0),
      low: products.filter((product) => product.stock < 10).length,
    }),
    [orders, products],
  );
  const title = {
    dashboard: "Vue generale",
    orders: "Commandes",
    products: "Catalogue",
    zones: "Zones de livraison",
    settings: "Informations du site",
    admins: "Administrateurs",
  }[tab];
  const productCreateMutation = useMutationApi<Product, ProductFormValues>(
    "/api/admin/products",
    "POST",
    {
      onSuccess: (product) => {
        setMessage("Produit enregistre.");
        setEditing(null);
        toastMessage(`Produit ajoute: ${product.name}`, "success");
        router.refresh();
      },
    },
  );
  const productPatchMutation = useMutationApi<
    Product,
    { id: number; data: Partial<Product> }
  >(({ id }) => `/api/admin/products/${id}`, "PATCH", {
    getData: ({ data }) => data,
    onSuccess: (product) => {
      setMessage("Produit enregistre.");
      toastMessage(
        `Produit mis a jour: ${product.name ?? "Modification enregistree."}`,
        "success",
      );
      router.refresh();
    },
  });
  const productDeleteMutation = useMutationApi<Product, { id: number }>(
    ({ id }) => `/api/admin/products/${id}`,
    "DELETE",
    {
      getData: () => undefined,
      onSuccess: (product) => {
        toastMessage(
          `${product.name} n'est plus visible en boutique.`,
          "success",
        );
        router.refresh();
      },
    },
  );
  const orderPatchMutation = useMutationApi<
    Order,
    { id: number; status: Status }
  >(({ id }) => `/api/admin/orders/${id}`, "PATCH", {
    getData: ({ status }) => ({ status }),
    onSuccess: (order) => {
      setSelected((current) =>
        current?.id === order.id
          ? { ...current, status: order.status as Status }
          : current,
      );
      toastMessage(
        `Commande mise a jour. Statut: ${labels[order.status as Status]}.`,
        "success",
      );
      router.refresh();
    },
  });
  const zoneCreateMutation = useMutationApi<Zone, ZoneFormValues>(
    "/api/admin/zones",
    "POST",
    {
      onSuccess: (zone) => {
        toastMessage(
          `${zone.name} est disponible pour la livraison.`,
          "success",
        );
        router.refresh();
      },
    },
  );
  const zonePatchMutation = useMutationApi<
    Zone,
    { id: number; data: Partial<Zone> }
  >(({ id }) => `/api/admin/zones/${id}`, "PATCH", {
    getData: ({ data }) => data,
    onSuccess: (zone) => {
      toastMessage(`${zone.name} a ete mise a jour.`, "success");
      router.refresh();
    },
  });
  const zoneDeleteMutation = useMutationApi<Zone, { id: number }>(
    ({ id }) => `/api/admin/zones/${id}`,
    "DELETE",
    {
      getData: () => undefined,
      onSuccess: () => {
        toastMessage("La zone de livraison a ete retiree.", "success");
        router.refresh();
      },
    },
  );
  const settingsPatchMutation = useMutationApi<
    SettingsFormValues,
    SettingsFormValues
  >("/api/admin/settings", "PATCH", {
    onSuccess: () => {
      setMessage("Informations du site enregistrees.");
      toastMessage(
        "Les informations commerciales sont enregistrees.",
        "success",
      );
      router.refresh();
    },
  });
  const adminCreateMutation = useMutationApi<Admin, AdminFormValues>(
    "/api/admin/admins",
    "POST",
    {
      onSuccess: (admin) => {
        setMessage("Administrateur ajoute.");
        toastMessage(`${admin.email} peut maintenant se connecter.`, "success");
        router.refresh();
      },
    },
  );
  const adminDeleteMutation = useMutationApi<{ id: number }, { id: number }>(
    ({ id }) => `/api/admin/admins/${id}`,
    "DELETE",
    {
      getData: () => undefined,
      onSuccess: () => {
        setMessage("Administrateur supprime.");
        toastMessage("Le compte n'a plus acces au tableau de bord.", "success");
        router.refresh();
      },
    },
  );
  const productSaving =
    productCreateMutation.isPending || productPatchMutation.isPending;

  function productPatch(id: number, data: Partial<Product>) {
    setMessage("");
    productPatchMutation.mutate({ id, data });
  }
  async function productSave(values: ProductFormValues) {
    if (!editing) return;
    const payload = { ...editing, ...values };
    setMessage("");
    try {
      if (editing.id) {
        await productPatchMutation.mutateAsync({
          id: editing.id,
          data: payload,
        });
        setEditing(null);
        return;
      }
      await productCreateMutation.mutateAsync(values);
    } catch {
      return;
    }
  }
  function productRemove(id: number) {
    productDeleteMutation.mutate({ id });
  }
  function orderPatch(id: number, status: Status) {
    orderPatchMutation.mutate({ id, status });
  }
  async function zoneSave(values: ZoneFormValues) {
    try {
      await zoneCreateMutation.mutateAsync(values);
      return true;
    } catch {
      return false;
    }
  }
  function zonePatch(id: number, data: Partial<Zone>) {
    zonePatchMutation.mutate({ id, data });
  }
  function zoneRemove(id: number) {
    zoneDeleteMutation.mutate({ id });
  }
  async function settingsSave(values: SettingsFormValues) {
    try {
      return await settingsPatchMutation.mutateAsync(values);
    } catch {
      return null;
    }
  }
  async function adminSave(values: AdminFormValues) {
    try {
      await adminCreateMutation.mutateAsync(values);
      return true;
    } catch {
      return false;
    }
  }
  function adminRemove(id: number) {
    adminDeleteMutation.mutate({ id });
  }

  return (
    <main className="admin-shell">
      <aside className="admin-side">
        <Link href="/" className="brand">
          <BrandLogo compact />
        </Link>
        <nav>
          <Nav
            tab={tab}
            target="dashboard"
            setTab={setTab}
            icon={LayoutDashboard}
          >
            Vue generale
          </Nav>
          <Nav tab={tab} target="orders" setTab={setTab} icon={ShoppingBag}>
            Commandes
          </Nav>
          <Nav tab={tab} target="products" setTab={setTab} icon={Box}>
            Produits
          </Nav>
          <Nav tab={tab} target="zones" setTab={setTab} icon={MapPinned}>
            Zones
          </Nav>
          <Nav tab={tab} target="settings" setTab={setTab} icon={Globe2}>
            Site
          </Nav>
          <Nav tab={tab} target="admins" setTab={setTab} icon={Users}>
            Administrateurs
          </Nav>
        </nav>
        <form action="/api/auth/logout" method="post">
          <Button type="submit" className="admin-logout">
            <LogOut /> Deconnexion
          </Button>
        </form>
      </aside>
      <section className="admin-main">
        <header>
          <div>
            <p>Espace administrateur</p>
            <h1>{title}</h1>
          </div>
          <a href="/" target="_blank">
            Voir la boutique
          </a>
        </header>
        {message ? <p className="admin-message">{message}</p> : null}
        {tab === "dashboard" ? (
          <>
            <div className="stat-grid">
              <Stat
                icon={ShoppingBag}
                label="Commandes"
                value={String(stats.orders)}
              />
              <Stat
                icon={Truck}
                label="A traiter"
                value={String(stats.pending)}
              />
              <Stat
                icon={BarChart3}
                label="CA commandes"
                value={money(stats.revenue)}
              />
              <Stat
                icon={PackageCheck}
                label="Stocks faibles"
                value={String(stats.low)}
              />
            </div>
            <Panel kicker="Activite recente" title="Dernieres commandes">
              <Orders
                orders={orders.slice(0, 8)}
                setSelected={setSelected}
                busy={orderPatchMutation.isPending}
                patch={orderPatch}
              />
            </Panel>
          </>
        ) : null}
        {tab === "orders" ? (
          <Panel kicker="Suivi logistique" title="Toutes les commandes">
            <Orders
              orders={orders}
              setSelected={setSelected}
              busy={orderPatchMutation.isPending}
              patch={orderPatch}
            />
          </Panel>
        ) : null}
        {tab === "products" ? (
          <Panel
            kicker="Gestion du catalogue"
            title="Produits affiches en boutique"
            action={
              <Button onClick={() => setEditing(emptyProduct)}>
                <Plus /> Ajouter
              </Button>
            }
          >
            <div className="product-admin-list">
              {products.map((product) => (
                <div className="product-admin expanded" key={product.id}>
                  <div className="admin-product-image">
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="60px"
                    />
                  </div>
                  <div>
                    <b>{product.name}</b>
                    <small>
                      {product.category} · {money(product.price)} ·{" "}
                      {product.active ? "Visible" : "Masque"}
                    </small>
                  </div>
                  <Label>
                    Stock
                    <Input
                      type="number"
                      min="0"
                      defaultValue={product.stock}
                      onBlur={(event) =>
                        productPatch(product.id, {
                          stock: Number(event.target.value),
                        })
                      }
                    />
                  </Label>
                  <Label className="switch-label">
                    <Checkbox
                      className="admin-checkbox"
                      checked={product.featured}
                      onCheckedChange={(checked) =>
                        productPatch(product.id, { featured: checked === true })
                      }
                    />{" "}
                    Populaire
                  </Label>
                  <Label className="switch-label">
                    <Checkbox
                      className="admin-checkbox"
                      checked={product.active}
                      onCheckedChange={(checked) =>
                        productPatch(product.id, { active: checked === true })
                      }
                    />{" "}
                    Visible
                  </Label>
                  <Button
                    variant="outline"
                    size="icon"
                    className="icon-action"
                    onClick={() => setEditing(product)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="icon-action danger"
                    onClick={() => productRemove(product.id)}
                  >
                    <Trash2 />
                  </Button>
                  {productPatchMutation.isPending ? (
                    <RefreshCw className="spin" />
                  ) : null}
                </div>
              ))}
            </div>
          </Panel>
        ) : null}
        {tab === "zones" ? (
          <Panel kicker="Livraison" title="Zones et tarifs">
            <ZoneCreateForm
              saving={zoneCreateMutation.isPending}
              onSave={zoneSave}
            />
            <div className="zone-admin-list">
              {zones.map((zone) => (
                <div key={zone.id}>
                  <Input
                    defaultValue={zone.name}
                    onBlur={(e) => zonePatch(zone.id, { name: e.target.value })}
                  />
                  <Input
                    type="number"
                    defaultValue={zone.fee}
                    onBlur={(e) =>
                      zonePatch(zone.id, { fee: Number(e.target.value) })
                    }
                  />
                  <Input
                    defaultValue={zone.eta}
                    onBlur={(e) => zonePatch(zone.id, { eta: e.target.value })}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="icon-action danger"
                    onClick={() => zoneRemove(zone.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        ) : null}
        {tab === "settings" ? (
          <Panel
            kicker="Contenu editable"
            title="Informations commerciales du site"
          >
            <SettingsEditor
              settings={settings}
              saving={settingsPatchMutation.isPending}
              onSave={settingsSave}
            />
          </Panel>
        ) : null}
        {tab === "admins" ? (
          <Panel
            kicker="Acces au tableau de bord"
            title="Comptes administrateurs"
          >
            <AdminCreateForm
              saving={adminCreateMutation.isPending}
              onSave={adminSave}
            />
            <div className="admin-user-list">
              {admins.map((admin) => (
                <div key={admin.id}>
                  <div>
                    <b>{admin.name}</b>
                    <small>
                      {admin.email}
                      {admin.id === currentAdminId ? " · Votre compte" : ""}
                    </small>
                  </div>
                  <span>
                    {new Date(admin.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={admin.id === currentAdminId}
                    className="icon-action danger"
                    onClick={() => adminRemove(admin.id)}
                    title={
                      admin.id === currentAdminId
                        ? "Vous ne pouvez pas supprimer votre propre compte"
                        : "Supprimer"
                    }
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
          </Panel>
        ) : null}
      </section>
      {editing ? (
        <ProductEditor
          product={editing}
          setProduct={setEditing}
          close={() => setEditing(null)}
          submit={productSave}
          saving={productSaving}
        />
      ) : null}
      {selected ? (
        <OrderDetails selected={selected} close={() => setSelected(null)} />
      ) : null}
    </main>
  );
}

function Nav({
  tab,
  target,
  setTab,
  icon: Icon,
  children,
}: {
  tab: Tab;
  target: Tab;
  setTab: (tab: Tab) => void;
  icon: typeof Box;
  children: React.ReactNode;
}) {
  return (
    <Button
      className={`admin-nav-item${tab === target ? " active" : ""}`}
      onClick={() => setTab(target)}
    >
      <Icon /> <span>{children}</span>
    </Button>
  );
}
function Panel({
  kicker,
  title,
  action,
  children,
}: {
  kicker: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel">
      <div className="panel-title">
        <div>
          <p>{kicker}</p>
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
function notifyInvalid(errors: Record<string, { message?: string }>) {
  const firstError = Object.values(errors)[0]?.message;
  if (firstError) toastMessage(firstError, "error");
}

function FormTextField<TValues extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = "text",
  wide,
  area,
  onValueChange,
}: {
  form: UseFormReturn<TValues>;
  name: FieldPath<TValues>;
  label: string;
  placeholder?: string;
  type?: React.ComponentProps<typeof Input>["type"];
  wide?: boolean;
  area?: boolean;
  onValueChange?: (value: string) => void;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`admin-form-field${wide ? " wide-field" : ""}`}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {area ? (
              <Textarea
                value={field.value ?? ""}
                placeholder={placeholder}
                onChange={(event) => {
                  field.onChange(event);
                  onValueChange?.(event.target.value);
                }}
              />
            ) : (
              <Input
                type={type}
                value={field.value ?? ""}
                placeholder={placeholder}
                onChange={(event) => {
                  field.onChange(event);
                  onValueChange?.(event.target.value);
                }}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ZoneCreateForm({
  saving,
  onSave,
}: {
  saving: boolean;
  onSave: (values: ZoneFormValues) => Promise<boolean>;
}) {
  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: "",
      fee: 0,
      eta: "",
    },
  });

  async function submit(values: ZoneFormValues) {
    const saved = await onSave(values);
    if (saved) form.reset();
  }

  return (
    <Form {...form}>
      <form
        className="admin-inline-form"
        onSubmit={form.handleSubmit(submit, notifyInvalid)}
      >
        <FormTextField
          form={form}
          name="name"
          label="Nom de zone"
          placeholder="Nom de zone"
        />

        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem className="admin-form-field">
              <FormLabel>Frais FCFA</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="Frais FCFA"
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormTextField
          form={form}
          name="eta"
          label="Delai"
          placeholder="Delai: 30 - 45 min"
        />

        <Button type="submit" disabled={saving}>
          <Plus /> Ajouter
        </Button>
      </form>
    </Form>
  );
}

function SettingsEditor({
  settings,
  saving,
  onSave,
}: {
  settings: Settings;
  saving: boolean;
  onSave: (values: SettingsFormValues) => Promise<SettingsFormValues | null>;
}) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });

  useEffect(() => {
    form.reset(settings);
  }, [form, settings]);

  async function submit(values: SettingsFormValues) {
    const updated = await onSave(values);
    if (updated) form.reset(updated);
  }

  return (
    <Form {...form}>
      <form
        className="admin-settings-form"
        onSubmit={form.handleSubmit(submit, notifyInvalid)}
      >
        <FormTextField
          form={form}
          name="phoneDisplay"
          label="Telephone affiche"
        />
        <FormTextField
          form={form}
          name="phoneHref"
          label="Telephone pour les liens"
        />
        <FormTextField
          form={form}
          name="address"
          label="Adresse commerciale"
          wide
        />
        <FormTextField
          form={form}
          name="heroEyebrow"
          label="Sur-titre du hero"
        />
        <FormTextField form={form} name="heroTitle" label="Titre du hero" />
        <FormTextField form={form} name="heroAccent" label="Accent du hero" />
        <FormTextField
          form={form}
          name="heroDescription"
          label="Description du hero"
          wide
          area
        />
        <FormTextField form={form} name="announcementOne" label="Annonce 1" />
        <FormTextField form={form} name="announcementTwo" label="Annonce 2" />
        <FormTextField form={form} name="announcementThree" label="Annonce 3" />
        <FormTextField form={form} name="contactTitle" label="Titre contact" />
        <FormTextField
          form={form}
          name="contactDescription"
          label="Description contact"
          wide
        />

        <Button type="submit" className="admin-primary" disabled={saving}>
          Enregistrer les informations
        </Button>
      </form>
    </Form>
  );
}

function AdminCreateForm({
  saving,
  onSave,
}: {
  saving: boolean;
  onSave: (values: AdminFormValues) => Promise<boolean>;
}) {
  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function submit(values: AdminFormValues) {
    const saved = await onSave(values);
    if (saved) form.reset();
  }

  return (
    <Form {...form}>
      <form
        className="admin-inline-form admin-user-form"
        onSubmit={form.handleSubmit(submit, notifyInvalid)}
      >
        <FormTextField
          form={form}
          name="name"
          label="Nom complet"
          placeholder="Nom complet"
        />
        <FormTextField
          form={form}
          name="email"
          label="Email"
          type="email"
          placeholder="email@exemple.sn"
        />
        <FormTextField
          form={form}
          name="password"
          label="Mot de passe"
          type="password"
          placeholder="Mot de passe (8 caracteres min.)"
        />
        <Button type="submit" disabled={saving}>
          <Plus /> Ajouter
        </Button>
      </form>
    </Form>
  );
}

function productFormDefaults(product: Partial<Product>): ProductFormInput {
  return {
    slug: product.slug ?? "",
    name: product.name ?? "",
    category: product.category ?? "Bouteilles",
    description: product.description ?? "",
    price: product.price ?? 0,
    stock: product.stock ?? 0,
    weight: product.weight ?? "",
    image: product.image ?? "",
    featured: product.featured ?? false,
    active: product.active ?? true,
  };
}

function ProductEditor({
  product,
  setProduct,
  close,
  submit,
  saving,
}: {
  product: Partial<Product>;
  setProduct: (product: Partial<Product>) => void;
  close: () => void;
  submit: (values: ProductFormValues) => void;
  saving: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewImage, setPreviewImage] = useState(product.image ?? "");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const blobUrl = useRef("");
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

  function patchProduct<TName extends keyof ProductFormInput>(
    name: TName,
    value: ProductFormInput[TName],
  ) {
    setProduct({ ...product, [name]: value });
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    blobUrl.current = URL.createObjectURL(file);
    setPendingFile(file);
    setPreviewImage(blobUrl.current);
    form.setValue("image", "pending", { shouldValidate: true });
    setUploadError("");
    event.target.value = "";
  }

  async function handleSubmit(values: ProductFormValues) {
    let imagePath = values.image;
    if (pendingFile) {
      setUploading(true);
      setUploadError("");
      try {
        const formData = new FormData();
        formData.append("file", pendingFile);
        const response = await fetch("/api/admin/uploads/products", { method: "POST", body: formData });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          const error = data?.error ?? "Impossible d'envoyer cette image.";
          setUploadError(error);
          toastMessage(error, "error");
          return;
        }
        URL.revokeObjectURL(blobUrl.current);
        blobUrl.current = "";
        imagePath = data.path;
        setPreviewImage(data.path);
        setPendingFile(null);
      } catch {
        const error = "Impossible d'envoyer cette image. Reessayez.";
        setUploadError(error);
        toastMessage(error, "error");
        return;
      } finally {
        setUploading(false);
      }
    }
    await submit({ ...values, image: imagePath });
  }

  return (
    <div className="admin-order-modal">
      <Form {...form}>
        <form
          className="product-editor"
          onSubmit={form.handleSubmit(handleSubmit, (invalid) => {
            const firstError = Object.values(invalid)[0]?.message;
            if (firstError) toastMessage(String(firstError), "error");
          })}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="modal-x"
            onClick={close}
          >
            <X />
          </Button>

          <p>{product.id ? "Modifier le produit" : "Nouveau produit"}</p>
          <h2>{watchedName || "Produit boutique"}</h2>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="admin-form-field">
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      patchProduct("name", event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="admin-form-field">
                <FormLabel>Slug unique</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      patchProduct("slug", event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="admin-form-field">
                <FormLabel>Categorie</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      patchProduct("category", event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="admin-form-field">
                <FormLabel>Poids</FormLabel>
                <FormControl>
                  <Input
                    value={field.value ?? ""}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                      patchProduct("weight", event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="admin-form-field">
                <FormLabel>Prix FCFA</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    value={field.value}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      field.onChange(value);
                      patchProduct("price", value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="admin-form-field">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    value={field.value}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      field.onChange(value);
                      patchProduct("stock", value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="product-uploader wide-field">
                {previewImage ? (
                  <div className="upload-preview">
                    <Image
                      src={previewImage}
                      alt=""
                      fill
                      sizes="76px"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span className="upload-placeholder">
                    <ImageUp />
                  </span>
                )}

                <div>
                  <b>Image du produit</b>
                  <small>JPG, PNG ou WEBP · 5 Mo maximum</small>
                  <Label className="upload-trigger">
                    {uploading ? (
                      <LoaderCircle className="spin" />
                    ) : (
                      <ImageUp />
                    )}
                    {uploading
                      ? "Envoi en cours..."
                      : pendingFile
                        ? "Image selectionnee"
                        : product.image
                          ? "Remplacer l'image"
                          : "Choisir une image"}
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={onFileChange}
                      disabled={uploading || saving}
                    />
                  </Label>
                  {uploadError ? <em>{uploadError}</em> : <FormMessage />}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="admin-form-field wide-field">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    onChange={(event) => {
                      field.onChange(event);
                      patchProduct("description", event.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="product-options wide-field">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormControl>
                      <Checkbox
                        className="admin-checkbox"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          const value = checked === true;
                          field.onChange(value);
                          patchProduct("featured", value);
                        }}
                      />
                    </FormControl>
                    <span>
                      <b>Populaire</b>
                      <small>Mettre le produit en avant</small>
                    </span>
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormControl>
                      <Checkbox
                        className="admin-checkbox"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          const value = checked === true;
                          field.onChange(value);
                          patchProduct("active", value);
                        }}
                      />
                    </FormControl>
                    <span>
                      <b>Visible</b>
                      <small>Afficher dans la boutique</small>
                    </span>
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <div className="product-editor-actions">
            <Button
              type="submit"
              disabled={uploading || saving}
              className="product-save-button"
            >
              {uploading ? "Envoi de l'image..." : saving ? "Enregistrement..." : "Enregistrer le produit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
function OrderDetails({
  selected,
  close,
}: {
  selected: Order;
  close: () => void;
}) {
  return (
    <div className="admin-order-modal">
      <div>
        <Button variant="ghost" size="icon" onClick={close}>
          ×
        </Button>
        <p>{selected.reference}</p>
        <h2>{selected.customerName}</h2>
        <small>
          {selected.phone} · {selected.zone.name}
        </small>
        <address>{selected.address}</address>
        {selected.notes ? <i>{selected.notes}</i> : null}
        <div className="modal-order-lines">
          {selected.items.map((item) => (
            <div key={item.id}>
              <span>
                {item.quantity} × {item.product.name}
              </span>
              <b>{money(item.quantity * item.unitPrice)}</b>
            </div>
          ))}
        </div>
        <strong>{money(selected.total)}</strong>
      </div>
    </div>
  );
}
function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShoppingBag;
  label: string;
  value: string;
}) {
  return (
    <article className="stat-card">
      <Icon />
      <p>{label}</p>
      <b>{value}</b>
    </article>
  );
}
function Orders({
  orders,
  setSelected,
  busy,
  patch,
}: {
  orders: Order[];
  setSelected: (order: Order) => void;
  busy: boolean;
  patch: (id: number, status: Status) => void;
}) {
  return (
    <div className="orders-table">
      {orders.length ? (
        orders.map((order) => (
          <div className="order-row" key={order.id}>
            <Button
              variant="ghost"
              className="order-ref"
              onClick={() => setSelected(order)}
            >
              <b>{order.reference}</b>
              <small>
                {new Date(order.createdAt).toLocaleDateString("fr-FR")} ·{" "}
                {order.customerName}
              </small>
            </Button>
            <span>{order.zone.name}</span>
            <b>{money(order.total)}</b>
            <Select
              value={order.status}
              onValueChange={(value) => patch(order.id, value as Status)}
              disabled={busy}
            >
              <SelectTrigger
                className={`status admin-status-trigger ${order.status.toLowerCase()}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="admin-select-content">
                {statuses.map((status) => (
                  <SelectItem
                    className="admin-select-item"
                    key={status}
                    value={status}
                  >
                    {labels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))
      ) : (
        <p className="admin-empty">Aucune commande pour le moment.</p>
      )}
    </div>
  );
}
