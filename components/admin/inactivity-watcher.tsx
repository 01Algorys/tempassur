"use client"

import { useInactivityLogout } from "@/lib/admin/hooks/use-inactivity-logout"

export function AdminInactivityWatcher({ timeoutMs }: { timeoutMs?: number }) {
  useInactivityLogout(timeoutMs)
  return null
}
