"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShieldCheck } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ADMIN_NAV_ITEMS } from "@/components/admin/sidebar"
import { cn } from "@/lib/utils"

export function AdminMobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-navy text-navy-foreground">
              <ShieldCheck className="size-4" />
            </span>
            Admin TempAssur
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:bg-accent/60"
                )}
              >
                <Icon className="size-4.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
