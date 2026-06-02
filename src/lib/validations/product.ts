import { z } from "zod";

export const productSchema = z.object({
  slug: z.string().trim().min(2, "Le slug est obligatoire.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Utilisez uniquement des minuscules, chiffres et tirets."),
  name: z.string().trim().min(2, "Le nom est obligatoire."),
  category: z.string().trim().min(2, "La categorie est obligatoire."),
  description: z.string().trim().min(8, "Ajoutez une description plus precise."),
  price: z.number().int().min(0, "Le prix doit etre positif."),
  stock: z.number().int().min(0, "Le stock doit etre positif."),
  weight: z.string().trim().optional().nullable(),
  image: z.string().trim().min(1, "Selectionnez une image."),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const productPatchSchema = productSchema.partial();
