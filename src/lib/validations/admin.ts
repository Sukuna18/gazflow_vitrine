import { z } from "zod";

export const adminSchema = z.object({
  name: z.string().trim().min(2, "Le nom est obligatoire."),
  email: z.string().trim().toLowerCase().email("Saisissez un email valide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caracteres."),
});
