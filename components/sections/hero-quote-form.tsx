"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VEHICLE_TYPES } from "@/lib/constants"
import { cn } from "@/lib/utils"

const DURATIONS = [
  { value: "1", label: "1 jour" },
  { value: "7", label: "7 jours" },
  { value: "30", label: "30 jours" },
  { value: "90", label: "90 j" },
]

export function HeroQuoteForm() {
  const router = useRouter()
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("7")
  const [email, setEmail] = useState("")

  function handleContinue() {
    if (!category) return

    const params = new URLSearchParams()
    if (duration) params.set("duree", duration)
    if (email) params.set("email", email)

    const query = params.toString()
    router.push(`/assurance/${category}${query ? `?${query}` : ""}#souscription`)
  }

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-slate-900/10 sm:p-8">
      <h2 className="text-lg font-bold text-navy">Votre devis en 30 secondes</h2>
      <p className="mt-1 text-sm text-muted-foreground">Gratuit et sans engagement</p>

      <div className="mt-6 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero-category">Catégorie de véhicule</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="hero-category" className="h-11 w-full rounded-lg">
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((vehicle) => (
                <SelectItem key={vehicle.slug} value={vehicle.slug}>
                  {vehicle.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hero-email">Email</Label>
          <Input
            id="hero-email"
            type="email"
            placeholder="vous@email.com"
            className="h-11"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <Button
          type="button"
          size="xl"
          variant="cta"
          className="w-full rounded-full"
          disabled={!category}
          onClick={handleContinue}
        >
          Continuez
          <ArrowRight data-icon="inline-end" />
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Lock className="size-3.5" />
          Paiement sécurisé · Données chiffrées · Aucun engagement
        </p>
      </div>
    </div>
  )
}
