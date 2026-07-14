import { z } from "zod"

import { VEHICLE_SLUGS } from "@/types"

export const CIVILITE_OPTIONS = [
  { value: "M.", label: "M." },
  { value: "Mme", label: "Mme" },
] as const

const phoneRegex = /^[0-9+()\s-]+$/

const optionalFile = z
  .instanceof(File)
  .optional()
  .or(z.literal(undefined))

export const subscriptionSchema = z
  .object({
    // Localisation (dossier §4.1)
    paysImmatriculation: z.string().min(1, "Le pays d'immatriculation est requis"),
    territoireImmatriculation: z.string().optional().or(z.literal("")),
    paysResidence: z.string().min(1, "Le pays de résidence est requis"),
    territoireResidence: z.string().optional().or(z.literal("")),

    // Vehicle
    categorie: z.enum(VEHICLE_SLUGS),
    duree: z.number().positive("Sélectionnez une durée"),
    cvTier: z.enum(["moins-16cv", "moins-30cv", "plus-30cv"]).optional(),
    ptacTier: z.enum(["moins-3500kg", "plus-3500kg"]).optional(),
    quadSubtype: z.enum(["voiturette-sans-permis", "buggy", "quad-avec-permis"]).optional(),
    immatriculation: z.string().min(1, "L'immatriculation est requise").max(20),
    marque: z.string().min(1, "La marque est requise").max(50),
    modele: z.string().min(1, "Le modèle est requis").max(50),
    dateMiseEnCirculation: z.string().min(1, "La date de 1ère mise en circulation est requise"),
    estVehiculeLocation: z.boolean(),
    nomAgenceLocation: z.string().max(80).optional().or(z.literal("")),

    // Duration & effect date
    dateEffet: z.string().min(1, "La date d'effet est requise"),
    heureEffet: z.string().min(1, "L'heure d'effet est requise"),

    // Options
    optionAssistance: z.boolean(),
    optionGarantieConducteur: z.boolean(),
    optionExtensionTn: z.boolean(),

    // Driver
    civilite: z.string().min(1, "Sélectionnez une civilité"),
    nom: z.string().min(1, "Le nom est requis").max(50),
    prenom: z.string().min(1, "Le prénom est requis").max(50),
    dateNaissance: z.string().min(1, "La date de naissance est requise"),
    paysNaissance: z.string().min(1, "Le pays de naissance est requis"),
    telephoneFixe: z
      .string()
      .max(20)
      .regex(phoneRegex, "Entrez un numéro valide")
      .optional()
      .or(z.literal("")),
    telephoneMobile: z
      .string()
      .min(6, "Entrez un numéro valide")
      .max(20)
      .regex(phoneRegex, "Entrez un numéro valide"),
    email: z.string().min(1, "L'email est requis").email("Entrez une adresse email valide"),
    adresse: z.string().min(1, "L'adresse est requise").max(120),
    codePostal: z.string().min(1, "Le code postal est requis").max(10),
    ville: z.string().min(1, "La ville est requise").max(60),

    // Driving licence
    numeroPermis: z.string().min(1, "Le numéro de permis est requis").max(30),
    dateObtentionPermis: z.string().min(1, "La date d'obtention est requise"),
    paysObtentionPermis: z.string().min(1, "Le pays d'obtention est requis"),

    // Documents (optional at submission time)
    permisRecto: optionalFile,
    permisVerso: optionalFile,
    carteGrise: optionalFile,
    autresDocuments: optionalFile,

    // Consents (dossier §4.6/§4.7)
    consentCgv: z
      .boolean()
      .refine((v) => v === true, { message: "Les conditions générales de vente doivent être acceptées" }),
    consentIpid: z
      .boolean()
      .refine((v) => v === true, { message: "Le document d'information IPID doit être accepté" }),
    consentContrat: z
      .boolean()
      .refine((v) => v === true, { message: "Les conditions générales du contrat doivent être acceptées" }),
    consentDeclarations: z
      .boolean()
      .refine((v) => v === true, { message: "Vous devez certifier les déclarations du conducteur" }),
    declarationsAcceptedAt: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.paysImmatriculation === "FR" && !data.territoireImmatriculation) {
      ctx.addIssue({
        code: "custom",
        message: "Précisez le département ou territoire d'immatriculation",
        path: ["territoireImmatriculation"],
      })
    }

    if (data.paysResidence === "FR" && !data.territoireResidence) {
      ctx.addIssue({
        code: "custom",
        message: "Précisez le département ou territoire de résidence",
        path: ["territoireResidence"],
      })
    }

    if (data.dateNaissance) {
      const born = new Date(data.dateNaissance)
      const twentyOneYearsAgo = new Date()
      twentyOneYearsAgo.setFullYear(twentyOneYearsAgo.getFullYear() - 21)
      if (!Number.isNaN(born.getTime()) && born > twentyOneYearsAgo) {
        ctx.addIssue({
          code: "custom",
          message: "Nos contrats sont réservés aux conducteurs d'au moins 21 ans.",
          path: ["dateNaissance"],
        })
      }
    }

    if (data.dateObtentionPermis) {
      const obtained = new Date(data.dateObtentionPermis)
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      if (!Number.isNaN(obtained.getTime()) && obtained > twoYearsAgo) {
        ctx.addIssue({
          code: "custom",
          message: "Nos contrats exigent au moins 2 ans de permis.",
          path: ["dateObtentionPermis"],
        })
      }
    }

    if (data.dateEffet && data.heureEffet) {
      const effectDate = new Date(`${data.dateEffet}T${data.heureEffet}`)
      const minEffectDate = new Date()
      if (!Number.isNaN(effectDate.getTime()) && effectDate < minEffectDate) {
        ctx.addIssue({
          code: "custom",
          message: "La date et l'heure d'effet ne peuvent pas être antérieures à maintenant.",
          path: ["heureEffet"],
        })
      }
    }

    if (data.estVehiculeLocation && !data.nomAgenceLocation) {
      ctx.addIssue({
        code: "custom",
        message: "Indiquez le nom de l'agence de location",
        path: ["nomAgenceLocation"],
      })
    }
  })

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>
