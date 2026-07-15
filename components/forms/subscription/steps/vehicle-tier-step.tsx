"use client"

import type { UseFormReturn } from "react-hook-form"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getPricingConfig } from "@/lib/pricing"
import { CV_TIER_OPTIONS, PTAC_TIER_OPTIONS, QUAD_SUBTYPE_OPTIONS } from "@/lib/pricing-data"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const triggerClass = "h-11 w-full rounded-lg"

interface VehicleTierStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function VehicleTierStep({ form }: VehicleTierStepProps) {
  const categorie = form.watch("categorie")
  const pricingConfig = getPricingConfig(categorie)

  if (!pricingConfig.needsCvTier && !pricingConfig.needsPtacTier && !pricingConfig.needsQuadSubtype) {
    return null
  }

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">Puissance fiscale</h3>

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
      </div>
    </div>
  )
}
