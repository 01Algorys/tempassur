"use client"

import type { UseFormReturn } from "react-hook-form"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAvailableDurations, getDurationShortcuts, getPreselectedDuration } from "@/lib/pricing"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"
import { cn } from "@/lib/utils"

const fieldClass = "h-11 rounded-lg"
const triggerClass = "h-11 w-full rounded-lg"

interface DurationStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function DurationStep({ form }: DurationStepProps) {
  const categorie = form.watch("categorie")
  const cvTier = form.watch("cvTier")
  const ptacTier = form.watch("ptacTier")
  const quadSubtype = form.watch("quadSubtype")
  const duree = form.watch("duree")

  const selection = { cvTier, ptacTier, quadSubtype, isDomTom: false }
  const durations = getAvailableDurations(categorie, { duree: null, ...selection })
  const shortcuts = getDurationShortcuts(categorie, selection)
  const preselected = getPreselectedDuration(categorie)

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">Durée et date d&apos;effet</h3>

      <FormField
        control={form.control}
        name="duree"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Durée du contrat *</FormLabel>
            <div className="flex flex-wrap gap-2">
              {shortcuts.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={field.value === d}
                  onClick={() => field.onChange(d)}
                  className={cn(
                    "relative rounded-lg border px-3 py-2 text-sm font-semibold transition-colors",
                    field.value === d
                      ? "border-primary bg-primary text-white"
                      : "border-border text-foreground/70 hover:border-primary/40"
                  )}
                >
                  {d} j
                  {d === preselected ? (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-orange px-1.5 py-0.5 text-[9px] font-bold whitespace-nowrap text-white">
                      La plus choisie
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={duree ? String(duree) : undefined}
            >
              <FormControl>
                <SelectTrigger className={triggerClass}>
                  <SelectValue placeholder="Choisir votre durée" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {durations.map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d} jour{d > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
              <FormDescription>La date et l&apos;heure d&apos;effet ne peuvent pas être antérieures à maintenant.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
