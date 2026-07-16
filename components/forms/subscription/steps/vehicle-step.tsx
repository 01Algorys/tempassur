"use client"

import type { UseFormReturn } from "react-hook-form"
import { useTranslations } from "next-intl"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VEHICLE_TYPES } from "@/lib/constants"
import { EXCLUDED_RENTAL_AGENCIES, RENTAL_ELIGIBLE_SLUGS } from "@/lib/pricing-data"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const fieldClass = "h-11 rounded-lg"
const triggerClass = "h-11 w-full rounded-lg"

interface VehicleStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function VehicleStep({ form }: VehicleStepProps) {
  const t = useTranslations("wizard.vehicle")
  const tVehicles = useTranslations("vehicleTypes")
  const categorie = form.watch("categorie")
  const estVehiculeLocation = form.watch("estVehiculeLocation")
  const showRentalBlock = RENTAL_ELIGIBLE_SLUGS.includes(categorie)

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-bold text-navy">{t("heading")}</h3>

      <FormField
        control={form.control}
        name="categorie"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("categorie")}</FormLabel>
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
                  <SelectValue placeholder={t("categoriePlaceholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {VEHICLE_TYPES.map((vehicle) => (
                  <SelectItem key={vehicle.slug} value={vehicle.slug}>
                    {tVehicles(`${vehicle.slug}.label`)}
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
          name="immatriculation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("immatriculation")}</FormLabel>
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
              <FormLabel>{t("marque")}</FormLabel>
              <FormControl>
                <Input placeholder={t("marque")} className={fieldClass} {...field} />
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
              <FormLabel>{t("modele")}</FormLabel>
              <FormControl>
                <Input placeholder={t("modele")} className={fieldClass} {...field} />
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
              <FormLabel>{t("dateMiseEnCirculation")}</FormLabel>
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
              <FormItem className="flex flex-col gap-2">
                <FormLabel className="font-medium text-foreground">{t("location")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value ? "oui" : "non"}
                    onValueChange={(value) => field.onChange(value === "oui")}
                    className="flex items-center gap-6"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <RadioGroupItem value="oui" />
                      {t("locationOui")}
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <RadioGroupItem value="non" />
                      {t("locationNon")}
                    </label>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("locationExclusion", { agencies: EXCLUDED_RENTAL_AGENCIES.join(", ") })}
          </p>

          {estVehiculeLocation ? (
            <FormField
              control={form.control}
              name="nomAgenceLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("nomAgence")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("nomAgencePlaceholder")} className={fieldClass} {...field} />
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
