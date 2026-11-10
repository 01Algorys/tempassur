"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ClientFields, toClientForm, toClientPayload, type ClientFormValues } from "@/components/admin/client-fields"
import { FormActions, FormPage } from "@/components/admin/form-page"
import { ensureOk } from "@/components/admin/confirm-dialog"
import { clientFullName, type ClientRecord } from "@/lib/admin/crm-types"

// Création / modification d'une fiche client en plein écran — tous les champs, tous optionnels.
// Après enregistrement : retour à `retour` (page d'où l'on vient) ou à la fiche du client.
export function ClientForm({
  client,
  defaultStatut = "PROSPECT",
  retour,
}: {
  client?: ClientRecord | null
  defaultStatut?: "PROSPECT" | "CLIENT"
  retour?: string
}) {
  const router = useRouter()
  const [values, setValues] = useState<ClientFormValues>(() =>
    client ? toClientForm(client) : { ...toClientForm(null), statutRelation: defaultStatut }
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEdit = !!client
  const listHref = (client?.statutRelation ?? defaultStatut) === "CLIENT" ? "/admin-panel/clients" : "/admin-panel/prospects"
  const cancelHref = retour ?? (client ? `/admin-panel/clients/${client.id}` : listHref)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(client ? `/api/admin/crm/clients/${client.id}` : "/api/admin/crm/clients", {
        method: client ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toClientPayload(values)),
      })
      await ensureOk(res, "Échec de l'enregistrement du client.")
      const saved = (await res.json()) as ClientRecord
      router.push(retour ?? `/admin-panel/clients/${saved.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
      setSaving(false)
    }
  }

  return (
    <FormPage
      title={isEdit ? `Modifier ${clientFullName(client) || "le client"}` : defaultStatut === "CLIENT" ? "Nouveau client" : "Nouveau prospect"}
      description={
        isEdit
          ? "Les modifications sont enregistrées dans le journal d'audit. Tous les champs sont optionnels."
          : "Tous les champs sont optionnels."
      }
      backHref={cancelHref}
      backLabel="Retour"
    >
      <form onSubmit={handleSave} className="space-y-4">
        <ClientFields value={values} onChange={setValues} layout="sections" />
        <FormActions error={error}>
          <Button type="button" variant="outline" asChild>
            <Link href={cancelHref}>Annuler</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : "Créer la fiche"}
          </Button>
        </FormActions>
      </form>
    </FormPage>
  )
}
