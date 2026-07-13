import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

export async function submitSubscription(values: SubscriptionFormValues): Promise<{ referenceId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1200))

  if (process.env.NODE_ENV === "development") {
    console.info("Subscription submitted", values)
  }

  return { referenceId: `TA-${Date.now().toString(36).toUpperCase()}` }
}
