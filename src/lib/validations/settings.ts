import { z } from "zod";

export const settingsSchema = z.object({
  phoneDisplay: z.string().trim().min(1, "Le telephone affiche est obligatoire."),
  phoneHref: z.string().trim().min(1, "Le lien telephone est obligatoire."),
  address: z.string().trim().min(2, "L'adresse est obligatoire."),
  heroEyebrow: z.string().trim().min(2, "Le sur-titre est obligatoire."),
  heroTitle: z.string().trim().min(2, "Le titre est obligatoire."),
  heroAccent: z.string().trim().min(2, "L'accent est obligatoire."),
  heroDescription: z.string().trim().min(8, "La description du hero est trop courte."),
  announcementOne: z.string().trim().min(2, "L'annonce 1 est obligatoire."),
  announcementTwo: z.string().trim().min(2, "L'annonce 2 est obligatoire."),
  announcementThree: z.string().trim().min(2, "L'annonce 3 est obligatoire."),
  contactTitle: z.string().trim().min(2, "Le titre de contact est obligatoire."),
  contactDescription: z.string().trim().min(8, "La description de contact est trop courte."),
});

export const settingsPatchSchema = settingsSchema.partial();
