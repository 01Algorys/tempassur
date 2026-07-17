import { z } from "zod"

import { VEHICLE_SLUGS } from "@/types"

// Labels translated via messages/*.json "pricingLabels.civilite.<translationKey>" — the
// form value itself ("M."/"Mme") is kept stable for the backend regardless of locale.
export const CIVILITE_OPTIONS = [
  { value: "M.", translationKey: "monsieur" },
  { value: "Mme", translationKey: "madame" },
] as const

const phoneRegex = /^[0-9+()\s-]+$/

const optionalFile = z
  .instanceof(File)
  .optional()
  .or(z.literal(undefined))

// The schema needs translated messages, so it's built as a factory from a `t` function
// (see messages/*.json "validation") — see useSubscriptionSchema below for the hook form
// actually uses.
export function createSubscriptionSchema(t: (key: string) => string) {
  return z
    .object({
      // Localisation (dossier §4.1)
      paysImmatriculation: z.string().min(1, t("paysImmatriculationRequired")),
      territoireImmatriculation: z.string().optional().or(z.literal("")),
      paysResidence: z.string().min(1, t("paysResidenceRequired")),
      territoireResidence: z.string().optional().or(z.literal("")),

      // Vehicle
      categorie: z.enum(VEHICLE_SLUGS),
      duree: z.number().positive(t("dureeRequired")),
      cvTier: z.enum(["moins-16cv", "moins-30cv", "plus-30cv"]).optional(),
      ptacTier: z.enum(["moins-3500kg", "plus-3500kg"]).optional(),
      quadSubtype: z.enum(["voiturette-sans-permis", "buggy", "quad-avec-permis"]).optional(),
      immatriculation: z.string().min(1, t("immatriculationRequired")).max(20),
      marque: z.string().min(1, t("marqueRequired")).max(50),
      modele: z.string().min(1, t("modeleRequired")).max(50),
      dateMiseEnCirculation: z.string().min(1, t("dateMiseEnCirculationRequired")),
      estVehiculeLocation: z.boolean(),
      nomAgenceLocation: z.string().max(80).optional().or(z.literal("")),

      // Duration & effect date
      dateEffet: z.string().min(1, t("dateEffetRequired")),
      heureEffet: z.string().min(1, t("heureEffetRequired")),

      // Options
      optionAssistance: z.boolean(),
      optionGarantieConducteur: z.boolean(),
      optionExtensionTn: z.boolean(),

      // Driver
      civilite: z.string().min(1, t("civiliteRequired")),
      nom: z.string().min(1, t("nomRequired")).max(50),
      prenom: z.string().min(1, t("prenomRequired")).max(50),
      dateNaissance: z.string().min(1, t("dateNaissanceRequired")),
      paysNaissance: z.string().min(1, t("paysNaissanceRequired")),
      telephoneFixe: z
        .string()
        .max(20)
        .regex(phoneRegex, t("telephoneInvalid"))
        .optional()
        .or(z.literal("")),
      telephoneMobile: z
        .string()
        .min(6, t("telephoneInvalid"))
        .max(20)
        .regex(phoneRegex, t("telephoneInvalid")),
      email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
      adresse: z.string().min(1, t("adresseRequired")).max(120),
      codePostal: z.string().min(1, t("codePostalRequired")).max(10),
      ville: z.string().min(1, t("villeRequired")).max(60),

      // Driving licence
      numeroPermis: z.string().min(1, t("numeroPermisRequired")).max(30),
      dateObtentionPermis: z.string().min(1, t("dateObtentionPermisRequired")),
      paysObtentionPermis: z.string().min(1, t("paysObtentionPermisRequired")),

      // Documents (optional at submission time)
      permisRecto: optionalFile,
      permisVerso: optionalFile,
      carteGrise: optionalFile,
      autresDocuments: optionalFile,

      // Consents (dossier §4.6/§4.7)
      consentCgv: z.boolean().refine((v) => v === true, { message: t("consentCgvRequired") }),
      consentIpid: z.boolean().refine((v) => v === true, { message: t("consentIpidRequired") }),
      consentContrat: z.boolean().refine((v) => v === true, { message: t("consentContratRequired") }),
      consentDeclarations: z.boolean().refine((v) => v === true, { message: t("consentDeclarationsRequired") }),
      declarationsAcceptedAt: z.string().optional().or(z.literal("")),
    })
    .superRefine((data, ctx) => {
      if (data.paysImmatriculation === "FR" && !data.territoireImmatriculation) {
        ctx.addIssue({
          code: "custom",
          message: t("territoireImmatriculationRequired"),
          path: ["territoireImmatriculation"],
        })
      }

      if (data.paysResidence === "FR" && !data.territoireResidence) {
        ctx.addIssue({
          code: "custom",
          message: t("territoireResidenceRequired"),
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
            message: t("minAge"),
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
            message: t("minLicenseAge"),
            path: ["dateObtentionPermis"],
          })
        }
      }

      if (data.dateEffet && data.heureEffet) {
        const effectDate = new Date(`${data.dateEffet}T${data.heureEffet}`)
        if (Number.isNaN(effectDate.getTime())) {
          ctx.addIssue({
            code: "custom",
            message: t("dateEffetInvalid"),
            path: ["dateEffet"],
          })
        } else if (effectDate < new Date()) {
          ctx.addIssue({
            code: "custom",
            message: t("effectDateInPast"),
            path: ["heureEffet"],
          })
        }
      }

      if (data.estVehiculeLocation && !data.nomAgenceLocation) {
        ctx.addIssue({
          code: "custom",
          message: t("nomAgenceRequired"),
          path: ["nomAgenceLocation"],
        })
      }
    })
}

export type SubscriptionFormValues = z.infer<ReturnType<typeof createSubscriptionSchema>>
