import { NextRequest, NextResponse } from "next/server"

import {
  CRM_DEFAULT_DISTRIBUTEUR_ID,
  CRM_DEFAULT_PRODUIT_ID,
  CRM_DEFAULT_STATUT_CONTRAT_ID,
  createCrmClient,
  createCrmContrat,
} from "@/lib/crm"
import { getStripe } from "@/lib/stripe"

interface CreateContractBody {
  paymentIntentId: string
  nom: string
  prenom: string
  civilite?: string
  email: string
  telephoneMobile?: string
  adresse?: string
  codePostal?: string
  ville?: string
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

  const { paymentIntentId, nom, prenom, email } = body
  if (!paymentIntentId || !nom || !prenom || !email) {
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

  try {
    const client = await createCrmClient({
      nom,
      prenom,
      civilite: body.civilite,
      telephone: body.telephoneMobile,
      email,
      adresse: body.adresse,
      codePostal: body.codePostal,
      ville: body.ville,
    })

    const dateEffet =
      body.dateEffet && body.heureEffet ? new Date(`${body.dateEffet}T${body.heureEffet}`).toISOString() : undefined

    // Contrat.numero has no server-side auto-numbering; the Stripe payment intent id is
    // already globally unique, so deriving from it avoids a collision-prone counter.
    const numero = `WN-${new Date().getFullYear()}-${paymentIntentId.slice(-8).toUpperCase()}`

    const contrat = await createCrmContrat({
      clientId: client.id,
      numero,
      marque: body.marque,
      modele: body.modele,
      immatriculation: body.immatriculation,
      dateEffet,
      dureeJours: body.duree,
      prime,
      distributeurId: CRM_DEFAULT_DISTRIBUTEUR_ID,
      produitId: CRM_DEFAULT_PRODUIT_ID,
      statutRefId: CRM_DEFAULT_STATUT_CONTRAT_ID,
    })

    return NextResponse.json({ success: true, numero: contrat.numero, contratId: contrat.id })
  } catch (error) {
    // The customer has already been charged — a CRM sync failure must never be surfaced
    // to them as a payment failure. Log for manual follow-up and let the caller proceed.
    console.error("CRM contract creation failed", error)
    return NextResponse.json({ success: false, error: "crm_sync_failed" }, { status: 502 })
  }
}
