"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { currencyFmt, dateFmt } from "@/lib/admin/labels"

export interface Facture {
  id: string
  numeroFacture: string
  montantTtc: number
  statutEnvoi: string
  dateGeneration: string
  fichierPdfUrl?: string
}

function proxiedFileUrl(url: string): string {
  const marker = "/api/files/"
  const idx = url.indexOf(marker)
  const rest = idx >= 0 ? url.slice(idx + marker.length) : url
  return `/api/admin/files/${rest}`
}

export function FacturesCard({ contratId, factures }: { contratId: string; factures: Facture[] }) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/crm/contrats/${contratId}/facture`, { method: "POST" })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message ?? "Échec de la génération de la facture.")
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Factures</CardTitle>
        <Button variant="outline" size="sm" disabled={generating} onClick={handleGenerate}>
          {generating ? "Génération..." : "Générer une facture"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {factures.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune facture générée.</p>
        ) : (
          factures.map((f) => (
            <a
              key={f.id}
              href={f.fichierPdfUrl ? proxiedFileUrl(f.fichierPdfUrl) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
            >
              <span className="flex items-center gap-2 font-mono text-xs">
                <FileText className="size-4 text-muted-foreground" />
                {f.numeroFacture}
              </span>
              <span>{currencyFmt(f.montantTtc)}</span>
              <span className="text-xs text-muted-foreground">{dateFmt(f.dateGeneration)}</span>
            </a>
          ))
        )}
      </CardContent>
    </Card>
  )
}
