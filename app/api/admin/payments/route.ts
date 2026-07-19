import { NextRequest, NextResponse } from "next/server"

import { getAdminSession } from "@/lib/admin/server-session"
import { getStripe } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const status = searchParams.get("status") // succeeded | processing | requires_payment_method | canceled
  const startingAfter = searchParams.get("startingAfter") ?? undefined
  const q = searchParams.get("q")?.trim()
  const dateFrom = searchParams.get("dateFrom")
  const dateTo = searchParams.get("dateTo")
  const limit = Math.min(Number(searchParams.get("limit") ?? "25") || 25, 100)

  const stripe = getStripe()
  const created =
    dateFrom || dateTo
      ? {
          ...(dateFrom ? { gte: Math.floor(new Date(dateFrom).getTime() / 1000) } : {}),
          ...(dateTo ? { lte: Math.floor((new Date(dateTo).getTime() + 86400000) / 1000) } : {}),
        }
      : undefined

  try {
    if (q) {
      const clauses = [`(metadata['conducteur']:"${q}" OR receipt_email:"${q}")`]
      if (status) clauses.push(`status:"${status}"`)
      const result = await stripe.paymentIntents.search({
        query: clauses.join(" AND "),
        limit,
      })
      return NextResponse.json({
        payments: result.data,
        hasMore: result.has_more,
        nextStartingAfter: null,
      })
    }

    const result = await stripe.paymentIntents.list({
      limit,
      starting_after: startingAfter,
      ...(created ? { created } : {}),
    })

    const filtered = status ? result.data.filter((p) => p.status === status) : result.data

    return NextResponse.json({
      payments: filtered,
      hasMore: result.has_more,
      nextStartingAfter: result.data.length ? result.data[result.data.length - 1].id : null,
    })
  } catch (error) {
    console.error("[admin/payments] Stripe list failed", error)
    return NextResponse.json({ message: "Échec de récupération des paiements Stripe." }, { status: 502 })
  }
}
