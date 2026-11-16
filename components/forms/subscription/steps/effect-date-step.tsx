"use client"

import { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { getStepOneIssues, type SubscriptionFormValues } from "@/lib/validations/subscription-schema"
import { EuDateInput } from "../eu-date-input"
import { EuTimeInput } from "../eu-time-input"
import { startOfToday } from "../date-bounds"

const fieldClass = "h-11 rounded-lg"

interface EffectDateStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function EffectDateStep({ form }: EffectDateStepProps) {
  const t = useTranslations("wizard.duration")
  const tValidation = useTranslations("validation")
  const dateEffet = form.watch("dateEffet")
  const heureEffet = form.watch("heureEffet")

  // Dès que la date et l'heure sont complètes, signale tout de suite une date d'effet déjà
  // passée (ou une date qui n'existe pas), sans attendre « Continuer ». N'efface que ces
  // messages-là, pas une erreur « champ requis » affichée par ailleurs.
  useEffect(() => {
    const messages = [tValidation("effectDateInPast"), tValidation("dateEffetInvalid")]
    const issues = getStepOneIssues({ dateEffet, heureEffet }, tValidation)
    for (const path of ["dateEffet", "heureEffet"] as const) {
      const issue = issues.find((i) => i.path === path)
      const current = form.getFieldState(path).error?.message
      if (issue) {
        if (current !== issue.message) form.setError(path, { type: "manual", message: issue.message })
      } else if (current && messages.includes(current)) {
        form.clearErrors(path)
      }
    }
  }, [dateEffet, heureEffet, form, tValidation])

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">{t("effectDateHeading")}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="dateEffet"
          render={({ field }) => (
            <FormItem >
              <FormLabel>{t("effectDate")}</FormLabel>
              <FormControl>
                    <EuDateInput className={fieldClass} minDate={startOfToday()} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="heureEffet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("effectTime")}</FormLabel>
              <FormControl>
                <EuTimeInput className={fieldClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
