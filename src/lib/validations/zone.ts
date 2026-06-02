import { z } from "zod";

export const zoneSchema = z.object({
  name: z.string().trim().min(2, "Le nom de la zone est obligatoire."),
  fee: z.number().int().min(0, "Les frais doivent etre positifs."),
  eta: z.string().trim().min(2, "Le delai est obligatoire."),
});

export const zonePatchSchema = zoneSchema.partial();
