"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { siteConfig, whatsappUrl } from "@/lib/site"

const SUBJECTS = ["Souscription", "Paiement", "Attestation", "Réclamation", "Autre"] as const

const contactSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().min(1, "L'email est requis").email("Entrez une adresse email valide"),
  telephone: z.string().optional().or(z.literal("")),
  sujet: z.enum(SUBJECTS),
  message: z.string().min(1, "Le message est requis"),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nom: "", email: "", telephone: "", sujet: "Souscription", message: "" },
  })

  async function onSubmit(values: ContactFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (process.env.NODE_ENV === "development") {
      console.info("Contact form submitted", values)
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-secondary p-6 text-center">
        <p className="font-semibold text-navy">
          Merci ! Votre message est bien envoyé, nous revenons vers vous rapidement.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Urgent ?{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
            WhatsApp : {siteConfig.phone}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom *</FormLabel>
              <FormControl>
                <Input className="h-11 rounded-lg" placeholder="Votre nom" {...field} />
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
                <Input type="email" className="h-11 rounded-lg" placeholder="vous@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input type="tel" className="h-11 rounded-lg" placeholder="Votre téléphone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sujet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sujet *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full rounded-lg">
                    <SelectValue placeholder="Sélectionnez un sujet" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
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
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message *</FormLabel>
              <FormControl>
                <Textarea rows={5} className="rounded-lg" placeholder="Votre message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="cta" className="rounded-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" data-icon="inline-start" /> : null}
          Envoyer
        </Button>
      </form>
    </Form>
  )
}
