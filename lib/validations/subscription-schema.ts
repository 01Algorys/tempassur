import { z } from "zod"

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
    // Formula
    duree: z.number().positive("Sélectionnez une durée"),
    cvTier: z.enum(["moins-16cv", "moins-30cv", "plus-30cv"]).optional(),
    ptacTier: z.enum(["moins-3500kg", "plus-3500kg"]).optional(),
    quadSubtype: z.enum(["voiturette-sans-permis", "buggy", "quad-avec-permis"]).optional(),
    optionAssistance: z.boolean(),
    optionGarantieConducteur: z.boolean(),
    optionExtensionTn: z.boolean(),

    // Vehicle
    immatriculation: z.string().min(1, "L'immatriculation est requise").max(20),
    marque: z.string().min(1, "La marque est requise").max(50),
    modele: z.string().min(1, "Le modèle est requis").max(50),
    dateMiseEnCirculation: z.string().min(1, "La date de 1ère mise en circulation est requise"),
    estVehiculeLocation: z.boolean(),
    nomAgenceLocation: z.string().max(80).optional().or(z.literal("")),
    paysObtentionVehicule: z.string().min(1, "Le pays d'obtention est requis"),

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
    pays: z.string().min(1, "Le pays est requis"),
    territoire: z.string().optional().or(z.literal("")),

    // Driving licence
    numeroPermis: z.string().min(1, "Le numéro de permis est requis").max(30),
    dateObtentionPermis: z.string().min(1, "La date d'obtention est requise"),
    paysObtentionPermis: z.string().min(1, "Le pays d'obtention est requis"),

    // Guarantee
    dateEffet: z.string().min(1, "La date d'effet est requise"),
    heureEffet: z.string().min(1, "L'heure d'effet est requise"),

    // Documents (optional at submission time)
    permisRecto: optionalFile,
    permisVerso: optionalFile,
    carteGrise: optionalFile,
    autresDocuments: optionalFile,

    // Consents
    consentIpid: z.boolean().refine((v) => v === true, { message: "Ce document doit être accepté" }),
    consentAttestation: z
      .boolean()
      .refine((v) => v === true, { message: "Cette attestation doit être acceptée" }),
    consentCgv: z
      .boolean()
      .refine((v) => v === true, { message: "Les conditions générales doivent être acceptées" }),
  })
  .superRefine((data, ctx) => {
    if (data.pays === "FR" && !data.territoire) {
      ctx.addIssue({
        code: "custom",
        message: "Précisez le département ou territoire",
        path: ["territoire"],
      })
    }

    if (data.dateObtentionPermis) {
      const obtained = new Date(data.dateObtentionPermis)
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      if (!Number.isNaN(obtained.getTime()) && obtained > twoYearsAgo) {
        ctx.addIssue({
          code: "custom",
          message: "Le permis doit avoir au moins 2 ans pour assurer le véhicule",
          path: ["dateObtentionPermis"],
        })
      }
    }

    if (data.dateEffet && data.heureEffet) {
      const effectDate = new Date(`${data.dateEffet}T${data.heureEffet}`)
      const minEffectDate = new Date(Date.now() + 20 * 60 * 1000)
      if (!Number.isNaN(effectDate.getTime()) && effectDate < minEffectDate) {
        ctx.addIssue({
          code: "custom",
          message: "L'heure d'effet doit être au moins 20 minutes après l'heure actuelle",
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
