"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { loginSchema, type LoginSchema } from "@/lib/validations/auth-schema"

export function LoginForm() {
  const t = useTranslations("forms.login")
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 text-center text-sm text-navy">
        {t("successMessage")}
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("emailLabel")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("passwordLabel")}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" variant="cta" disabled={form.formState.isSubmitting} className="mt-1 w-full">
          {form.formState.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <>
              {t("submit")}
              <ArrowRight data-icon="inline-end" className="size-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
