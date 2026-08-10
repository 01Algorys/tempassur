"use client"

import { useEffect, useRef, useState } from "react"
import { Search, UserPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ClientOption {
  id: string
  nom?: string | null
  prenom?: string | null
  email?: string | null
}

function NewClientForm({
  onCreated,
  onCancel,
}: {
  onCreated: (client: ClientOption) => void
  onCancel: () => void
}) {
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [telephoneMobile, setTelephoneMobile] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      setError("Nom, prénom et email sont requis.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/create-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, email, telephoneMobile: telephoneMobile || undefined }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.success || !data?.clientId) {
        setError("Échec de la création du client.")
        return
      }
      onCreated({ id: data.clientId, nom, prenom, email })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Prénom *" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        <Input placeholder="Nom *" value={nom} onChange={(e) => setNom(e.target.value)} />
      </div>
      <Input placeholder="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Téléphone" value={telephoneMobile} onChange={(e) => setTelephoneMobile(e.target.value)} />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" size="sm" onClick={handleCreate} disabled={submitting}>
          {submitting ? "Création..." : "Créer le client"}
        </Button>
      </div>
    </div>
  )
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
  const [creating, setCreating] = useState(false)
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

  if (creating) {
    return (
      <NewClientForm
        onCreated={(client) => {
          setCreating(false)
          setQuery("")
          onChange(client)
        }}
        onCancel={() => setCreating(false)}
      />
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
        <Button type="button" variant="outline" size="icon" title="Nouveau client" onClick={() => setCreating(true)}>
          <UserPlus className="size-4" />
        </Button>
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
