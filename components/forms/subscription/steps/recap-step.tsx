"use client"

import Link from "next/link"
import type { UseFormReturn } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { PriceBreakdown } from "@/lib/pricing"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

import { FileUploadField } from "../file-upload-field"

interface RecapStepProps {
  form: UseFormReturn<SubscriptionFormValues>
  vehicleLabel: string
  breakdown: PriceBreakdown | null
  onEdit: (stepIndex: number) => void
}

export function RecapStep({ form, vehicleLabel, breakdown, onEdit }: RecapStepProps) {
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
          onEdit={() => onEdit(2)}
        />
        <RecapLine
          label="Date et heure d'effet"
          value={values.dateEffet && values.heureEffet ? `${values.dateEffet} à ${values.heureEffet}` : "—"}
          onEdit={() => onEdit(2)}
        />
        <RecapLine
          label="Options choisies"
          value={
            breakdown && breakdown.lines.length > 0
              ? breakdown.lines.map((l) => optionLabels[l.label] ?? l.label).join(", ")
              : "Aucune"
          }
          onEdit={() => onEdit(4)}
        />
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between text-base font-bold text-navy">
          <span>Total TTC</span>
          <span>{breakdown ? `${breakdown.total.toFixed(2)} €` : "— €"}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-navy">Documents (optionnel à ce stade)</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="permisRecto"
            render={({ field }) => (
              <FormItem>
                <FileUploadField id="permisRecto" label="Permis de conduire (recto)" value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="permisVerso"
            render={({ field }) => (
              <FormItem>
                <FileUploadField id="permisVerso" label="Permis de conduire (verso)" value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carteGrise"
            render={({ field }) => (
              <FormItem>
                <FileUploadField id="carteGrise" label="Carte grise" value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="consentCgv"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border p-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
              </FormControl>
              <div className="flex flex-col gap-1">
                <FormLabel className="text-sm font-normal text-foreground">
                  J&apos;accepte les{" "}
                  <Link href="/cgv" target="_blank" className="font-medium text-primary underline underline-offset-2">
                    Conditions générales de vente
                  </Link>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consentIpid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border p-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
              </FormControl>
              <div className="flex flex-col gap-1">
                <FormLabel className="text-sm font-normal text-foreground">
                  J&apos;ai pris connaissance du document d&apos;information (IPID)
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consentContrat"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border p-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
              </FormControl>
              <div className="flex flex-col gap-1">
                <FormLabel className="text-sm font-normal text-foreground">
                  J&apos;ai pris connaissance des conditions générales du contrat
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
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
