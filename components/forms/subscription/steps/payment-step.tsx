"use client"

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { AlertCircle, CreditCard, Loader2, Lock, ShieldCheck } from "lucide-react"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import type { StripeElementLocale } from "@stripe/stripe-js"
import type { UseFormReturn } from "react-hook-form"
import { useLocale, useTranslations } from "next-intl"

import { createPaymentIntent } from "@/lib/payment-intent"
import { getStripeClient } from "@/lib/stripe-client"
import { PRICE_LINE_TRANSLATION_KEYS, type PriceBreakdown } from "@/lib/pricing"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

export interface PaymentStepHandle {
  confirmPayment: () => Promise<{ success: boolean; paymentIntentId?: string; errorMessage?: string }>
}

interface PaymentStepProps {
  form: UseFormReturn<SubscriptionFormValues>
  vehicleLabel: string
  breakdown: PriceBreakdown | null
  onEdit: (stepIndex: number) => void
  onReadyChange: (ready: boolean) => void
  returnUrl: string
}

const STRIPE_APPEARANCE = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#2f6fed",
    colorText: "#101828",
    colorDanger: "#dc2626",
    fontFamily: "inherit",
    borderRadius: "12px",
  },
}

export const PaymentStep = forwardRef<PaymentStepHandle, PaymentStepProps>(function PaymentStep(
  { form, vehicleLabel, breakdown, onEdit, onReadyChange, returnUrl },
  ref
) {
  const t = useTranslations("wizard.payment")
  const tOptions = useTranslations("wizard.options")
  const locale = useLocale()
  const values = form.getValues()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setClientSecret(null)
    setLoadError(false)
    onReadyChange(false)

    createPaymentIntent({ values: form.getValues(), categorie: values.categorie, vehicleLabel })
      .then(({ clientSecret: secret }) => {
        if (!cancelled) setClientSecret(secret)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })

    return () => {
      cancelled = true
    }
    // Créé une seule fois par montage de cette étape (elle démonte/remonte à chaque
    // navigation vers/depuis l'étape paiement), pas besoin de réagir aux changements
    // de champs ensuite.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-bold text-navy">{t("heading")}</h3>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 text-sm">
        <RecapLine
          label={t("vehicle")}
          value={`${values.marque} ${values.modele} (${values.immatriculation})`}
          editLabel={t("edit")}
          onEdit={() => onEdit(1)}
        />
        <RecapLine label={t("categorie")} value={vehicleLabel} editLabel={t("edit")} onEdit={() => onEdit(1)} />
        <RecapLine
          label={t("duree")}
          value={values.duree ? t("durationValue", { count: values.duree }) : "—"}
          editLabel={t("edit")}
          onEdit={() => onEdit(0)}
        />
        <RecapLine
          label={t("dateEffet")}
          value={values.dateEffet && values.heureEffet ? t("dateAt", { date: values.dateEffet, time: values.heureEffet }) : "—"}
          editLabel={t("edit")}
          onEdit={() => onEdit(0)}
        />
        <RecapLine
          label={t("optionsChoisies")}
          value={
            breakdown && breakdown.lines.length > 0
              ? breakdown.lines.map((l) => tOptions(PRICE_LINE_TRANSLATION_KEYS[l.key])).join(", ")
              : t("aucune")
          }
          editLabel={t("edit")}
          onEdit={() => onEdit(1)}
        />
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between text-base font-bold text-navy">
          <span>{t("totalTtc")}</span>
          <span>{breakdown ? `${breakdown.total.toFixed(2)} €` : "— €"}</span>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{t("note")}</p>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-navy">
          <Lock className="size-4 text-primary" strokeWidth={2} />
          {t("secureHeading")}
        </div>

        {clientSecret ? (
          <Elements
            stripe={getStripeClient()}
            options={{ clientSecret, appearance: STRIPE_APPEARANCE, locale: locale as StripeElementLocale }}
          >
            <PaymentElementForm ref={ref} onReadyChange={onReadyChange} returnUrl={returnUrl} />
          </Elements>
        ) : loadError ? (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {t("loadError")}
          </p>
        ) : (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {t("loading")}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-primary" strokeWidth={2} />
            {t("securePoweredBy")}
          </span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="size-4 text-primary" strokeWidth={2} />
            {t("secureCards")}
          </span>
        </div>
      </div>
    </div>
  )
})

const PaymentElementForm = forwardRef<
  PaymentStepHandle,
  { onReadyChange: (ready: boolean) => void; returnUrl: string }
>(function PaymentElementForm({ onReadyChange, returnUrl }, ref) {
  const stripe = useStripe()
  const elements = useElements()

  useImperativeHandle(ref, () => ({
    async confirmPayment() {
      if (!stripe || !elements) {
        return { success: false, errorMessage: undefined }
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: { return_url: returnUrl },
      })

      if (error) {
        return { success: false, errorMessage: error.message }
      }
      if (paymentIntent?.status === "succeeded") {
        return { success: true, paymentIntentId: paymentIntent.id }
      }
      return { success: false, errorMessage: undefined }
    },
  }))

  return <PaymentElement onReady={() => onReadyChange(true)} />
})

function RecapLine({
  label,
  value,
  editLabel,
  onEdit,
}: {
  label: string
  value: string
  editLabel: string
  onEdit: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-semibold text-navy">{value}</dd>
      </div>
      <button type="button" onClick={onEdit} className="text-xs font-semibold text-primary hover:underline">
        {editLabel}
      </button>
    </div>
  )
}
