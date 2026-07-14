"use client"

import { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { EXTENSION_COUNTRIES } from "@/lib/covered-countries"
import { areOptionsEligible, isDomTomTerritory } from "@/lib/pricing"
import { AUTO_TARIFFS } from "@/lib/pricing-data"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"
import { cn } from "@/lib/utils"

interface OptionsStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function OptionsStep({ form }: OptionsStepProps) {
  const categorie = form.watch("categorie")
  const cvTier = form.watch("cvTier") ?? "moins-16cv"
  const duree = form.watch("duree")
  const paysImmatriculation = form.watch("paysImmatriculation")
  const territoireImmatriculation = form.watch("territoireImmatriculation")
  const paysResidence = form.watch("paysResidence")
  const territoireResidence = form.watch("territoireResidence")

  const isDomTom =
    isDomTomTerritory(paysImmatriculation, territoireImmatriculation) ||
    isDomTomTerritory(paysResidence, territoireResidence)
  const eligible = areOptionsEligible(categorie, isDomTom)
  const row = AUTO_TARIFFS[cvTier].find((r) => r.duree === duree)

  useEffect(() => {
    if (!eligible) {
      form.setValue("optionAssistance", false)
      form.setValue("optionGarantieConducteur", false)
      form.setValue("optionExtensionTn", false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible])

  if (categorie !== "automobiles") {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-navy">Options</h3>
        <p className="text-sm text-muted-foreground">
          Aucune option n&apos;est disponible pour cette catégorie de véhicule.
        </p>
      </div>
    )
  }

  const OPTIONS = [
    {
      name: "optionGarantieConducteur" as const,
      label: "Garantie du conducteur",
      price: row?.optionGarantieConducteur,
    },
    { name: "optionAssistance" as const, label: "Assistance", price: row?.optionAssistance },
    {
      name: "optionExtensionTn" as const,
      label: `Extension de pays (${EXTENSION_COUNTRIES.join(", ")})`,
      price: row?.optionExtensionTn,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-navy">Options</h3>
      <p className="text-xs text-muted-foreground">Le prix des options dépend de la durée.</p>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((option) => {
          const disabled = !eligible || option.price == null
          return (
            <FormField
              key={option.name}
              control={form.control}
              name={option.name}
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "flex flex-row items-start justify-between gap-3 rounded-xl border border-border p-4",
                    disabled && "opacity-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={disabled}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div className="flex flex-col gap-0.5">
                      <FormLabel className="font-medium text-foreground">{option.label}</FormLabel>
                      {!eligible ? (
                        <p className="text-xs font-medium text-destructive">Non éligible pour ce pays</p>
                      ) : option.price == null ? (
                        <p className="text-xs text-muted-foreground">Non disponible pour cette durée</p>
                      ) : null}
                    </div>
                  </div>
                  {option.price != null ? (
                    <span className="text-sm font-semibold whitespace-nowrap text-navy">+{option.price} €</span>
                  ) : null}
                </FormItem>
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
