import { NextRequest, NextResponse } from "next/server"

import { getAdminSession } from "@/lib/admin/server-session"
import { getPaymentsAnalytics } from "@/lib/admin/payments-analytics"

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 })
  }

  const months = Number(req.nextUrl.searchParams.get("months") ?? "12")

  try {
    const analytics = await getPaymentsAnalytics(months)
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("[admin/payments/analytics] Stripe fetch failed", error)
    return NextResponse.json({ message: "Échec de récupération des paiements Stripe." }, { status: 502 })
  }
}
