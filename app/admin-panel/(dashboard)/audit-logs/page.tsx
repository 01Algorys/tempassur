"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/admin/status-badge"
import { PaginationBar } from "@/components/admin/pagination-bar"
import { dateTimeFmt } from "@/lib/admin/labels"

interface LogRow {
  id: string
  action: string
  details: string | null
  createdAt: string
  user: { firstName: string; lastName: string; email: string; role: string }
}

const ACTION_LABELS: Record<string, string> = {
  LOGIN_SUCCESS: "Connexion réussie",
  LOGIN_FAILED: "Échec de connexion",
  PASSWORD_CHANGED: "Mot de passe modifié",
  PASSWORD_CHANGE_FAILED: "Échec de modification du mot de passe",
  ADMIN_USER_CREATED: "Compte admin créé",
  ADMIN_USER_DELETED: "Compte admin supprimé",
  SETTINGS_UPDATED: "Paramètres modifiés",
}

const ACTION_BADGE: Record<string, string> = {
  LOGIN_SUCCESS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  LOGIN_FAILED: "bg-red-500/10 text-red-600 dark:text-red-400",
  PASSWORD_CHANGED: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  PASSWORD_CHANGE_FAILED: "bg-red-500/10 text-red-600 dark:text-red-400",
  ADMIN_USER_CREATED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  ADMIN_USER_DELETED: "bg-red-500/10 text-red-600 dark:text-red-400",
  SETTINGS_UPDATED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

const PAGE_SIZE = 30

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<LogRow[]>([])
  const [total, setTotal] = useState(0)
  const [action, setAction] = useState("all")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({ page: String(page) })
    if (action !== "all") params.set("action", action)
    fetch(`/api/admin/crm/activity-logs?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement des journaux d'audit.")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setLogs(data.logs ?? [])
        setTotal(data.total ?? 0)
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [page, action])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Journaux d&apos;audit</h1>
        <p className="text-sm text-muted-foreground">{total} événements — connexions, mots de passe, comptes admin, paramètres</p>
      </div>

      <Select
        value={action}
        onValueChange={(v) => {
          setAction(v)
          setPage(1)
        }}
      >
        <SelectTrigger className="w-64"><SelectValue placeholder="Type d'événement" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les événements</SelectItem>
          {Object.entries(ACTION_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card className="p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <RefreshCw className="size-4 animate-spin" /> Chargement...
          </div>
        ) : error ? (
          <p className="p-10 text-center text-sm text-destructive">{error}</p>
        ) : logs.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Aucun événement enregistré.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2.5 font-medium">Événement</th>
                  <th className="px-3 py-2.5 font-medium">Utilisateur</th>
                  <th className="px-3 py-2.5 font-medium">Date</th>
                  <th className="px-3 py-2.5 font-medium">Détails</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-3 py-2.5">
                      <StatusBadge label={ACTION_LABELS[log.action] ?? log.action} className={ACTION_BADGE[log.action]} />
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {log.user.firstName} {log.user.lastName}
                      <span className="ml-1 text-xs">({log.user.role})</span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{dateTimeFmt(log.createdAt)}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{log.details ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationBar page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  )
}
