"use client"

import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface DateRange {
  from: string
  to: string
}

export const EMPTY_RANGE: DateRange = { from: "", to: "" }

// Filtre "Créé du … au …" commun aux tableaux (dates incluses).
export function DateRangeFilter({
  value,
  onChange,
  label = "Créé",
}: {
  value: DateRange
  onChange: (value: DateRange) => void
  label?: string
}) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="whitespace-nowrap">{label} du</span>
      <Input type="date" className="w-36" value={value.from} onChange={(e) => onChange({ ...value, from: e.target.value })} />
      <span>au</span>
      <Input type="date" className="w-36" value={value.to} onChange={(e) => onChange({ ...value, to: e.target.value })} />
      {value.from || value.to ? (
        <Button variant="ghost" size="icon-sm" onClick={() => onChange(EMPTY_RANGE)} aria-label="Effacer les dates">
          <X className="size-4" />
        </Button>
      ) : null}
    </div>
  )
}

export function applyRange(params: URLSearchParams, range: DateRange, fromKey: string, toKey: string) {
  if (range.from) params.set(fromKey, range.from)
  if (range.to) params.set(toKey, range.to)
}
