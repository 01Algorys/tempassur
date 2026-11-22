import { NextResponse } from "next/server"

import { getAdminAccess, getAdminSession } from "@/lib/admin/server-session"

export async function GET() {
  const session = await getAdminSession()
  const access = session ? await getAdminAccess() : null
  if (!session || !access || (access.role !== "SUPER_ADMIN" && access.role !== "ADMIN")) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  return NextResponse.json({ user: { ...session, role: access.role, permissions: access.permissions } })
}
