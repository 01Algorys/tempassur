import type { SubscriptionFormValues } from "@/lib/validations/subscription-schema"
import type { VehicleSlug } from "@/types"

interface CreatePaymentIntentParams {
  values: SubscriptionFormValues
  categorie: VehicleSlug
  vehicleLabel: string
}

export async function createPaymentIntent({
  values,
  categorie,
  vehicleLabel,
}: CreatePaymentIntentParams): Promise<{ clientSecret: string; amount: number }> {
  const response = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      categorie,
      duree: values.duree,
      cvTier: values.cvTier,
      ptacTier: values.ptacTier,
      quadSubtype: values.quadSubtype,
      optionAssistance: values.optionAssistance,
      optionGarantieConducteur: values.optionGarantieConducteur,
      optionExtensionTn: values.optionExtensionTn,
      paysImmatriculation: values.paysImmatriculation,
      territoireImmatriculation: values.territoireImmatriculation,
      paysResidence: values.paysResidence,
      territoireResidence: values.territoireResidence,
      vehicleLabel,
      marque: values.marque,
      modele: values.modele,
      immatriculation: values.immatriculation,
      nom: values.nom,
      prenom: values.prenom,
      email: values.email,
    }),
  })

  if (!response.ok) {
    throw new Error("payment_intent_failed")
  }

  const data = (await response.json()) as { clientSecret?: string; amount?: number }
  if (!data.clientSecret) {
    throw new Error("payment_intent_missing_client_secret")
  }

  return { clientSecret: data.clientSecret, amount: data.amount ?? 0 }
}
