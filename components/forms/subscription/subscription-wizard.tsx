"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { PaymentHelp } from "@/components/shared/payment-help"
import { VEHICLE_TYPES } from "@/lib/constants"
import { submitSubscription } from "@/lib/subscription"
import { calculatePrice, getPricingConfig, isDomTomTerritory, type FormulaSelection } from "@/lib/pricing"
import { CV_TIER_OPTIONS, PTAC_TIER_OPTIONS, QUAD_SUBTYPE_OPTIONS } from "@/lib/pricing-data"
import { createSubscriptionSchema, type SubscriptionFormValues } from "@/lib/validations/subscription-schema"
import type { VehicleSlug } from "@/types"

import { StepIndicator } from "./step-indicator"
import { BillingSummary } from "./billing-summary"
import { DeclarationsDialog } from "./declarations-dialog"
import { LocalisationStep } from "./steps/localisation-step"
import { VehicleStep } from "./steps/vehicle-step"
import { VehicleTierStep } from "./steps/vehicle-tier-step"
import { DurationStep } from "./steps/duration-step"
import { DriverStep } from "./steps/driver-step"
import { OptionsStep } from "./steps/options-step"
import { DocumentsConsentsStep } from "./steps/documents-consents-step"
import { PaymentStep } from "./steps/payment-step"

interface SubscriptionWizardProps {
  initialCategory?: VehicleSlug
  initialDuree?: number
}

type StepId = "duration" | "details" | "payment"

const STEP_FIELDS: Record<StepId, (keyof SubscriptionFormValues)[]> = {
  duration: [
    "duree",
    "dateEffet",
    "heureEffet",
    "cvTier",
    "ptacTier",
    "quadSubtype",
    "paysImmatriculation",
    "territoireImmatriculation",
    "paysResidence",
    "territoireResidence",
  ],
  details: [
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
    "numeroPermis",
    "dateObtentionPermis",
    "paysObtentionPermis",
    "categorie",
    "immatriculation",
    "marque",
    "modele",
    "dateMiseEnCirculation",
    "estVehiculeLocation",
    "nomAgenceLocation",
    "optionAssistance",
    "optionGarantieConducteur",
    "optionExtensionTn",
    "consentCgv",
    "consentIpid",
    "consentContrat",
  ],
  payment: [],
}

