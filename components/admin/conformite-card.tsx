"use client"

import { useCallback, useEffect, useState } from "react"
import { RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConformiteBadge } from "@/components/admin/conformite-badge"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { dateFmt, dateTimeFmt } from "@/lib/admin/labels"

// Contrôle LCB-FT du client via Efficiale (gel des avoirs, PPE nationales et
// internationales). Lancé à la main ; une correspondance prévient l'équipe par email
// mais ne bloque ni la souscription ni le contrat.

const LIST_LABELS: Record<string, string> = {
  gel: "Gel des avoirs",
  ppe_nat: "PPE nationale",
  ppe_inter: "PPE internationale",
  all: "Gel des avoirs + PPE",
}

const ALERT_STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "À traiter", className: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  confirmed: { label: "Confirmée", className: "bg-red-500/10 text-red-700 dark:text-red-400" },
  raised: { label: "Levée (faux positif)", className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
}

interface Alerte {
  id: string
  name?: string
  birth_date?: string | null
  accuracy?: number
  source?: string
  control_list?: string
  status?: string
  ia_synthesis?: { content?: string } | null
  result?: { information?: Record<string, unknown> | null; company?: string | null } | null
}

interface Controle {
  id: string
  nomRecherche: string
  dateNaissance: string | null
  typeControle: string
  listes: string
  nbAlertes: number
  alertes: Alerte[] | null
  createdAt: string
}

interface ConformiteData {
  conformiteStatut: string | null
  conformiteVerifieeLe: string | null
  configure: boolean
  controles: Controle[]
}

// Quelques informations lisibles de la fiche Efficiale (fonction, mandats…).
function infoLines(alerte: Alerte): string[] {
  const info = alerte.result?.information ?? {}
  const keys = ["title", "functions", "mandates", "occupation", "jurisdiction", "political_party", "description"]
  const lines: string[] = []
  for (const key of keys) {
    const value = info[key]
    if (!value) continue
    const text = Array.isArray(value) ? value.filter(Boolean).join(", ") : typeof value === "string" ? value : ""
    if (text.trim()) lines.push(text.trim())
  }
  if (alerte.result?.company) lines.push(alerte.result.company)
  return lines.slice(0, 4)
}

