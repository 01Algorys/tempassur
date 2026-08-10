"use client"

import type { UseFormReturn } from "react-hook-form"
import { Info } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES, getCountryLabel, getRegistrationCase } from "@/lib/countries"
import { CIVILITE_OPTIONS, type SubscriptionFormValues } from "@/lib/validations/subscription-schema"

import { EuDateInput } from "../eu-date-input"

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

  const paysImmatriculation = form.watch("paysImmatriculation")
  const paysObtentionPermis = form.watch("paysObtentionPermis")

  const registrationCase = getRegistrationCase(paysImmatriculation)
  const showProofOfDomicileNotice =
    registrationCase === "restricted" && paysObtentionPermis !== "" && paysObtentionPermis !== "FR"

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <h3 className="text-lg font-bold text-navy">{t("heading")}</h3>

        <div className="flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-navy">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          {t("whoCanSubscribeNotice")}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t("identity")}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="civilite"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
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
            <div>
              <FormField
                control={form.control}
                name="dateNaissance"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>{t("dateNaissance")}</FormLabel>
                    <FormControl>
                      <EuDateInput className={fieldClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="paysNaissance"
              render={({ field }) => (
                <FormItem>
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
                    <PhoneInput
                      placeholder={t("mobilePlaceholder")}
                      className={fieldClass}
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? "")}
                      onBlur={field.onBlur}
                    />
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
                    <PhoneInput
                      placeholder={t("fixePlaceholder")}
                      className={fieldClass}
                      value={field.value}
                      onChange={(value) => field.onChange(value ?? "")}
                      onBlur={field.onBlur}
                    />
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
                  <EuDateInput className={fieldClass} {...field} />
                </FormControl>
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

        {showProofOfDomicileNotice ? (
          <div className="flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-navy">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            {t("proofOfDomicileNotice")}
          </div>
        ) : null}
      </div>
    </div>
  )
}
