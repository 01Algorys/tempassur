"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"

interface ClientOption {
  id: string
  nom?: string | null
  prenom?: string | null
  email?: string | null
}

export function ClientPicker({
  value,
  selected,
  onChange,
}: {
  value: string | undefined
  selected: ClientOption | null
  onChange: (client: ClientOption | null) => void
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ClientOption[]>([])
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
        .then((data) => !cancelled && setResults(Array.isArray(data) ? data : []))
        .finally(() => !cancelled && setLoading(false))
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (value && selected) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">
            {[selected.prenom, selected.nom].filter(Boolean).join(" ") || "Client sans nom"}
          </p>
          {selected.email ? <p className="truncate text-xs text-muted-foreground">{selected.email}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(null)
            setQuery("")
          }}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
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
      {open && query.trim() ? (
        <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-white shadow-lg dark:bg-card">
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
                <span className="font-medium text-foreground">
                  {[c.prenom, c.nom].filter(Boolean).join(" ") || "Client sans nom"}
                </span>
                {c.email ? <span className="text-xs text-muted-foreground">{c.email}</span> : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
