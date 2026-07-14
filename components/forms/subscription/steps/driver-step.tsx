"use client"

import type { UseFormReturn } from "react-hook-form"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES } from "@/lib/countries"
import { CIVILITE_OPTIONS, type SubscriptionFormValues } from "@/lib/validations/subscription-schema"

const fieldClass = "h-11 rounded-lg"
const triggerClass = "h-11 w-full rounded-lg"

interface DriverStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function DriverStep({ form }: DriverStepProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <h3 className="text-lg font-bold text-navy">Informations conducteur</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="civilite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Civilité *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CIVILITE_OPTIONS.map((option) => (
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
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" className={fieldClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre prénom" className={fieldClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateNaissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance *</FormLabel>
                <FormControl>
                  <Input type="date" className={fieldClass} {...field} />
                </FormControl>
                <FormDescription>Nos contrats sont réservés aux conducteurs d&apos;au moins 21 ans.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paysNaissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays de naissance *</FormLabel>
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
          <FormField
            control={form.control}
            name="telephoneFixe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone (fixe)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Numéro de téléphone fixe" className={fieldClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telephoneMobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile *</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Numéro de téléphone mobile" className={fieldClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Votre email" className={fieldClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adresse"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Adresse *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre adresse" className={fieldClass} {...field} />
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
                <FormLabel>Code postal *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre code postal" className={fieldClass} {...field} />
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
                <FormLabel>Ville *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre ville" className={fieldClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-lg font-bold text-navy">Permis de conduire</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="numeroPermis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de permis *</FormLabel>
                <FormControl>
                  <Input placeholder="Numéro de permis" className={fieldClass} {...field} />
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
                <FormLabel>Date d&apos;obtention *</FormLabel>
                <FormControl>
                  <Input type="date" className={fieldClass} {...field} />
                </FormControl>
                <FormDescription>Le permis doit avoir au moins 2 ans pour assurer votre véhicule.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paysObtentionPermis"
            render={({ field }) => (
              <FormItem>
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
      </div>
    </div>
  )
}
