import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"

interface CreateContractParams {
  paymentIntentId: string
  devisId: string
  values: SubscriptionFormValues
}

// Never throws: the payment already succeeded by the time this is called, so a CRM sync
// failure must not block the customer — the caller proceeds to the confirmation page either way.
export async function createContract({
  paymentIntentId,
  devisId,
  values,
}: CreateContractParams): Promise<{ success: boolean; numero?: string }> {
  try {
    const response = await fetch("/api/create-contract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId,
        devisId,
        marque: values.marque,
        modele: values.modele,
        immatriculation: values.immatriculation,
        dateEffet: values.dateEffet,
        heureEffet: values.heureEffet,
        duree: values.duree,
      }),
    })

    if (!response.ok) return { success: false }
    const data = (await response.json()) as { success?: boolean; numero?: string }
    return { success: !!data.success, numero: data.numero }
  } catch {
    return { success: false }
  }
}
