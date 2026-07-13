"use client"

import type { UseFormReturn } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES } from "@/lib/countries"
import { EXCLUDED_RENTAL_AGENCIES, RENTAL_ELIGIBLE_SLUGS } from "@/lib/pricing-data"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"
import type { VehicleSlug } from "@/types"

const fieldClass = "h-11 rounded-lg"
const triggerClass = "h-11 w-full rounded-lg"

interface VehicleStepProps {
  form: UseFormReturn<SubscriptionFormValues>
  slug: VehicleSlug
}

export function VehicleStep({ form, slug }: VehicleStepProps) {
  const estVehiculeLocation = form.watch("estVehiculeLocation")
  const showRentalBlock = RENTAL_ELIGIBLE_SLUGS.includes(slug)

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">Informations véhicule</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="immatriculation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immatriculation *</FormLabel>
              <FormControl>
                <Input placeholder="AA-123-AA" className={fieldClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marque"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marque *</FormLabel>
              <FormControl>
                <Input placeholder="Marque" className={fieldClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modele"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle *</FormLabel>
              <FormControl>
                <Input placeholder="Modèle" className={fieldClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateMiseEnCirculation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de 1ère mise en circulation *</FormLabel>
              <FormControl>
                <Input type="date" className={fieldClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {showRentalBlock ? (
        <div className="flex flex-col gap-4 rounded-2xl bg-surface p-4">
          <FormField
            control={form.control}
            name="estVehiculeLocation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-3">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-medium text-foreground">Véhicule de location</FormLabel>
              </FormItem>
            )}
          />

          <p className="text-xs leading-relaxed text-muted-foreground">
            Nous vous informons que nous n&apos;assurons pas les véhicules loués hors agence en France, ni les
            véhicules loués à l&apos;étranger, ni les véhicules loués dans les agences suivantes :{" "}
            {EXCLUDED_RENTAL_AGENCIES.join(", ")}.
          </p>

          {estVehiculeLocation ? (
            <FormField
              control={form.control}
              name="nomAgenceLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l&apos;agence de location</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'agence" className={fieldClass} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>
      ) : null}

      <FormField
        control={form.control}
        name="paysObtentionVehicule"
        render={({ field }) => (
          <FormItem className="sm:max-w-xs">
            <FormLabel>Pays d&apos;obtention *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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
    </div>
  )
}
