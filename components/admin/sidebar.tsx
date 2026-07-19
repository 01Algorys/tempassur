"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  FileSignature,
  CreditCard,
  Mail,
  BarChart3,
  ScrollText,
  Settings,
  ShieldCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"

export const ADMIN_NAV_ITEMS = [
  { href: "/admin-panel", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { href: "/admin-panel/quotes", label: "Devis", icon: FileText },
  { href: "/admin-panel/contracts", label: "Contrats", icon: FileSignature },
  { href: "/admin-panel/payments", label: "Paiements", icon: CreditCard },
  { href: "/admin-panel/emails", label: "Emails", icon: Mail },
  { href: "/admin-panel/reports", label: "Rapports", icon: BarChart3 },
  { href: "/admin-panel/audit-logs", label: "Journaux d'audit", icon: ScrollText },
  { href: "/admin-panel/settings", label: "Paramètres", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex print:hidden">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <ShieldCheck className="size-4.5" />
        </div>
        <span className="font-heading text-sm font-semibold text-sidebar-foreground">Admin TempAssur</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {ADMIN_NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
