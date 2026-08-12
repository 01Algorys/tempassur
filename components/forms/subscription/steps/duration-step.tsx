"use client"

import { useEffect, useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useLocale, useTranslations } from "next-intl"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculatePrice, getAvailableDurations, getPreselectedDuration } from "@/lib/pricing"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const triggerClass = "h-11 w-full rounded-lg"

interface DurationStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function DurationStep({ form }: DurationStepProps) {
  const t = useTranslations("wizard.duration")
  const locale = useLocale()
  const currency = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [locale]
  )
  const categorie = form.watch("categorie")
  const cvTier = form.watch("cvTier")
  const ptacTier = form.watch("ptacTier")
  const quadSubtype = form.watch("quadSubtype")
  const duree = form.watch("duree")

  const selection = { cvTier, ptacTier, quadSubtype, isDomTom: false }
  const durations = getAvailableDurations(categorie, { duree: null, ...selection })
  const preselected = getPreselectedDuration(categorie)

  // Changing the CV/PTAC/quad tier changes which durations have a tariff row.
  // A previously selected duree can silently become invalid — it would still
  // pass required-field validation, but calculatePrice would find no matching
  // row and return a null breakdown, saving the devis with no price at all.
  // Falling back to the category's most-chosen duration keeps a valid price
  // selected instead of forcing the user back to an empty placeholder.
  useEffect(() => {
    if (duree && !durations.includes(duree)) {
      form.setValue("duree", preselected)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorie, cvTier, ptacTier, quadSubtype])

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">{t("heading")}</h3>

      <FormField
        control={form.control}
        name="duree"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("contractDuration")}</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={duree ? String(duree) : undefined}
            >
              <FormControl>
                <SelectTrigger className={triggerClass}>
                  <SelectValue placeholder={t("durationPlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {durations.map((d) => {
                  const price = calculatePrice(categorie, { ...selection, duree: d })?.basePrice ?? null
                  return (
                    <SelectItem key={d} value={String(d)}>
                      {t("durationOption", { count: d })}
                      {price != null ? ` — ${currency.format(price)}` : ""}
                      {d === preselected ? ` · ${t("mostChosen")}` : ""}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
