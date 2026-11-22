import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { navItemsFor } from "@/components/admin/nav-items"
import type { AdminAccess } from "@/lib/admin/permissions"

// Page hors des rubriques du compte (administrateur à accès limité) : on l'explique et on
// propose les rubriques ouvertes. Sert aussi d'accueil quand la vue d'ensemble n'est pas cochée.
export function AdminAccessDenied({ access, firstName, isHome }: { access: AdminAccess; firstName?: string; isHome: boolean }) {
  const items = navItemsFor(access)
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-muted-foreground" />
          {isHome ? `Bienvenue${firstName ? ` ${firstName}` : ""}` : "Accès non autorisé"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          {isHome
            ? "Voici les rubriques ouvertes pour votre compte."
            : "Cette rubrique n'est pas ouverte pour votre compte. Demandez l'accès à un super administrateur si vous en avez besoin."}
        </p>
        {items.length ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 font-medium hover:bg-accent">
                    <Icon className="size-4" /> {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-muted-foreground">Aucune rubrique n&apos;est encore ouverte pour votre compte.</p>
        )}
      </CardContent>
    </Card>
  )
}
