"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { siteConfig, whatsappUrl } from "@/lib/site"

const SUBJECTS = ["souscription", "paiement", "attestation", "reclamation", "autre"] as const

export function ContactForm() {
  const t = useTranslations("forms.contact")
  const [submitted, setSubmitted] = useState(false)

  const contactSchema = z.object({
    nom: z.string().min(1, t("nomRequired")),
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    telephone: z.string().optional().or(z.literal("")),
    sujet: z.enum(SUBJECTS),
    message: z.string().min(1, t("messageRequired")),
  })

  type ContactFormValues = z.infer<typeof contactSchema>

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nom: "", email: "", telephone: "", sujet: "souscription", message: "" },
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
        <p className="font-semibold text-navy">{t("successTitle")}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("successUrgent")}{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
            {t("successWhatsapp", { phone: siteConfig.phone })}
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
              <FormLabel>{t("nomLabel")}</FormLabel>
              <FormControl>
                <Input className="h-11 rounded-lg" placeholder={t("nomPlaceholder")} {...field} />
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
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input type="email" className="h-11 rounded-lg" placeholder={t("emailPlaceholder")} {...field} />
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
              <FormLabel>{t("telephoneLabel")}</FormLabel>
              <FormControl>
                <Input type="tel" className="h-11 rounded-lg" placeholder={t("telephonePlaceholder")} {...field} />
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
              <FormLabel>{t("sujetLabel")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full rounded-lg">
                    <SelectValue placeholder={t("sujetPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {t(`subjects.${subject}`)}
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
              <FormLabel>{t("messageLabel")}</FormLabel>
              <FormControl>
                <Textarea rows={5} className="rounded-lg" placeholder={t("messagePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="cta" className="rounded-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" data-icon="inline-start" /> : null}
          {t("submit")}
        </Button>
      </form>
    </Form>
  )
}
