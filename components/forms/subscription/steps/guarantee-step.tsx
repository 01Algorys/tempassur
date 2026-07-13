"use client"

import type { UseFormReturn } from "react-hook-form"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const fieldClass = "h-11 rounded-lg"

interface GuaranteeStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function GuaranteeStep({ form }: GuaranteeStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">Informations garantie</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="dateEffet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d&apos;effet *</FormLabel>
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
              <FormLabel>Heure d&apos;effet *</FormLabel>
              <FormControl>
                <Input type="time" className={fieldClass} {...field} />
              </FormControl>
              <FormDescription>
                L&apos;heure sélectionnée doit être au moins 20 minutes après l&apos;heure actuelle (délai
                nécessaire pour le traitement de votre dossier de souscription).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
