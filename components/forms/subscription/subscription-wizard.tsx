"use client"

import { useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, PartyPopper } from "lucide-react"
import { useForm } from "react-hook-form"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { VEHICLE_TYPES } from "@/lib/constants"
import { submitSubscription } from "@/lib/subscription"
import { calculatePrice, getAvailableDurations, getPricingConfig, type FormulaSelection } from "@/lib/pricing"
import { CV_TIER_OPTIONS, FRANCE_TERRITORIES, PTAC_TIER_OPTIONS, QUAD_SUBTYPE_OPTIONS } from "@/lib/pricing-data"
import { subscriptionSchema, type SubscriptionFormValues } from "@/lib/validations/subscription-schema"
import type { VehicleSlug } from "@/types"

import { StepIndicator } from "./step-indicator"
import { BillingSummary } from "./billing-summary"
import { FormulaStep } from "./steps/formula-step"
import { VehicleStep } from "./steps/vehicle-step"
import { DriverStep } from "./steps/driver-step"
import { GuaranteeStep } from "./steps/guarantee-step"
import { DocumentsStep } from "./steps/documents-step"

interface SubscriptionWizardProps {
  slug: VehicleSlug
  vehicleLabel: string
  initialDuree?: number
  initialEmail?: string
}

type StepId = "formula" | "vehicle" | "driver" | "guarantee" | "documents"

const STEPS: { id: StepId; title: string }[] = [
  { id: "formula", title: "Formule" },
  { id: "vehicle", title: "Véhicule" },
  { id: "driver", title: "Conducteur" },
  { id: "guarantee", title: "Garantie" },
  { id: "documents", title: "Documents" },
]

const STEP_FIELDS: Record<StepId, (keyof SubscriptionFormValues)[]> = {
  formula: ["duree", "cvTier", "ptacTier", "quadSubtype"],
  vehicle: ["immatriculation", "marque", "modele", "dateMiseEnCirculation", "nomAgenceLocation", "paysObtentionVehicule"],
  driver: [
    "civilite",
    "nom",
    "prenom",
    "dateNaissance",
    "paysNaissance",
    "telephoneMobile",
    "email",
    "adresse",
    "codePostal",
    "ville",
    "pays",
    "territoire",
    "numeroPermis",
    "dateObtentionPermis",
    "paysObtentionPermis",
  ],
  guarantee: ["dateEffet", "heureEffet"],
  documents: ["consentIpid", "consentAttestation", "consentCgv"],
}

