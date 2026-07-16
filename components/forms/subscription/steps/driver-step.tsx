"use client"

import type { UseFormReturn } from "react-hook-form"
import { useLocale, useTranslations } from "next-intl"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES, getCountryLabel } from "@/lib/countries"
import { CIVILITE_OPTIONS, type SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const fieldClass = "h-11 rounded-lg"
const triggerClass = "h-11 w-full rounded-lg"

interface DriverStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function DriverStep({ form }: DriverStepProps) {
  const t = useTranslations("wizard.driver")
  const tCommon = useTranslations("common")
  const tCivilite = useTranslations("pricingLabels.civilite")
  const locale = useLocale()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <h3 className="text-lg font-bold text-navy">{t("heading")}</h3>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t("identity")}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="civilite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("civilite")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={triggerClass}>
                        <SelectValue placeholder={t("civilitePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CIVILITE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {tCivilite(option.translationKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nom")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("nomPlaceholder")} className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("prenom")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("prenomPlaceholder")} className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateNaissance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dateNaissance")}</FormLabel>
                  <FormControl>
                    <Input type="date" className={fieldClass} {...field} />
                  </FormControl>
                  <FormDescription>{t("dateNaissanceHint")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paysNaissance"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>{t("paysNaissance")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={triggerClass}>
                        <SelectValue placeholder={t("paysNaissancePlaceholder")} />
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
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t("coordonnees")}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="telephoneMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("mobile")}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={t("mobilePlaceholder")} className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telephoneFixe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fixe")}</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder={t("fixePlaceholder")} className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t("emailPlaceholder")} className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t("adresseHeading")}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>{t("adresse")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("adressePlaceholder")} className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codePostal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("codePostal")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("codePostalPlaceholder")} className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ville"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("ville")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("villePlaceholder")} className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-lg font-bold text-navy">{t("permisHeading")}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="numeroPermis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("numeroPermis")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("numeroPermisPlaceholder")} className={fieldClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateObtentionPermis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dateObtention")}</FormLabel>
                <FormControl>
                  <Input type="date" className={fieldClass} {...field} />
                </FormControl>
                <FormDescription>{t("dateObtentionHint")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paysObtentionPermis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("paysObtention")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder={t("paysNaissancePlaceholder")} />
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
        </div>
      </div>
    </div>
  )
}
