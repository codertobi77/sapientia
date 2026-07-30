import { z } from "zod";

export const emailSchema = z.string().email("Adresse e-mail invalide").trim().toLowerCase();

export const newsletterSchema = z.object({
  email: emailSchema,
});

export const contactSchema = z.object({
  nom: z.string().min(2, "Nom requis").trim(),
  email: emailSchema,
  sujet: z.string().min(2, "Sujet requis").trim(),
  message: z.string().min(10, "Message trop court").trim(),
});

export const devisSchema = z.object({
  formation_id: z.string().uuid().optional().nullable(),
  type_formation: z.enum(["PRESENTIEL", "DISTANCE"]),
  niveau: z.string().min(1, "Niveau requis").trim(),
  duree: z.string().min(1, "Durée requise").trim(),
  nom: z.string().min(2, "Nom requis").trim(),
  email: emailSchema,
  telephone: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export const inscriptionSchema = z.object({
  formation_id: z.string().uuid(),
  nom: z.string().min(2, "Nom requis").trim(),
  prenom: z.string().min(2, "Prénom requis").trim(),
  email: emailSchema,
  telephone: z.string().trim().optional(),
  date_naissance: z.string().optional(),
  adresse: z.string().trim().optional(),
  niveau: z.string().trim().optional(),
  documents_paths: z.array(z.string()).default([]),
});
