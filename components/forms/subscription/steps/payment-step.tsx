"use client"

import type { UseFormReturn } from "react-hook-form"

import type { PriceBreakdown } from "@/lib/pricing"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

interface PaymentStepProps {
  form: UseFormReturn<SubscriptionFormValues>
  vehicleLabel: string
  breakdown: PriceBreakdown | null
  onEdit: (stepIndex: number) => void
}

export function PaymentStep({ form, vehicleLabel, breakdown, onEdit }: PaymentStepProps) {
  const values = form.getValues()

  const optionLabels: Record<string, string> = {
    optionAssistance: "Assistance",
    optionGarantieConducteur: "Garantie du conducteur",
    optionExtensionTn: "Extension de pays",
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-bold text-navy">Récapitulatif et paiement sécurisé</h3>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 text-sm">
        <RecapLine label="Véhicule" value={`${values.marque} ${values.modele} (${values.immatriculation})`} onEdit={() => onEdit(1)} />
        <RecapLine label="Catégorie" value={vehicleLabel} onEdit={() => onEdit(1)} />
        <RecapLine
          label="Durée"
          value={values.duree ? `${values.duree} jour${values.duree > 1 ? "s" : ""}` : "—"}
          onEdit={() => onEdit(0)}
        />
        <RecapLine
          label="Date et heure d'effet"
          value={values.dateEffet && values.heureEffet ? `${values.dateEffet} à ${values.heureEffet}` : "—"}
          onEdit={() => onEdit(0)}
        />
        <RecapLine
          label="Options choisies"
          value={
            breakdown && breakdown.lines.length > 0
              ? breakdown.lines.map((l) => optionLabels[l.label] ?? l.label).join(", ")
              : "Aucune"
          }
          onEdit={() => onEdit(1)}
        />
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between text-base font-bold text-navy">
          <span>Total TTC</span>
          <span>{breakdown ? `${breakdown.total.toFixed(2)} €` : "— €"}</span>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Vérifiez votre récapitulatif ci-dessus, puis validez le paiement en toute sécurité ci-dessous. Aucune
        information supplémentaire n&apos;est nécessaire à cette étape.
      </p>
    </div>
  )
}

function RecapLine({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-semibold text-navy">{value}</dd>
      </div>
      <button type="button" onClick={onEdit} className="text-xs font-semibold text-primary hover:underline">
        Modifier
      </button>
    </div>
  )
}
