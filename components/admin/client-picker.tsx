"use client"

import { useEffect, useRef, useState } from "react"
import { Search, UserPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { allPhones, clientFullName, type ClientRecord } from "@/lib/admin/crm-types"

// Recherche d'un client existant (nom, prénom, email, téléphone). Le bouton
// "Nouveau client" laisse le parent afficher le formulaire complet.
export function ClientPicker({
  selected,
  onChange,
  onCreateNew,
  excludeId,
}: {
  selected: ClientRecord | null
  onChange: (client: ClientRecord | null) => void
  onCreateNew?: () => void
  excludeId?: string
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ClientRecord[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    let cancelled = false
    setLoading(true)
    const t = setTimeout(() => {
      fetch(`/api/admin/crm/clients?q=${encodeURIComponent(query.trim())}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (cancelled) return
          const list = Array.isArray(data) ? (data as ClientRecord[]) : []
          setResults(excludeId ? list.filter((c) => c.id !== excludeId) : list)
        })
        .finally(() => !cancelled && setLoading(false))
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [query, excludeId])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{clientFullName(selected) || "Client sans nom"}</p>
          <p className="truncate text-xs text-muted-foreground">
            {[selected.email, allPhones(selected)[0]].filter(Boolean).join(" · ")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(null)
            setQuery("")
          }}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Changer de client"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Rechercher un client (nom, email, téléphone)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
          />
        </div>
        {onCreateNew ? (
          <Button type="button" variant="outline" onClick={onCreateNew}>
            <UserPlus className="size-4" /> Nouveau client
          </Button>
        ) : null}
      </div>
      {open && query.trim() ? (
        <div className="absolute top-full z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-white shadow-lg dark:bg-card">
          {loading ? (
            <p className="p-3 text-sm text-muted-foreground">Recherche...</p>
          ) : results.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">Aucun client trouvé.</p>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onChange(c)
                  setOpen(false)
                }}
                className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-muted/60"
              >
                <span className="font-medium text-foreground">{clientFullName(c) || "Client sans nom"}</span>
                <span className="text-xs text-muted-foreground">
                  {[c.email, allPhones(c)[0]].filter(Boolean).join(" · ")}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
