import { NextRequest, NextResponse } from "next/server"

import { fulfillContract } from "@/lib/contract-fulfillment"

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

  const result = await fulfillContract({
    paymentIntentId,
    devisId,
    marque: body.marque,
    modele: body.modele,
    immatriculation: body.immatriculation,
    dateEffet: body.dateEffet,
    heureEffet: body.heureEffet,
    duree: body.duree,
  })

  if (!result.success) {
    const status = result.error === "payment_intent_not_found" || result.error === "payment_not_succeeded" || result.error === "invalid_date_effet" ? 400 : 502
    return NextResponse.json(result, { status })
  }

  return NextResponse.json(result)
}
