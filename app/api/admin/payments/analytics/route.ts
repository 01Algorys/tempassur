import { NextRequest, NextResponse } from "next/server"

import { getAdminAccess, getAdminSession } from "@/lib/admin/server-session"
import { hasPermission } from "@/lib/admin/permissions"
import { getPaymentsAnalytics } from "@/lib/admin/payments-analytics"

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 })
  }
  if (!hasPermission(await getAdminAccess(), "paiements")) {
    return NextResponse.json({ message: "Accès non autorisé pour votre compte." }, { status: 403 })
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
