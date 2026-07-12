"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, ArrowRight, Loader2, PartyPopper } from "lucide-react"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { submitQuoteRequest } from "@/lib/quote"
import {
  INSURANCE_TYPE_OPTIONS,
  quoteFormSchema,
  type QuoteFormSchema,
} from "@/lib/validations/quote-schema"

const fieldClass =
  "h-11 rounded-lg border-transparent bg-white text-navy placeholder:text-muted-foreground focus-visible:border-orange focus-visible:ring-orange/30"

const triggerClass =
  "w-full h-11 rounded-lg border-transparent bg-white text-navy data-placeholder:text-muted-foreground"

export function QuoteRequestForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [referenceId, setReferenceId] = useState<string | null>(null)

  const form = useForm<QuoteFormSchema>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      insuranceType: "",
      fullName: "",
      email: "",
      phone: "",
      vehicleInfo: "",
      message: "",
    },
  })

  async function onSubmit(values: QuoteFormSchema) {
    setStatus("idle")
    try {
      const { referenceId } = await submitQuoteRequest(values)
      setReferenceId(referenceId)
      setStatus("success")
      form.reset()
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 rounded-2xl bg-white/10 p-8 text-center"
      >
        <span className="flex size-16 items-center justify-center rounded-full bg-orange/20 text-orange-light">
          <PartyPopper className="size-8" />
        </span>
        <div>
          <h3 className="text-xl font-bold text-white">Quote request received!</h3>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            Reference <span className="font-mono font-semibold text-orange-light">{referenceId}</span>
            . Our team will email your personalized quote within a few minutes.
          </p>
        </div>
        <Button variant="outline" className="border-white/25 text-white hover:bg-white/10 hover:text-white" onClick={() => setStatus("idle")}>
          Request another quote
        </Button>
      </motion.div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" className={fieldClass} {...field} />
                </FormControl>
                <FormMessage className="text-orange-light" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" className={fieldClass} {...field} />
                </FormControl>
                <FormMessage className="text-orange-light" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+33 6 12 34 56 78" className={fieldClass} {...field} />
                </FormControl>
                <FormMessage className="text-orange-light" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insuranceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Insurance Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INSURANCE_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-orange-light" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vehicleInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/90">Vehicle Information (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 2021 Peugeot 208" className={fieldClass} {...field} />
              </FormControl>
              <FormMessage className="text-orange-light" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/90">Message (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more about the coverage you're looking for..."
                  rows={3}
                  className="rounded-lg border-transparent bg-white text-navy placeholder:text-muted-foreground focus-visible:border-orange focus-visible:ring-orange/30"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-orange-light" />
            </FormItem>
          )}
        />

        <AnimatePresence>
          {status === "error" ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
            >
              <AlertCircle className="size-4 shrink-0" />
              Something went wrong sending your request. Please try again.
            </motion.div>
          ) : null}
        </AnimatePresence>

        <Button type="submit" size="xl" variant="cta" disabled={form.formState.isSubmitting} className="mt-1 w-full rounded-full">
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" data-icon="inline-start" />
              Sending request...
            </>
          ) : (
            <>
              Submit
              <ArrowRight data-icon="inline-end" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
