"use client"

import Link from "next/link"
import type { UseFormReturn } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

import { FileUploadField } from "../file-upload-field"

interface DocumentsStepProps {
  form: UseFormReturn<SubscriptionFormValues>
}

export function DocumentsStep({ form }: DocumentsStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-navy">Importer vos documents</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="permisRecto"
            render={({ field }) => (
              <FormItem>
                <FileUploadField
                  id="permisRecto"
                  label="Permis de conduire (recto)"
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="permisVerso"
            render={({ field }) => (
              <FormItem>
                <FileUploadField
                  id="permisVerso"
                  label="Permis de conduire (verso)"
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carteGrise"
            render={({ field }) => (
              <FormItem>
                <FileUploadField id="carteGrise" label="Carte grise" value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="autresDocuments"
            render={({ field }) => (
              <FormItem>
                <FileUploadField
                  id="autresDocuments"
                  label="Autres documents"
                  value={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="consentIpid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border p-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
              </FormControl>
              <div className="flex flex-col gap-1">
                <FormLabel className="text-sm font-normal text-foreground">
                  Je reconnais avoir pris connaissance du Document d&apos;information sur le produit
                  d&apos;assurance IPID et de l&apos;accepter.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consentAttestation"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border p-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
              </FormControl>
              <div className="flex flex-col gap-1">
                <FormLabel className="text-sm font-normal text-foreground">
                  Je reconnais avoir pris connaissance et accepter l&apos;Attestation sur l&apos;honneur et
                  conditions d&apos;éligibilité.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consentCgv"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-3 rounded-xl border border-border p-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
              </FormControl>
              <div className="flex flex-col gap-1">
                <FormLabel className="text-sm font-normal text-foreground">
                  Je reconnais avoir pris connaissance des{" "}
                  <Link
                    href="/conditions-generales-de-vente"
                    target="_blank"
                    className="font-medium text-primary underline underline-offset-2"
                  >
                    Conditions Générales
                  </Link>
                  .
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
