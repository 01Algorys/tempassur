import { NextResponse } from "next/server"

import { ADMIN_TOKEN_COOKIE } from "@/lib/admin/session-cookie"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(ADMIN_TOKEN_COOKIE)
  return response
}
