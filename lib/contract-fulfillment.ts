import { transformCrmDevis } from "@/lib/crm"
import { getStripe } from "@/lib/stripe"
import type Stripe from "stripe"

export interface FulfillContractParams {
  paymentIntentId: string
  devisId: string
  marque?: string
  modele?: string
  immatriculation?: string
  dateEffet?: string
  heureEffet?: string
  duree?: number
}

export type FulfillContractResult =
  | { success: true; numero: string; contratId: string }
  | { success: false; error: string }

// Shared by /api/create-contract (called from the browser right after Stripe confirms
// payment in-page) and the /merci server component (which reconciles the case where that
// in-page call never ran — e.g. Stripe did a full off-page redirect for 3DS/local payment
// methods, or the tab closed before the retries finished). Never trust anything but the
// Stripe PaymentIntent itself for "was this actually paid" and the charged amount.
export async function fulfillContract(params: FulfillContractParams): Promise<FulfillContractResult> {
  const { paymentIntentId, devisId } = params

  let paymentIntent: Stripe.PaymentIntent
  try {
    paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId)
  } catch {
    return { success: false, error: "payment_intent_not_found" }
  }
  if (paymentIntent.status !== "succeeded") {
    return { success: false, error: "payment_not_succeeded" }
  }

  const prime = paymentIntent.amount / 100

  let dateEffet: string | undefined
  if (params.dateEffet && params.heureEffet) {
    const parsed = new Date(`${params.dateEffet}T${params.heureEffet}`)
    if (Number.isNaN(parsed.getTime())) {
      return { success: false, error: "invalid_date_effet" }
    }
    dateEffet = parsed.toISOString()
  }

  // Contrat.numero has no server-side auto-numbering; the Stripe payment intent id is
  // already globally unique, so deriving from it avoids a collision-prone counter.
  const numero = `WN-${new Date().getFullYear()}-${paymentIntentId.slice(-8).toUpperCase()}`

  try {
    // Transforms the devis saved at the "details" step into a contrat, keeping the
    // client/devis/contrat link intact instead of creating a disconnected record.
    // Idempotent server-side: a retry (or the /merci reconciliation) after a real
    // success just gets back the same contrat rather than creating a duplicate.
    const contrat = await transformCrmDevis(devisId, {
      numero,
      prime,
      dateEffet,
      dureeJours: params.duree,
      marque: params.marque,
      modele: params.modele,
      immatriculation: params.immatriculation,
    })

    return { success: true, numero: contrat.numero, contratId: contrat.id }
  } catch (error) {
    // The customer has already been charged — a CRM sync failure must never be surfaced
    // to them as a payment failure. Log for manual follow-up and let the caller proceed.
    console.error("CRM contract creation failed", error)
    return { success: false, error: "crm_sync_failed" }
  }
}
