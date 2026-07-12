"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const DURATIONS = [
  { value: "1", label: "1 jour" },
  { value: "7", label: "7 jours" },
  { value: "30", label: "30 jours" },
  { value: "90", label: "90 j" },
]

export function HeroQuoteForm() {
  const [duration, setDuration] = useState("7")

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
      <h2 className="text-lg font-bold text-navy">Votre devis en 30 secondes</h2>
      <p className="mt-1 text-sm text-muted-foreground">Gratuit et sans engagement</p>

      <div className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero-plate">Immatriculation</Label>
          <Input id="hero-plate" placeholder="AB-123-CD" className="h-11 uppercase" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Durée souhaitée</Label>
          <div className="grid grid-cols-4 gap-2">
            {DURATIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={duration === item.value}
                onClick={() => setDuration(item.value)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-semibold transition-colors sm:text-sm",
                  duration === item.value
                    ? "border-primary bg-primary text-white"
                    : "border-border text-foreground/70 hover:border-primary/40"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hero-date">Date de début</Label>
            <Input id="hero-date" type="date" className="h-11" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hero-time">Heure</Label>
            <Input id="hero-time" type="time" defaultValue="08:00" className="h-11" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero-email">Email</Label>
          <Input id="hero-email" type="email" placeholder="vous@email.com" className="h-11" />
        </div>

        <Button asChild size="xl" variant="cta" className="w-full rounded-full">
          <Link href="/#quote">
            Comparer les offres
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          Paiement sécurisé · Données chiffrées · Aucun engagement
        </p>
      </div>
    </div>
  )
}
