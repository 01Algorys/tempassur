import { NextRequest, NextResponse } from "next/server"

import { transformCrmDevis } from "@/lib/crm"
import { getStripe } from "@/lib/stripe"

interface CreateContractBody {
  paymentIntentId: string
  devisId: string
  marque?: string
  modele?: string
  immatriculation?: string
  dateEffet?: string
  heureEffet?: string
  duree?: number
}

export async function POST(req: NextRequest) {
  let body: Partial<CreateContractBody>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json" }, { status: 400 })
  }

  const { paymentIntentId, devisId } = body
  if (!paymentIntentId || !devisId) {
    return NextResponse.json({ success: false, error: "missing_fields" }, { status: 400 })
  }

  let paymentIntent
  try {
    paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId)
  } catch {
    return NextResponse.json({ success: false, error: "payment_intent_not_found" }, { status: 400 })
  }
  if (paymentIntent.status !== "succeeded") {
    return NextResponse.json({ success: false, error: "payment_not_succeeded" }, { status: 400 })
  }

  // The amount actually charged in Stripe is the only trustworthy source for the premium.
  const prime = paymentIntent.amount / 100

  let dateEffet: string | undefined
  if (body.dateEffet && body.heureEffet) {
    const parsed = new Date(`${body.dateEffet}T${body.heureEffet}`)
    if (Number.isNaN(parsed.getTime())) {
      return NextResponse.json({ success: false, error: "invalid_date_effet" }, { status: 400 })
    }
    dateEffet = parsed.toISOString()
  }

  // Contrat.numero has no server-side auto-numbering; the Stripe payment intent id is
  // already globally unique, so deriving from it avoids a collision-prone counter.
  const numero = `WN-${new Date().getFullYear()}-${paymentIntentId.slice(-8).toUpperCase()}`

  try {
    // Transforms the devis saved at the "details" step into a contrat, keeping the
    // client/devis/contrat link intact instead of creating a disconnected record.
    const contrat = await transformCrmDevis(devisId, {
      numero,
      prime,
      dateEffet,
      dureeJours: body.duree,
      marque: body.marque,
      modele: body.modele,
      immatriculation: body.immatriculation,
    })

    return NextResponse.json({ success: true, numero: contrat.numero, contratId: contrat.id })
  } catch (error) {
    // The customer has already been charged — a CRM sync failure must never be surfaced
    // to them as a payment failure. Log for manual follow-up and let the caller proceed.
    console.error("CRM contract creation failed", error)
    return NextResponse.json({ success: false, error: "crm_sync_failed" }, { status: 502 })
  }
}
