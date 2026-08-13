"use client"

import { useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"

import { Combobox } from "@/components/ui/combobox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CAR_MAKES, fetchCarMakes } from "@/lib/car-makes"
import { getPricingConfig } from "@/lib/pricing"
import { CV_TIER_OPTIONS, PTAC_TIER_OPTIONS, QUAD_SUBTYPE_OPTIONS } from "@/lib/pricing-data"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const triggerClass = "h-11 w-full rounded-lg"
const MARQUE_MIN_CHARS = 4

interface VehicleTierStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function VehicleTierStep({ form }: VehicleTierStepProps) {
  const t = useTranslations("wizard.vehicleTier")
  const tVehicle = useTranslations("wizard.vehicle")
  const tCvTier = useTranslations("pricingLabels.cvTier")
  const tPtacTier = useTranslations("pricingLabels.ptacTier")
  const tQuadSubtype = useTranslations("pricingLabels.quadSubtype")
  const categorie = form.watch("categorie")
  const ptacTier = form.watch("ptacTier")
  const pricingConfig = getPricingConfig(categorie)
  // For camping-cars, CV tier only drives the ≤3,5T tariff — the >3,5T table is flat.
  const showCvTier = pricingConfig.needsCvTier && ptacTier !== "plus-3500kg"
  const [carMakes, setCarMakes] = useState<string[]>(CAR_MAKES)

  useEffect(() => {
    let cancelled = false
    fetchCarMakes().then((makes) => {
      if (!cancelled) setCarMakes(makes)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">{t("heading")}</h3>

      <FormField
        control={form.control}
        name="marque"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tVehicle("marque")}</FormLabel>
            <FormControl>
              <Combobox
                value={field.value ?? ""}
                onValueChange={field.onChange}
                options={carMakes}
                placeholder={tVehicle("marque")}
                emptyText={tVehicle("marqueNoResults")}
                minChars={MARQUE_MIN_CHARS}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {pricingConfig.needsCvTier || pricingConfig.needsPtacTier || pricingConfig.needsQuadSubtype ? (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {showCvTier ? (
          <FormField
            control={form.control}
            name="cvTier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("cvLabel")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder={t("selectPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CV_TIER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {tCvTier(option.value)}
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
                <FormLabel>{t("ptacLabel")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder={t("selectPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PTAC_TIER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {tPtacTier(option.value)}
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
                <FormLabel>{t("quadLabel")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder={t("selectPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {QUAD_SUBTYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {tQuadSubtype(option.value)}
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
      ) : null}
    </div>
  )
}
