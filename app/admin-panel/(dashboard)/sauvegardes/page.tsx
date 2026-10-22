"use client"

import { useEffect, useState } from "react"
import { DatabaseBackup, Download, History, RefreshCw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { dateTimeFmt, formatFileSize } from "@/lib/admin/labels"

interface Sauvegarde {
  id: string
  nomFichier: string
  taille: number
  origine: "AUTO" | "MANUEL" | "AVANT_RESTAURATION"
  createdAt: string
}

const ORIGINE_LABELS: Record<string, string> = {
  AUTO: "Automatique",
  MANUEL: "Manuelle",
  AVANT_RESTAURATION: "Avant restauration",
}

const FORMATS = [
  { value: "sql", label: "SQL" },
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "XLS" },
] as const

export default function SauvegardesPage() {
  const [sauvegardes, setSauvegardes] = useState<Sauvegarde[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [restoring, setRestoring] = useState<Sauvegarde | null>(null)
  const [deleting, setDeleting] = useState<Sauvegarde | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch("/api/admin/crm/sauvegardes")
      .then(async (res) => {
        if (!res.ok) throw new Error("Échec du chargement des sauvegardes.")
        return res.json()
      })
      .then((data) => !cancelled && setSauvegardes(Array.isArray(data) ? data : []))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  async function handleCreate() {
    setCreating(true)
    setMessage(null)
    setError(null)
    try {
      await ensureOk(await fetch("/api/admin/crm/sauvegardes", { method: "POST" }), "Échec de la sauvegarde.")
      setMessage("Sauvegarde créée.")
      setReloadKey((k) => k + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la sauvegarde.")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Sauvegardes</h1>
          <p className="text-sm text-muted-foreground">Sauvegarde automatique quotidienne de la base · 30 dernières conservées</p>
        </div>
        <Button size="sm" onClick={handleCreate} disabled={creating}>
          <DatabaseBackup /> {creating ? "Sauvegarde en cours..." : "Sauvegarder maintenant"}
        </Button>
      </div>

      {message ? <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
          <CardDescription>
            Téléchargement en SQL (restaurable), CSV (un fichier par table, zippé) ou XLS (une feuille par table). La
            restauration n&apos;est possible que depuis une sauvegarde de cette liste ; une sauvegarde de l&apos;état actuel
            est prise automatiquement juste avant.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
              <RefreshCw className="size-4 animate-spin" /> Chargement...
            </div>
          ) : sauvegardes.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">Aucune sauvegarde pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="px-4 py-2.5 font-medium">Origine</th>
                    <th className="px-4 py-2.5 font-medium">Taille</th>
                    <th className="px-4 py-2.5 font-medium">Télécharger</th>
                    <th className="px-4 py-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {sauvegardes.map((s) => (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 text-foreground">{dateTimeFmt(s.createdAt)}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge label={ORIGINE_LABELS[s.origine] ?? s.origine} className="bg-muted" />
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{formatFileSize(s.taille)}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          {FORMATS.map((f) => (
                            <Button key={f.value} variant="outline" size="sm" asChild>
                              <a href={`/api/admin/crm/sauvegardes/${s.id}?format=${f.value}`}>
                                <Download /> {f.label}
                              </a>
                            </Button>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="outline" size="sm" onClick={() => setRestoring(s)}>
                            <History /> Restaurer
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => setDeleting(s)} aria-label="Supprimer">
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!restoring}
        onOpenChange={(o) => !o && setRestoring(null)}
        title="Restaurer cette sauvegarde"
        description={
          restoring
            ? `Toutes les données actuelles (clients, devis, contrats, documents enregistrés, tâches…) seront remplacées par celles du ${dateTimeFmt(restoring.createdAt)}. Les fichiers déposés ne sont pas concernés.`
            : ""
        }
        confirmLabel="Restaurer"
        confirmWord="RESTAURER"
        destructive
        onConfirm={async () => {
          if (!restoring) return
          await ensureOk(
            await fetch(`/api/admin/crm/sauvegardes/${restoring.id}/restore`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ confirmation: "RESTAURER" }),
            }),
            "Échec de la restauration."
          )
          setMessage("Restauration terminée. Une sauvegarde de l'état précédent a été ajoutée à la liste.")
          setReloadKey((k) => k + 1)
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Supprimer la sauvegarde"
        description={deleting ? `Supprimer la sauvegarde du ${dateTimeFmt(deleting.createdAt)} ?` : ""}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return
          await ensureOk(await fetch(`/api/admin/crm/sauvegardes/${deleting.id}`, { method: "DELETE" }), "Échec de la suppression.")
          setReloadKey((k) => k + 1)
        }}
      />
    </div>
  )
}
