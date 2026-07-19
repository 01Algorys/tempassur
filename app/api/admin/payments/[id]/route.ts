import { NextResponse } from "next/server"

import { getAdminSession } from "@/lib/admin/server-session"
import { getStripe } from "@/lib/stripe"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Non autorisé." }, { status: 401 })
  }

  const { id } = await params
  try {
    const paymentIntent = await getStripe().paymentIntents.retrieve(id)
    return NextResponse.json(paymentIntent)
  } catch {
    return NextResponse.json({ message: "Paiement introuvable." }, { status: 404 })
  }
}
