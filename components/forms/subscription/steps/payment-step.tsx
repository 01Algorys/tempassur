"use client"

import type { UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"

import { PRICE_LINE_TRANSLATION_KEYS, type PriceBreakdown } from "@/lib/pricing"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

interface PaymentStepProps {
  form: UseFormReturn<SubscriptionFormValues>
  vehicleLabel: string
  breakdown: PriceBreakdown | null
  onEdit: (stepIndex: number) => void
}

export function PaymentStep({ form, vehicleLabel, breakdown, onEdit }: PaymentStepProps) {
  const t = useTranslations("wizard.payment")
  const tOptions = useTranslations("wizard.options")
  const values = form.getValues()

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
    </div>
  )
}

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
