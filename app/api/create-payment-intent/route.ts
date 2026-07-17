import { NextRequest, NextResponse } from "next/server"

import { calculatePrice, isDomTomTerritory, type FormulaSelection } from "@/lib/pricing"
import { getStripe } from "@/lib/stripe"
import { VEHICLE_SLUGS, type VehicleSlug } from "@/types"

interface CreatePaymentIntentBody {
  categorie: VehicleSlug
  duree: number
  cvTier?: string
  ptacTier?: string
  quadSubtype?: string
  optionAssistance?: boolean
  optionGarantieConducteur?: boolean
  optionExtensionTn?: boolean
  paysImmatriculation: string
  territoireImmatriculation?: string
  paysResidence: string
  territoireResidence?: string
  vehicleLabel: string
  marque: string
  modele: string
  immatriculation: string
  nom: string
  prenom: string
  email: string
}

export async function POST(req: NextRequest) {
  let body: Partial<CreatePaymentIntentBody>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const {
    categorie,
    duree,
    cvTier,
    ptacTier,
    quadSubtype,
    optionAssistance,
    optionGarantieConducteur,
    optionExtensionTn,
    paysImmatriculation,
    territoireImmatriculation,
    paysResidence,
    territoireResidence,
    vehicleLabel,
    marque,
    modele,
    immatriculation,
    nom,
    prenom,
    email,
  } = body

  if (!categorie || !(VEHICLE_SLUGS as readonly string[]).includes(categorie)) {
    return NextResponse.json({ error: "invalid_categorie" }, { status: 400 })
  }
  if (!duree || !paysImmatriculation || !paysResidence || !email || !vehicleLabel) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  }

  // Recomputed server-side from the raw selection — never trust a client-supplied amount.
  const isDomTom =
    isDomTomTerritory(paysImmatriculation, territoireImmatriculation) ||
    isDomTomTerritory(paysResidence, territoireResidence)

  const selection: FormulaSelection = {
    duree,
    cvTier: cvTier as FormulaSelection["cvTier"],
    ptacTier: ptacTier as FormulaSelection["ptacTier"],
    quadSubtype: quadSubtype as FormulaSelection["quadSubtype"],
    optionAssistance,
    optionGarantieConducteur,
    optionExtensionTn,
    isDomTom,
  }

  const breakdown = calculatePrice(categorie, selection)
  if (!breakdown || breakdown.total <= 0) {
    return NextResponse.json({ error: "invalid_price" }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(breakdown.total * 100),
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `Assurance temporaire — ${vehicleLabel} — ${duree} jours — ${marque ?? ""} ${modele ?? ""} (${immatriculation ?? ""})`.trim(),
      metadata: {
        categorie,
        duree: String(duree),
        marque: marque ?? "",
        modele: modele ?? "",
        immatriculation: immatriculation ?? "",
        conducteur: `${prenom ?? ""} ${nom ?? ""}`.trim(),
      },
    })

    if (!paymentIntent.client_secret) {
      return NextResponse.json({ error: "payment_intent_creation_failed" }, { status: 502 })
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: breakdown.total,
    })
  } catch (error) {
    console.error("Stripe payment intent creation failed", error)
    return NextResponse.json({ error: "payment_intent_failed" }, { status: 502 })
  }
}
