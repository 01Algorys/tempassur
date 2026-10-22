"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { exportToCsv, exportToExcel, exportToPdf } from "@/lib/admin/export"
import type { ExportColumn } from "@/lib/admin/export-columns"
import { cn } from "@/lib/utils"

type Format = "pdf" | "csv" | "xlsx"

const FORMATS: { value: Format; label: string }[] = [
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel (XLS)" },
]

// Modale d'export : format + champs à inclure. Les lignes sont chargées au
// moment de l'export (toutes les lignes correspondant aux filtres, pas
// seulement la page affichée) ; les colonnes dépendent des lignes chargées
// (clés de `details` inconnues du catalogue incluses).
export function ExportDialog<T>({
  open,
  onOpenChange,
  title,
  filename,
  loadRows,
  buildColumns,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  filename: string
  loadRows: () => Promise<T[]>
  buildColumns: (rows: T[]) => ExportColumn<T>[]
}) {
  const [format, setFormat] = useState<Format>("xlsx")
  const [rows, setRows] = useState<T[] | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setRows(null)
    setError(null)
    setLoading(true)
    loadRows()
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setSelected(new Set(buildColumns(data).map((c) => c.key)))
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Échec du chargement."))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const columns = useMemo(() => (rows ? buildColumns(rows) : []), [rows, buildColumns])
  const groups = useMemo(() => {
    const map = new Map<string, ExportColumn<T>[]>()
    for (const c of columns) map.set(c.group, [...(map.get(c.group) ?? []), c])
    return [...map.entries()]
  }, [columns])

  const allSelected = columns.length > 0 && selected.size === columns.length

  function toggle(keys: string[], checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      for (const k of keys) {
        if (checked) next.add(k)
        else next.delete(k)
      }
      return next
    })
  }

  async function handleExport() {
    if (!rows) return
    const cols = columns.filter((c) => selected.has(c.key))
    const data = rows.map((row) => Object.fromEntries(cols.map((c) => [c.label, c.value(row) ?? ""])))
    const stamped = `${filename}-${new Date().toISOString().slice(0, 10)}`
    if (format === "csv") exportToCsv(stamped, data)
    else if (format === "xlsx") exportToExcel(stamped, data)
    else await exportToPdf(stamped, data, title)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {rows ? `${rows.length} ligne(s) correspondant aux filtres actuels.` : "Chargement des données..."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Format</p>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  format === f.value ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Chargement...
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox checked={allSelected} onCheckedChange={(v) => toggle(columns.map((c) => c.key), v === true)} />
              Tout sélectionner ({selected.size}/{columns.length} champs)
            </label>
            <div className="max-h-[45vh] space-y-4 overflow-y-auto rounded-lg border border-border p-3">
              {groups.map(([group, cols]) => {
                const groupKeys = cols.map((c) => c.key)
                const groupAll = groupKeys.every((k) => selected.has(k))
                return (
                  <div key={group} className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      <Checkbox checked={groupAll} onCheckedChange={(v) => toggle(groupKeys, v === true)} />
                      {group}
                    </label>
                    <div className="grid gap-1.5 pl-6 sm:grid-cols-2 lg:grid-cols-3">
                      {cols.map((c) => (
                        <Label key={c.key} className="flex items-center gap-2 text-sm font-normal">
                          <Checkbox checked={selected.has(c.key)} onCheckedChange={(v) => toggle([c.key], v === true)} />
                          <span className="truncate">{c.label}</span>
                        </Label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleExport} disabled={!rows || rows.length === 0 || selected.size === 0}>
            <Download /> Exporter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
