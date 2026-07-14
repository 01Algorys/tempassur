"use client"

import type { UseFormReturn } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VEHICLE_TYPES } from "@/lib/constants"
import { getPricingConfig } from "@/lib/pricing"
import { CV_TIER_OPTIONS, EXCLUDED_RENTAL_AGENCIES, PTAC_TIER_OPTIONS, QUAD_SUBTYPE_OPTIONS, RENTAL_ELIGIBLE_SLUGS } from "@/lib/pricing-data"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const fieldClass = "h-11 rounded-lg"
const triggerClass = "h-11 w-full rounded-lg"

interface VehicleStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function VehicleStep({ form }: VehicleStepProps) {
  const categorie = form.watch("categorie")
  const estVehiculeLocation = form.watch("estVehiculeLocation")
  const pricingConfig = getPricingConfig(categorie)
  const showRentalBlock = RENTAL_ELIGIBLE_SLUGS.includes(categorie)

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">Véhicule</h3>

      <FormField
        control={form.control}
        name="categorie"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Catégorie *</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                form.setValue("cvTier", undefined)
                form.setValue("ptacTier", undefined)
                form.setValue("quadSubtype", undefined)
                form.setValue("duree", 0)
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className={triggerClass}>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {VEHICLE_TYPES.map((vehicle) => (
                  <SelectItem key={vehicle.slug} value={vehicle.slug}>
                    {vehicle.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {pricingConfig.needsCvTier ? (
          <FormField
            control={form.control}
            name="cvTier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Puissance fiscale *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CV_TIER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {pricingConfig.needsPtacTier ? (
          <FormField
            control={form.control}
            name="ptacTier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Poids total autorisé en charge *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PTAC_TIER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {pricingConfig.needsQuadSubtype ? (
          <FormField
            control={form.control}
            name="quadSubtype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de véhicule *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {QUAD_SUBTYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
    </div>
  )
}
