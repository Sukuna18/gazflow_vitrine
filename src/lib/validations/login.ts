import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Saisissez un email valide."),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});
