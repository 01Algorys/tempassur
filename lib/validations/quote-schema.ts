import { z } from "zod"

export const quoteFormSchema = z.object({
  insuranceType: z.string().min(1, "Please select an insurance type"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .min(6, "Enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+()\s-]+$/, "Enter a valid phone number"),
  vehicleInfo: z.string().max(120, "Keep this under 120 characters").optional().or(z.literal("")),
  message: z.string().max(500, "Keep your message under 500 characters").optional().or(z.literal("")),
})

export type QuoteFormSchema = z.infer<typeof quoteFormSchema>

export const INSURANCE_TYPE_OPTIONS = [
  { value: "auto", label: "Auto Insurance" },
  { value: "temporary", label: "Temporary Insurance" },
  { value: "motorcycle", label: "Motorcycle Insurance" },
  { value: "home", label: "Home Insurance" },
  { value: "travel", label: "Travel Insurance" },
  { value: "business", label: "Business Insurance" },
] as const