export function SubscriptionWizard({ initialCategory = "automobiles", initialDuree }: SubscriptionWizardProps) {
  const router = useRouter()
  const t = useTranslations("wizard")
  const tVehicles = useTranslations("vehicleTypes")
  const tCvTier = useTranslations("pricingLabels.cvTier")
  const tPtacTier = useTranslations("pricingLabels.ptacTier")
  const tQuadSubtype = useTranslations("pricingLabels.quadSubtype")
  const tValidation = useTranslations("validation")
  const [stepIndex, setStepIndex] = useState(0)
  const [status, setStatus] = useState<"idle" | "error">("idle")
  const [declarationsOpen, setDeclarationsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const STEPS: { id: StepId; title: string }[] = [
    { id: "duration", title: t("steps.duration") },
    { id: "details", title: t("steps.details") },
    { id: "payment", title: t("steps.payment") },
  ]

  const subscriptionSchema = useMemo(() => createSubscriptionSchema(tValidation), [tValidation])

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    mode: "onTouched",
    defaultValues: {
      paysImmatriculation: "",
      territoireImmatriculation: "",
      paysResidence: "",
      territoireResidence: "",
      categorie: initialCategory,
      duree: initialDuree ?? 0,
      cvTier: getPricingConfig(initialCategory).needsCvTier ? "moins-16cv" : undefined,
      ptacTier: getPricingConfig(initialCategory).needsPtacTier ? "moins-3500kg" : undefined,
      quadSubtype: getPricingConfig(initialCategory).needsQuadSubtype ? "voiturette-sans-permis" : undefined,
      immatriculation: "",
      marque: "",
      modele: "",
      dateMiseEnCirculation: "",
      estVehiculeLocation: false,
      nomAgenceLocation: "",
      dateEffet: "",
      heureEffet: "",
      optionAssistance: false,
      optionGarantieConducteur: false,
      optionExtensionTn: false,
      civilite: "",
      nom: "",
      prenom: "",
      dateNaissance: "",
      paysNaissance: "",
      telephoneFixe: "",
      telephoneMobile: "",
      email: "",
      adresse: "",
      codePostal: "",
      ville: "",
      numeroPermis: "",
      dateObtentionPermis: "",
      paysObtentionPermis: "",
      consentCgv: false,
      consentIpid: false,
      consentContrat: false,
      consentDeclarations: false,
      declarationsAcceptedAt: "",
    },
  })

  const values = form.watch()
  const pricingConfig = useMemo(() => getPricingConfig(values.categorie), [values.categorie])
  const vehicle = VEHICLE_TYPES.find((v) => v.slug === values.categorie)
  const vehicleLabel = vehicle ? tVehicles(`${vehicle.slug}.label`) : ""

  const isDomTom =
    isDomTomTerritory(values.paysImmatriculation, values.territoireImmatriculation) ||
    isDomTomTerritory(values.paysResidence, values.territoireResidence)

  const selection: FormulaSelection = {
    duree: values.duree || null,
    cvTier: values.cvTier,
    ptacTier: values.ptacTier,
    quadSubtype: values.quadSubtype,
    optionAssistance: values.optionAssistance,
    optionGarantieConducteur: values.optionGarantieConducteur,
    optionExtensionTn: values.optionExtensionTn,
    isDomTom,
  }

  const breakdown = calculatePrice(values.categorie, selection)

  let tierLabel: string | undefined
  if (pricingConfig.needsCvTier) {
    const tier = CV_TIER_OPTIONS.find((o) => o.value === values.cvTier)
    tierLabel = tier ? tCvTier(tier.value) : undefined
  } else if (pricingConfig.needsPtacTier) {
    const tier = PTAC_TIER_OPTIONS.find((o) => o.value === values.ptacTier)
    tierLabel = tier ? tPtacTier(tier.value) : undefined
  } else if (pricingConfig.needsQuadSubtype) {
    const tier = QUAD_SUBTYPE_OPTIONS.find((o) => o.value === values.quadSubtype)
    tierLabel = tier ? tQuadSubtype(tier.value) : undefined
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

  function goToStep(index: number) {
    setStepIndex(Math.max(0, Math.min(index, STEPS.length - 1)))
    scrollToTop()
  }

  async function handlePayerClick() {
    const isValid = await form.trigger(STEP_FIELDS.payment)
    if (!isValid) return
    setDeclarationsOpen(true)
  }

  async function onSubmit(data: SubscriptionFormValues) {
    setStatus("idle")
    try {
      const { referenceId } = await submitSubscription(data)
      router.push(`/merci?ref=${encodeURIComponent(referenceId)}`)
    } catch {
      setStatus("error")
      setDeclarationsOpen(false)
    }
  }

  function handleDeclarationsConfirm() {
    form.setValue("consentDeclarations", true)
    form.setValue("declarationsAcceptedAt", new Date().toISOString())
    void form.handleSubmit(onSubmit)()
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
                void handlePayerClick()
              } else {
                void goNext()
              }
            }}
          >
            {currentStep.id === "duration" ? (
              <div className="flex flex-col gap-8">
                <DurationStep form={form} />
                <VehicleTierStep form={form} />
                <LocalisationStep form={form} />
              </div>
            ) : null}
            {currentStep.id === "details" ? (
              <div className="flex flex-col gap-8">
                <DriverStep form={form} />
                <VehicleStep form={form} />
                <OptionsStep form={form} />
                <DocumentsConsentsStep form={form} />
              </div>
            ) : null}
            {currentStep.id === "payment" ? (
              <PaymentStep form={form} vehicleLabel={vehicleLabel} breakdown={breakdown} onEdit={goToStep} />
            ) : null}

            <AnimatePresence>
              {status === "error" ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  {t("paymentError")}
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
                {t("buttons.previous")}
              </Button>
              <Button type="submit" variant="cta" className="rounded-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
                    {t("buttons.sending")}
                  </>
                ) : isLastStep ? (
                  t("buttons.payLabel", { amount: breakdown ? breakdown.total.toFixed(2) : "—" })
                ) : (
                  <>
                    {t("buttons.continueLabel")}
                    <ArrowRight data-icon="inline-end" />
                  </>
                )}
              </Button>
            </div>

            {isLastStep ? <PaymentHelp variant="tunnel" className="border-t border-border pt-4" /> : null}
          </form>
        </Form>
      </div>

      <BillingSummary
        vehicleLabel={vehicleLabel}
        icon={vehicle?.icon}
        duree={values.duree || null}
        tierLabel={tierLabel}
        isDomTom={isDomTom}
        breakdown={breakdown}
      />

      <DeclarationsDialog
        open={declarationsOpen}
        onOpenChange={setDeclarationsOpen}
        onConfirm={handleDeclarationsConfirm}
        isSubmitting={form.formState.isSubmitting}
      />
    </div>
  )
}
