"use client"

import type { UseFormReturn } from "react-hook-form"
import { Info } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES, getCountryLabel } from "@/lib/countries"
import { FRANCE_TERRITORIES } from "@/lib/pricing-data"
import { isDomTomTerritory } from "@/lib/pricing"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const triggerClass = "h-11 w-full rounded-lg"

interface LocalisationStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function LocalisationStep({ form }: LocalisationStepProps) {
  const t = useTranslations("wizard.localisation")
  const tCommon = useTranslations("common")
  const tTerritory = useTranslations("pricingLabels.territory")
  const locale = useLocale()

  const paysImmatriculation = form.watch("paysImmatriculation")
  const paysResidence = form.watch("paysResidence")
  const territoireImmatriculation = form.watch("territoireImmatriculation")
  const territoireResidence = form.watch("territoireResidence")

  const isDomTom =
    isDomTomTerritory(paysImmatriculation, territoireImmatriculation) ||
    isDomTomTerritory(paysResidence, territoireResidence)

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">{t("heading")}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="paysImmatriculation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("registrationCountry")}</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  if (value !== "FR") form.setValue("territoireImmatriculation", "")
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder={t("countryPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {getCountryLabel(country.code, locale, tCommon("otherCountry"))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {paysImmatriculation === "FR" ? (
          <FormField
            control={form.control}
            name="territoireImmatriculation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("registrationTerritory")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder={t("territoryPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FRANCE_TERRITORIES.map((territory) => (
                      <SelectItem key={territory.value} value={territory.value}>
                        {tTerritory(territory.value)}
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
          name="paysResidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("residenceCountry")}</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  if (value !== "FR") form.setValue("territoireResidence", "")
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder={t("countryPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {getCountryLabel(country.code, locale, tCommon("otherCountry"))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {paysResidence === "FR" ? (
          <FormField
            control={form.control}
            name="territoireResidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("residenceTerritory")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder={t("territoryPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FRANCE_TERRITORIES.map((territory) => (
                      <SelectItem key={territory.value} value={territory.value}>
                        {tTerritory(territory.value)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{t("domTomHint")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
      </div>

      {isDomTom ? (
        <div className="flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-navy">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          {t("domTomNotice")}
        </div>
      ) : null}
    </div>
  )
}
