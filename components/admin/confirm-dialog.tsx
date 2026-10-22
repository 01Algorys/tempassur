"use client"

import { useEffect, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Modale de confirmation commune (suppressions, changements de statut,
// restauration). `confirmWord` impose de taper un mot pour les actions les
// plus destructrices. onConfirm peut lever une erreur : elle est affichée et
// la modale reste ouverte.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  destructive = false,
  confirmWord,
  children,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  confirmLabel?: string
  destructive?: boolean
  confirmWord?: string
  children?: ReactNode
  onConfirm: () => Promise<void> | void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typed, setTyped] = useState("")

  useEffect(() => {
    if (open) {
      setError(null)
      setTyped("")
    }
  }, [open])

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  const blocked = !!confirmWord && typed !== confirmWord

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
        {confirmWord ? (
          <div className="space-y-1.5">
            <p className="text-sm text-muted-foreground">
              Tapez <span className="font-mono font-semibold text-foreground">{confirmWord}</span> pour confirmer.
            </p>
            <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus />
          </div>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button variant={destructive ? "destructive" : "default"} onClick={handleConfirm} disabled={loading || blocked}>
            {loading ? "Patientez..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Raccourci : lève l'erreur renvoyée par le CRM (message) si la réponse n'est pas OK.
export async function ensureOk(res: Response, fallback: string): Promise<Response> {
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message ?? fallback)
  }
  return res
}
