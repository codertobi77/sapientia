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

// ------------------------------------------------------------------------
// Paramètres du site (sections éditables depuis /admin/parametres)
// ------------------------------------------------------------------------
export const settingsIdentitySchema = z.object({
  name: z.string().min(2, "Nom requis").trim(),
  shortName: z.string().min(2, "Nom court requis").trim(),
  subtitle: z.string().trim().default(""),
  email: emailSchema,
  phones: z
    .array(z.string().min(4, "Numéro trop court").trim())
    .min(1, "Au moins un numéro requis"),
  addresses: z
    .array(z.string().min(2, "Adresse trop courte").trim())
    .min(1, "Au moins une adresse requise"),
  whatsapp: z.string().min(4, "Numéro WhatsApp requis").trim(),
});

export const settingsSocialsSchema = z.object({
  facebook: z.string().trim().url("URL invalide").optional().or(z.literal("")),
  instagram: z.string().trim().url("URL invalide").optional().or(z.literal("")),
  linkedin: z.string().trim().url("URL invalide").optional().or(z.literal("")),
  youtube: z.string().trim().url("URL invalide").optional().or(z.literal("")),
});

export const settingsStatItemSchema = z.object({
  value: z.string().min(1, "Valeur requise").trim(),
  label: z.string().min(2, "Libellé requis").trim(),
  sublabel: z.string().trim().optional(),
  icon: z.string().min(1, "Icône requise").trim(),
});
export const settingsStatsSchema = z
  .array(settingsStatItemSchema)
  .max(12, "12 chiffres clés maximum")
  .min(1, "Au moins un chiffre clé");

export const settingsNavItemSchema = z.object({
  label: z.string().min(1, "Libellé requis").trim(),
  href: z.string().min(1, "Lien requis").trim(),
});
export const settingsNavSchema = z
  .array(settingsNavItemSchema)
  .max(15, "15 liens maximum")
  .min(1, "Au moins un lien de navigation");

export const settingsLogoSchema = z.object({
  imageUrl: z.string().trim().default(""),
  alt: z.string().min(2, "Texte alternatif requis").trim(),
  text: z.string().min(2, "Texte du logo requis").trim(),
  subtitle: z.string().trim().default(""),
});
