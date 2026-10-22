"use client"

import type { UseFormReturn } from "react-hook-form"
import { ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MOTIF_SOUSCRIPTION_VALUES } from "@/lib/motif-souscription"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const fieldClass = "h-11 rounded-lg"
const triggerClass = "h-11 w-full rounded-lg"

interface MotifStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function MotifStep({ form }: MotifStepProps) {
  const t = useTranslations("wizard.motif")
  const motif = form.watch("motifSouscription")

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">{t("heading")}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="motifSouscription"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t("label")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder={t("placeholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MOTIF_SOUSCRIPTION_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`options.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {motif === "autre" ? (
          <FormField
            control={form.control}
            name="motifSouscriptionAutre"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("autreLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("autrePlaceholder")} className={fieldClass} {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {motif === "resiliation-non-paiement" ? (
          <div className="flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:col-span-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            {t("resiliationNotice")}
          </div>
        ) : null}
      </div>
    </div>
  )
}
