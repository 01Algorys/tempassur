import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Mise en page des formulaires plein écran de l'admin (contrats, devis, clients) :
// lien retour, titre, sections en cartes et barre d'actions collée en bas de l'écran.

export function FormPage({
  title,
  description,
  backHref,
  backLabel,
  children,
}: {
  title: string
  description?: React.ReactNode
  backHref: string
  backLabel: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {backLabel}
      </Link>
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  )
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5", className)}>
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

/** Grille des champs : 2 colonnes, 3 sur grand écran. */
export function FormGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>{children}</div>
}

export function FormField({ label, children, full }: { label: React.ReactNode; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "space-y-1.5 sm:col-span-full" : "space-y-1.5"}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

/** Barre d'actions toujours visible en bas de la zone de défilement. */
export function FormActions({ error, children }: { error?: string | null; children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-end gap-2">
        {error ? <p className="mr-auto text-sm text-destructive">{error}</p> : null}
        {children}
      </div>
    </div>
  )
}
