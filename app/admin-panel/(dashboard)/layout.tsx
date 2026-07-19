import { redirect } from "next/navigation"

import { getAdminSession, getAdminToken } from "@/lib/admin/server-session"
import { crmAdminJson } from "@/lib/admin/crm-client"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { AdminInactivityWatcher } from "@/components/admin/inactivity-watcher"

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-suspenders: middleware already gates /admin-panel, but this layout
  // (and every server component under it) re-checks so a stale/tampered cookie
  // can never render protected content even if the middleware step is bypassed.
  const session = await getAdminSession()
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/admin-panel/login")
  }

  const token = await getAdminToken()
  let idleTimeoutMs: number | undefined
  if (token) {
    try {
      const settings = await crmAdminJson<{ security?: { sessionTimeoutMinutes?: number } }>("/api/settings", token)
      const minutes = settings.security?.sessionTimeoutMinutes
      if (typeof minutes === "number" && minutes > 0) idleTimeoutMs = minutes * 60 * 1000
    } catch {
      // fall back to the hook's default
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={session} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
      <AdminInactivityWatcher timeoutMs={idleTimeoutMs} />
    </div>
  )
}