export function SubscriptionWizard({ slug, vehicleLabel, initialDuree, initialEmail }: SubscriptionWizardProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const pricingConfig = useMemo(() => getPricingConfig(slug), [slug])
  const icon = VEHICLE_TYPES.find((vehicle) => vehicle.slug === slug)?.icon

  const defaultCvTier = pricingConfig.needsCvTier ? "moins-16cv" : undefined
  const defaultPtacTier = pricingConfig.needsPtacTier ? "moins-3500kg" : undefined
  const defaultQuadSubtype = pricingConfig.needsQuadSubtype ? "voiturette-sans-permis" : undefined

  const availableDefaultDurations = getAvailableDurations(slug, {
    duree: null,
    cvTier: defaultCvTier,
    ptacTier: defaultPtacTier,
    quadSubtype: defaultQuadSubtype,
    isDomTom: false,
  })
  const validInitialDuree = initialDuree && availableDefaultDurations.includes(initialDuree) ? initialDuree : 0

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    mode: "onTouched",
    defaultValues: {
      duree: validInitialDuree,
      cvTier: defaultCvTier,
      ptacTier: defaultPtacTier,
      quadSubtype: defaultQuadSubtype,
      optionAssistance: false,
      optionGarantieConducteur: false,
      optionExtensionTn: false,
      immatriculation: "",
      marque: "",
      modele: "",
      dateMiseEnCirculation: "",
      estVehiculeLocation: false,
      nomAgenceLocation: "",
      paysObtentionVehicule: "",
      civilite: "",
      nom: "",
      prenom: "",
      dateNaissance: "",
      paysNaissance: "",
      telephoneFixe: "",
      telephoneMobile: "",
      email: initialEmail ?? "",
      adresse: "",
      codePostal: "",
      ville: "",
      pays: "",
      territoire: "",
      numeroPermis: "",
      dateObtentionPermis: "",
      paysObtentionPermis: "",
      dateEffet: "",
      heureEffet: "",
      consentIpid: false,
      consentAttestation: false,
      consentCgv: false,
    },
  })

  const values = form.watch()

  const selection: FormulaSelection = {
    duree: values.duree || null,
    cvTier: values.cvTier,
    ptacTier: values.ptacTier,
    quadSubtype: values.quadSubtype,
    optionAssistance: values.optionAssistance,
    optionGarantieConducteur: values.optionGarantieConducteur,
    optionExtensionTn: values.optionExtensionTn,
    isDomTom: values.pays === "FR" && FRANCE_TERRITORIES.find((t) => t.value === values.territoire)?.isDomTom === true,
  }

  const breakdown = calculatePrice(slug, selection)

  let tierLabel: string | undefined
  if (pricingConfig.needsCvTier) {
    tierLabel = CV_TIER_OPTIONS.find((t) => t.value === values.cvTier)?.label
  } else if (pricingConfig.needsPtacTier) {
    tierLabel = PTAC_TIER_OPTIONS.find((t) => t.value === values.ptacTier)?.label
  } else if (pricingConfig.needsQuadSubtype) {
    tierLabel = QUAD_SUBTYPE_OPTIONS.find((t) => t.value === values.quadSubtype)?.label
  }

  const currentStep = STEPS[stepIndex]
  const isLastStep = stepIndex === STEPS.length - 1

  function scrollToTop() {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  async function goNext() {
    const isValid = await form.trigger(STEP_FIELDS[currentStep.id])
    if (!isValid) return
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
    scrollToTop()
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0))
    scrollToTop()
  }

  async function onSubmit(data: SubscriptionFormValues) {
    setStatus("idle")
    try {
      const { referenceId } = await submitSubscription(data)
      setReferenceId(referenceId)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-white p-10 text-center shadow-xl shadow-slate-900/10"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-orange/10 text-orange">
          <PartyPopper className="size-8" />
        </span>
        <div>
          <h3 className="text-xl font-bold text-navy">Votre demande de souscription est enregistrée !</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Référence <span className="font-mono font-semibold text-orange">{referenceId}</span>. Vous recevrez
            votre attestation par email dès validation de votre dossier.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
        <StepIndicator steps={STEPS} currentStep={stepIndex} />

        <Form {...form}>
          <form
            className="mt-8 flex flex-col gap-6"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              if (isLastStep) {
                void form.handleSubmit(onSubmit)(event)
              } else {
                void goNext()
              }
            }}
          >
            {currentStep.id === "formula" ? (
              <FormulaStep form={form} slug={slug} pricingConfig={pricingConfig} />
            ) : null}
            {currentStep.id === "vehicle" ? <VehicleStep form={form} slug={slug} /> : null}
            {currentStep.id === "driver" ? <DriverStep form={form} /> : null}
            {currentStep.id === "guarantee" ? <GuaranteeStep form={form} /> : null}
            {currentStep.id === "documents" ? <DocumentsStep form={form} /> : null}

            <AnimatePresence>
              {status === "error" ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  Une erreur est survenue lors de l&apos;envoi. Merci de réessayer.
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={goBack}
                disabled={stepIndex === 0}
              >
                <ArrowLeft data-icon="inline-start" />
                Précédent
              </Button>
              <Button type="submit" variant="cta" className="rounded-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                    Envoi...
                  </>
                ) : isLastStep ? (
                  "Souscrire"
                ) : (
                  <>
                    Continuer
                    <ArrowRight data-icon="inline-end" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <BillingSummary
        vehicleLabel={vehicleLabel}
        icon={icon}
        duree={values.duree || null}
        tierLabel={tierLabel}
        isDomTom={selection.isDomTom}
        breakdown={breakdown}
      />
    </div>
  )
}
