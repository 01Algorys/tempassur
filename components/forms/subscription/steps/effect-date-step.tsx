"use client"

import type { UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const fieldClass = "h-11 rounded-lg"

interface EffectDateStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function EffectDateStep({ form }: EffectDateStepProps) {
  const t = useTranslations("wizard.duration")

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">{t("effectDateHeading")}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="dateEffet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("effectDate")}</FormLabel>
              <FormControl>
                <Input type="date" className={fieldClass} {...field} />
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
                <Input type="time" className={fieldClass} {...field} />
              </FormControl>
              <FormDescription>{t("effectTimeHint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
