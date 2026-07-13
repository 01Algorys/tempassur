"use client"

import type { UseFormReturn } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAvailableDurations, type PricingConfig } from "@/lib/pricing"
import { CV_TIER_OPTIONS, PTAC_TIER_OPTIONS, QUAD_SUBTYPE_OPTIONS } from "@/lib/pricing-data"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"
import type { VehicleSlug } from "@/types"

const triggerClass = "h-11 w-full rounded-lg"

interface FormulaStepProps {
  form: UseFormReturn<SubscriptionFormValues>
  slug: VehicleSlug
  pricingConfig: PricingConfig
}

const OPTIONS = [
  {
    name: "optionAssistance" as const,
    label: "Assistance",
    description: "Dépannage, remorquage et rapatriement en cas de panne, accident ou vol.",
  },
  {
    name: "optionGarantieConducteur" as const,
    label: "Garantie du conducteur",
    description: "Indemnisation des dommages corporels du conducteur en cas d'accident responsable.",
  },
  {
    name: "optionExtensionTn" as const,
    label: "Extension TN",
    description: "Option additionnelle dont le tarif varie selon la durée du contrat.",
  },
]

export function FormulaStep({ form, slug, pricingConfig }: FormulaStepProps) {
  const cvTier = form.watch("cvTier")
  const ptacTier = form.watch("ptacTier")
  const quadSubtype = form.watch("quadSubtype")

  const durations = getAvailableDurations(slug, {
    duree: null,
    cvTier,
    ptacTier,
    quadSubtype,
    isDomTom: false,
  })

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">Votre formule</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pricingConfig.needsCvTier ? (
          <FormField
            control={form.control}
            name="cvTier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puissance fiscale *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CV_TIER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {pricingConfig.needsPtacTier ? (
          <FormField
            control={form.control}
            name="ptacTier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poids total autorisé en charge *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PTAC_TIER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {pricingConfig.needsQuadSubtype ? (
          <FormField
            control={form.control}
            name="quadSubtype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de véhicule *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {QUAD_SUBTYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="duree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée du contrat *</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Nombre de jours" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {durations.map((duree) => (
                    <SelectItem key={duree} value={String(duree)}>
                      {duree} jour{duree > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {pricingConfig.hasOptions ? (
        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4">
          <p className="text-sm font-semibold text-navy">Options complémentaires</p>
          {OPTIONS.map((option) => (
            <FormField
              key={option.name}
              control={form.control}
              name={option.name}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                  </FormControl>
                  <div className="grid gap-0.5">
                    <FormLabel className="font-medium text-foreground">{option.label}</FormLabel>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
