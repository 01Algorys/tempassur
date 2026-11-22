import { NextResponse } from "next/server"

import { getAdminAccess, getAdminSession } from "@/lib/admin/server-session"
import { hasPermission } from "@/lib/admin/permissions"
import { getStripe } from "@/lib/stripe"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 })
  }
  if (!hasPermission(await getAdminAccess(), "paiements")) {
    return NextResponse.json({ message: "Accès non autorisé pour votre compte." }, { status: 403 })
  }

  const { id } = await params
  try {
    const paymentIntent = await getStripe().paymentIntents.retrieve(id)
    return NextResponse.json(paymentIntent)
  } catch {
    return NextResponse.json({ message: "Paiement introuvable." }, { status: 404 })
  }
}
