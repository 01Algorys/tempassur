import type { QuoteFormSchema } from "@/lib/validations/quote-schema"

export async function submitQuoteRequest(values: QuoteFormSchema): Promise<{ referenceId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  if (process.env.NODE_ENV === "development") {
    console.info("Quote request submitted", values)
  }

  return { referenceId: `TA-${Date.now().toString(36).toUpperCase()}` }
}
