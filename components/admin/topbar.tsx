"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Bell, LogOut, Moon, Sun, KeyRound, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAdminNotifications } from "@/lib/admin/hooks/use-admin-notifications"
import type { AdminTokenPayload } from "@/lib/admin/auth-token"
import { AdminMobileNav } from "@/components/admin/mobile-nav"

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  return `il y a ${Math.floor(hours / 24)} j`
}

export function AdminTopbar({ user }: { user: AdminTokenPayload }) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { notifications, unreadCount, markAllRead } = useAdminNotifications()

  useEffect(() => setMounted(true), [])

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    router.replace("/admin-panel/login")
    router.refresh()
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 lg:px-6 print:hidden">
      <div className="flex items-center gap-2 lg:hidden">
        <AdminMobileNav />
        <span className="font-heading text-sm font-semibold">Admin TempAssur</span>
      </div>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Changer le thème"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
        </Button>

        <DropdownMenu onOpenChange={(open) => !open && markAllRead()}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-4.5" />
              {unreadCount > 0 ? (
                <Badge className="absolute -top-1 -right-1 h-4.5 min-w-4.5 justify-center rounded-full px-1 text-[10px]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">Aucune notification pour le moment</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="flex flex-col gap-0.5 rounded-md px-2 py-2 text-sm hover:bg-muted">
                    <span className="font-medium">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.message}</span>
                    <span className="text-[11px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 pl-1.5">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {user.firstName?.[0]?.toUpperCase() ?? "A"}
              </span>
              <span className="hidden text-sm sm:inline">
                {user.firstName} {user.lastName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/admin-panel/settings?tab=security")}>
              <KeyRound /> Changer le mot de passe
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/admin-panel/settings")}>
              <User /> Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
              <LogOut /> Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
