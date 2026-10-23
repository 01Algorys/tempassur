"use client"

import type { UseFormReturn } from "react-hook-form"
import { ArrowRight, Info } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCountries } from "@/hooks/use-countries"
import {
  DOM_TOM_COUNTRY_TERRITORIES,
  getCountryLabel,
  getRegistrationCase,
  isFrontierBlocked,
  isResidenceRequirementViolated,
} from "@/lib/countries"
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
  const countries = useCountries()

  const categorie = form.watch("categorie")
  const paysImmatriculation = form.watch("paysImmatriculation")
  const paysResidence = form.watch("paysResidence")
  const territoireImmatriculation = form.watch("territoireImmatriculation")
  const territoireResidence = form.watch("territoireResidence")

  const isDomTom =
    isDomTomTerritory(paysImmatriculation, territoireImmatriculation) ||
    isDomTomTerritory(paysResidence, territoireResidence)

  const registrationCase = getRegistrationCase(paysImmatriculation)
  const isFrontierCase = isFrontierBlocked(paysImmatriculation, categorie)
  const isResidenceViolated = isResidenceRequirementViolated(paysImmatriculation, paysResidence)

  // A DOM-TOM picked from the full list (e.g. "GP") is stored as France + territory.
  function handleCountryChange(
    value: string,
    onChange: (value: string) => void,
    territoryField: "territoireImmatriculation" | "territoireResidence"
  ) {
    const domTomTerritory = DOM_TOM_COUNTRY_TERRITORIES[value]
    if (domTomTerritory) {
      onChange("FR")
      form.setValue(territoryField, domTomTerritory, { shouldValidate: true })
      return
    }
    onChange(value)
    if (value !== "FR") form.setValue(territoryField, "")
  }

  const countryItems = countries.map((country) => (
    <SelectItem key={country.code} value={country.code}>
      {getCountryLabel(country.code, locale, tCommon("otherCountry"))}
    </SelectItem>
  ))

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
                onValueChange={(value) => handleCountryChange(value, field.onChange, "territoireImmatriculation")}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder={t("countryPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>{countryItems}</SelectContent>
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

        {!isFrontierCase ? (
          <FormField
            control={form.control}
            name="paysResidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("residenceCountry")}</FormLabel>
                <Select
                  onValueChange={(value) => handleCountryChange(value, field.onChange, "territoireResidence")}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder={t("countryPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{countryItems}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {!isFrontierCase && paysResidence === "FR" ? (
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

      {isFrontierCase ? (
        <div className="flex flex-col items-start gap-3 rounded-xl bg-secondary px-4 py-3 text-sm text-navy">
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            {t("frontierNotice")}
          </div>
          <Button asChild variant="cta" className="rounded-full">
            <Link href="/assurance-frontiere">
              {t("frontierCta")}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      ) : isResidenceViolated ? (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <Info className="mt-0.5 size-4 shrink-0" />
          {t("residenceMustBeFrance")}
        </div>
      ) : registrationCase === "restricted" ? (
        <div className="flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-navy">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          {t("residenceShouldBeFrance")}
        </div>
      ) : isDomTom ? (
        <div className="flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-navy">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          {t("domTomNotice")}
        </div>
      ) : null}
    </div>
  )
}
