import { NextResponse } from "next/server"

import { getAdminSession } from "@/lib/admin/server-session"

export async function GET() {
  const session = await getAdminSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  return NextResponse.json({ user: session })
}
