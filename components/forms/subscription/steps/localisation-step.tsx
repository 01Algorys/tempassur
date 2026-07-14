"use client"

import type { UseFormReturn } from "react-hook-form"
import { Info } from "lucide-react"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES } from "@/lib/countries"
import { FRANCE_TERRITORIES } from "@/lib/pricing-data"
import { isDomTomTerritory } from "@/lib/pricing"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const triggerClass = "h-11 w-full rounded-lg"

interface LocalisationStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function LocalisationStep({ form }: LocalisationStepProps) {
  const paysImmatriculation = form.watch("paysImmatriculation")
  const paysResidence = form.watch("paysResidence")
  const territoireImmatriculation = form.watch("territoireImmatriculation")
  const territoireResidence = form.watch("territoireResidence")

  const isDomTom =
    isDomTomTerritory(paysImmatriculation, territoireImmatriculation) ||
    isDomTomTerritory(paysResidence, territoireResidence)

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">Localisation</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="paysImmatriculation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays d&apos;immatriculation du véhicule *</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  if (value !== "FR") form.setValue("territoireImmatriculation", "")
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.label}
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
                <FormLabel>Département / territoire d&apos;immatriculation *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FRANCE_TERRITORIES.map((territory) => (
                      <SelectItem key={territory.value} value={territory.value}>
                        {territory.label}
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
              <FormLabel>Pays / territoire de résidence *</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  if (value !== "FR") form.setValue("territoireResidence", "")
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.label}
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
                <FormLabel>Département / territoire de résidence *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {FRANCE_TERRITORIES.map((territory) => (
                      <SelectItem key={territory.value} value={territory.value}>
                        {territory.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Un tarif spécifique DOM-TOM s&apos;applique aux départements et collectivités d&apos;outre-mer.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}
      </div>

      {isDomTom ? (
        <div className="flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-navy">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          Les tarifs applicables aux DOM-TOM diffèrent de ceux de la métropole.
        </div>
      ) : null}
    </div>
  )
}