export function ConformiteCard({ clientId, onChecked }: { clientId: string; onChecked?: () => void }) {
  const [data, setData] = useState<ConformiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [action, setAction] = useState<{ controle: Controle; alerte: Alerte; statut: "confirmed" | "raised" } | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await ensureOk(await fetch(`/api/admin/crm/clients/${clientId}/conformite`), "Échec du chargement du contrôle.")
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec du chargement du contrôle.")
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    void load()
  }, [load])

  async function verifier() {
    setChecking(true)
    setError(null)
    try {
      await ensureOk(await fetch(`/api/admin/crm/clients/${clientId}/conformite`, { method: "POST" }), "Le contrôle a échoué.")
      await load()
      onChecked?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Le contrôle a échoué.")
    } finally {
      setChecking(false)
    }
  }

  const dernier = data?.controles[0] ?? null
  const precedents = data?.controles.slice(1) ?? []
  const alertes = dernier?.alertes ?? []
  const Icon = data?.conformiteStatut?.startsWith("ALERTE") ? ShieldAlert : ShieldCheck

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Icon className="size-4.5 text-muted-foreground" /> Conformité
          </CardTitle>
          {data ? <ConformiteBadge statut={data.conformiteStatut} /> : null}
        </div>
        <p className="text-xs text-muted-foreground">Gel des avoirs et PPE, via Efficiale.</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {loading ? (
          <p className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="size-4 animate-spin" /> Chargement...
          </p>
        ) : (
          <>
            {data?.conformiteVerifieeLe ? (
              <p className="text-xs text-muted-foreground">Dernier contrôle le {dateTimeFmt(data.conformiteVerifieeLe)}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Ce client n&apos;a jamais été contrôlé.</p>
            )}
            {data?.conformiteStatut === "A_REVERIFIER" ? (
              <p className="rounded-md bg-amber-500/10 px-2 py-1.5 text-xs text-amber-800 dark:text-amber-300">
                Le nom, le prénom ou la date de naissance ont changé depuis le dernier contrôle.
              </p>
            ) : null}

            {data && !data.configure ? (
              <p className="rounded-md bg-muted px-2 py-1.5 text-xs text-muted-foreground">
                Efficiale n&apos;est pas encore configuré sur le CRM (EFFICIALE_CLIENT_ID et EFFICIALE_CLIENT_SECRET).
              </p>
            ) : null}

            <Button size="sm" variant="outline" className="w-full" onClick={verifier} disabled={checking || !data?.configure}>
              <RefreshCw className={checking ? "animate-spin" : undefined} />
              {checking ? "Contrôle en cours..." : data?.conformiteVerifieeLe ? "Revérifier" : "Vérifier"}
            </Button>
            {error ? <p className="text-xs text-destructive">{error}</p> : null}

            {dernier ? (
              <div className="space-y-2 border-t border-border pt-3">
                <p className="text-xs text-muted-foreground">
                  Recherche : <span className="text-foreground">{dernier.nomRecherche}</span>
                  {dernier.dateNaissance ? ` · né(e) le ${dateFmt(dernier.dateNaissance)}` : ""} · {LIST_LABELS[dernier.listes] ?? dernier.listes}
                </p>
                {alertes.length === 0 ? (
                  <p className="text-emerald-700 dark:text-emerald-400">Aucune correspondance trouvée.</p>
                ) : (
                  alertes.map((a) => {
                    const st = ALERT_STATUS[a.status ?? "pending"] ?? ALERT_STATUS.pending
                    const lines = infoLines(a)
                    return (
                      <div key={a.id} className="space-y-1.5 rounded-lg border border-border p-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-foreground">{a.name ?? "Sans nom"}</p>
                          <StatusBadge label={st.label} className={st.className} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {LIST_LABELS[a.control_list ?? ""] ?? a.control_list ?? "Liste inconnue"}
                          {typeof a.accuracy === "number" ? ` · ${a.accuracy} % de similarité` : ""}
                          {a.birth_date ? ` · né(e) le ${dateFmt(a.birth_date)}` : ""}
                          {a.source ? ` · ${a.source}` : ""}
                        </p>
                        {lines.length ? <p className="text-xs text-foreground">{lines.join(" · ")}</p> : null}
                        {a.ia_synthesis?.content ? (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground">Synthèse IA</summary>
                            <p className="mt-1 whitespace-pre-line text-foreground">{a.ia_synthesis.content}</p>
                          </details>
                        ) : null}
                        {(a.status ?? "pending") === "pending" ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            <Button size="sm" variant="outline" onClick={() => setAction({ controle: dernier, alerte: a, statut: "raised" })}>
                              Faux positif
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => setAction({ controle: dernier, alerte: a, statut: "confirmed" })}>
                              Confirmer
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    )
                  })
                )}
              </div>
            ) : null}

            {precedents.length ? (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground">Contrôles précédents ({precedents.length})</summary>
                <ul className="mt-1.5 space-y-1">
                  {precedents.map((c) => (
                    <li key={c.id} className="flex justify-between gap-2">
                      <span>{dateTimeFmt(c.createdAt)}</span>
                      <span className={c.nbAlertes ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}>
                        {c.nbAlertes ? `${c.nbAlertes} correspondance(s)` : "Aucune correspondance"}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}
          </>
        )}
      </CardContent>

      <ConfirmDialog
        open={!!action}
        onOpenChange={(o) => !o && setAction(null)}
        title={action?.statut === "confirmed" ? "Confirmer la correspondance" : "Lever l'alerte"}
        description={
          action?.statut === "confirmed"
            ? `Vous confirmez que le client est bien « ${action.alerte.name ?? ""} » de la liste. Le statut est aussi mis à jour chez Efficiale.`
            : `Le client n'est pas « ${action?.alerte.name ?? ""} » (homonyme). Le statut est aussi mis à jour chez Efficiale.`
        }
        confirmLabel={action?.statut === "confirmed" ? "Confirmer" : "Lever l'alerte"}
        destructive={action?.statut === "confirmed"}
        onConfirm={async () => {
          if (!action) return
          await ensureOk(
            await fetch(`/api/admin/crm/clients/${clientId}/conformite/alertes`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ controleId: action.controle.id, alerteId: action.alerte.id, statut: action.statut }),
            }),
            "La mise à jour de l'alerte a échoué."
          )
          await load()
          onChecked?.()
        }}
      />
    </Card>
  )
}
