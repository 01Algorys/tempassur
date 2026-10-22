"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, FilePlus2, Link2, Pencil, RefreshCw, Search, Trash2, Unlink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/admin/status-badge"
import { DetailField, DetailSectionLabel } from "@/components/admin/detail-field"
import { ClientFormDialog } from "@/components/admin/client-form-dialog"
import { LinkClientDialog } from "@/components/admin/link-client-dialog"
import { DossierFormDialog } from "@/components/admin/dossier-form-dialog"
import { DossierDetails } from "@/components/admin/dossier-details"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import { RELATION_BADGE } from "@/components/admin/clients-list-view"
import { CATEGORIE_LABELS, CATEGORIE_OPTIONS, sousCategorieLabel, type Categorie } from "@/lib/admin/categories"
import { DEVIS_PIPELINE_LABELS, DEVIS_PIPELINE_BADGE, currencyFmt, dateFmt, dateTimeFmt } from "@/lib/admin/labels"
import {
  allEmails,
  allPhones,
  clientFullName,
  proxiedFileUrl,
  type ClientRecord,
  type ContratRecord,
  type DevisRecord,
  type DocumentRecord,
} from "@/lib/admin/crm-types"

interface ClientDetail extends ClientRecord {
  contrats: ContratRecord[]
  devis: DevisRecord[]
  documents: DocumentRecord[]
  liens: { lienId: string; relation: string; createdAt: string; client: ClientRecord }[]
}

type DossierRow =
  | { kind: "contrat"; record: ContratRecord }
  | { kind: "devis"; record: DevisRecord }

const statutOf = (row: DossierRow) =>
  row.kind === "contrat" ? row.record.statutRef?.nom ?? "—" : DEVIS_PIPELINE_LABELS[row.record.statutPipeline] ?? row.record.statutPipeline

function ClientInfo({ client }: { client: ClientRecord }) {
  const d = (v: string | null | undefined) => v || "—"
  return (
    <CardContent className="grid grid-cols-2 gap-4 text-sm">
      <DetailSectionLabel>Identité</DetailSectionLabel>
      <DetailField label="Type" value={client.type === "PROFESSIONNEL" ? "Professionnel" : "Particulier"} />
      <DetailField label="Civilité" value={d(client.civilite)} />
      <DetailField label="Prénom" value={d(client.prenom)} />
      <DetailField label="Nom" value={d(client.nom)} />
      {client.type === "PROFESSIONNEL" ? (
        <>
          <DetailField label="Raison sociale" value={d(client.raisonSociale)} />
          <DetailField label="SIRET" value={d(client.siret)} />
          <DetailField label="Secteur d'activité" value={d(client.secteurActivite)} />
        </>
      ) : null}
      <DetailField label="Date de naissance" value={dateFmt(client.dateNaissance)} />
      <DetailField label="Pays de naissance" value={d(client.paysNaissance)} />
      <DetailField label="Nationalité" value={d(client.nationalite)} />
      <DetailField label="VIP" value={client.isVip ? "Oui" : "Non"} />
      <DetailSectionLabel>Coordonnées</DetailSectionLabel>
      <DetailField label="Téléphones" value={allPhones(client).join("\n") || "—"} />
      <DetailField label="Emails" value={allEmails(client).join("\n") || "—"} />
      <DetailField label="Adresse" value={[client.adresse, client.codePostal, client.ville].filter(Boolean).join(", ") || "—"} full />
      <DetailField label="Pays" value={d(client.pays)} />
      <DetailField label="Résidence" value={[client.paysResidence, client.territoireResidence].filter(Boolean).join(" — ") || "—"} />
      <DetailSectionLabel>Permis</DetailSectionLabel>
      <DetailField label="N° de permis" value={d(client.numeroPermis)} />
      <DetailField label="Pays du permis" value={d(client.paysPermis)} />
      <DetailField label="Obtenu le" value={dateFmt(client.dateObtentionPermis)} />
      <DetailField label="Créé le" value={dateTimeFmt(client.createdAt)} />
      <DetailField label="Notes" value={d(client.notes)} full />
    </CardContent>
  )
}

export function ClientDetailView({ id }: { id: string }) {
  const router = useRouter()
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [newDossier, setNewDossier] = useState<"devis" | "contrat" | null>(null)
  const [openDossier, setOpenDossier] = useState<DossierRow | null>(null)
  const [editDossier, setEditDossier] = useState<DossierRow | null>(null)
  const [deleteDossier, setDeleteDossier] = useState<DossierRow | null>(null)
  const [openLinked, setOpenLinked] = useState<ClientDetail["liens"][number] | null>(null)
  const [editLinked, setEditLinked] = useState<ClientRecord | null>(null)
  const [deleteLinked, setDeleteLinked] = useState<ClientRecord | null>(null)
  const [unlink, setUnlink] = useState<ClientDetail["liens"][number] | null>(null)

  // Filtres du tableau devis/contrats
  const [dKind, setDKind] = useState("all")
  const [dStatut, setDStatut] = useState("all")
  const [dCategorie, setDCategorie] = useState("all")
  const [dSearch, setDSearch] = useState("")
  // Filtres du tableau des clients liés
  const [lStatut, setLStatut] = useState("all")
  const [lType, setLType] = useState("all")
  const [lSearch, setLSearch] = useState("")

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/crm/clients/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 404 ? "Client introuvable." : "Échec du chargement du client.")
        return res.json()
      })
      .then((data) => !cancelled && setClient(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [id, reloadKey])

  const dossiers: DossierRow[] = useMemo(() => {
    if (!client) return []
    // Les dossiers renvoyés avec la fiche n'embarquent pas le client : on le rattache.
    const self: ClientRecord = { ...client }
    return [
      ...client.contrats.map((c) => ({ kind: "contrat" as const, record: { ...c, client: self } })),
      ...client.devis.map((d) => ({ kind: "devis" as const, record: { ...d, client: self } })),
    ].sort((a, b) => new Date(b.record.createdAt).getTime() - new Date(a.record.createdAt).getTime())
  }, [client])

  const statutOptions = useMemo(() => [...new Set(dossiers.map(statutOf))].sort(), [dossiers])

  const filteredDossiers = dossiers.filter((row) => {
    if (dKind !== "all" && row.kind !== dKind) return false
    if (dStatut !== "all" && statutOf(row) !== dStatut) return false
    if (dCategorie !== "all" && row.record.categorie !== dCategorie) return false
    if (dSearch.trim()) {
      const q = dSearch.trim().toLowerCase()
      const hay = [row.record.numero, row.record.sousCategorie, JSON.stringify(row.record.details ?? {}), clientFullName(client), ...allEmails(client), ...allPhones(client)]
        .join(" ")
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  const filteredLiens = (client?.liens ?? []).filter((l) => {
    if (lStatut !== "all" && (l.client.statutRelation ?? "PROSPECT") !== lStatut) return false
    if (lType !== "all" && (l.client.type ?? "PARTICULIER") !== lType) return false
    if (lSearch.trim()) {
      const q = lSearch.trim().toLowerCase()
      const hay = [clientFullName(l.client), ...allEmails(l.client), ...allPhones(l.client), l.relation].join(" ").toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/admin-panel/clients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Retour aux clients
        </Link>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }
  if (!client) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
        <RefreshCw className="size-4 animate-spin" /> Chargement...
      </div>
    )
  }

  const isProspect = client.statutRelation !== "CLIENT"
  const backHref = isProspect ? "/admin-panel/prospects" : "/admin-panel/clients"

  return (
    <div className="space-y-4">
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Retour aux {isProspect ? "prospects" : "clients"}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-xl font-semibold text-foreground">{clientFullName(client) || "Client sans nom"}</h1>
          <StatusBadge label={isProspect ? "Prospect" : "Client"} className={RELATION_BADGE[client.statutRelation ?? "PROSPECT"]} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setNewDossier("devis")}>
            <FilePlus2 /> Devis
          </Button>
          <Button variant="outline" size="sm" onClick={() => setNewDossier("contrat")}>
            <FilePlus2 /> Contrat
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLinkOpen(true)}>
            <Link2 /> Lier
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil /> Modifier
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 /> Supprimer
          </Button>
        </div>
      </div>

      {message ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-400">{message}</p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Fiche client</CardTitle></CardHeader>
          <ClientInfo client={client} />
        </Card>

        <Card className="self-start">
          <CardHeader><CardTitle>Documents ({client.documents.length})</CardTitle></CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            {client.documents.length === 0 ? (
              <p className="text-muted-foreground">Aucun document.</p>
            ) : (
              client.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={proxiedFileUrl(doc.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-muted"
                >
                  <span className="truncate">{doc.typeDocumentRef?.nom ?? doc.nom}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{dateFmt(doc.createdAt)}</span>
                </a>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Contrats et devis ({dossiers.length})</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-48 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="Numéro, nom, email, téléphone..." value={dSearch} onChange={(e) => setDSearch(e.target.value)} />
            </div>
            <Select value={dKind} onValueChange={setDKind}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Contrats et devis</SelectItem>
                <SelectItem value="contrat">Contrats</SelectItem>
                <SelectItem value="devis">Devis</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dStatut} onValueChange={setDStatut}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statutOptions.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dCategorie} onValueChange={setDCategorie}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {CATEGORIE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {filteredDossiers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun contrat ni devis.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Numéro</th>
                    <th className="px-3 py-2 font-medium">Catégorie</th>
                    <th className="px-3 py-2 font-medium">Montant</th>
                    <th className="px-3 py-2 font-medium">Statut</th>
                    <th className="px-3 py-2 font-medium">Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDossiers.map((row) => (
                    <tr
                      key={`${row.kind}-${row.record.id}`}
                      onClick={() => setOpenDossier(row)}
                      className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-3 py-2">{row.kind === "contrat" ? "Contrat" : "Devis"}</td>
                      <td className="px-3 py-2 font-mono text-xs">{row.record.numero ?? "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {row.record.categorie ? CATEGORIE_LABELS[row.record.categorie as Categorie] : "—"}
                        {row.record.sousCategorie ? (
                          <span className="block text-xs">{sousCategorieLabel(row.record.categorie, row.record.sousCategorie)}</span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2">
                        {row.kind === "contrat"
                          ? row.record.encaissement !== null ? currencyFmt(row.record.encaissement) : "—"
                          : row.record.montantEstime !== null ? currencyFmt(row.record.montantEstime) : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge
                          label={statutOf(row)}
                          className={row.kind === "devis" ? DEVIS_PIPELINE_BADGE[row.record.statutPipeline] : undefined}
                        />
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{dateFmt(row.record.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Clients liés ({client.liens.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setLinkOpen(true)}>
            <Link2 /> Lier
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-48 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-8" placeholder="Nom, email, téléphone..." value={lSearch} onChange={(e) => setLSearch(e.target.value)} />
            </div>
            <Select value={lStatut} onValueChange={setLStatut}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="CLIENT">Clients</SelectItem>
                <SelectItem value="PROSPECT">Prospects</SelectItem>
              </SelectContent>
            </Select>
            <Select value={lType} onValueChange={setLType}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="PARTICULIER">Particuliers</SelectItem>
                <SelectItem value="PROFESSIONNEL">Professionnels</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {filteredLiens.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun client lié.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Nom</th>
                    <th className="px-3 py-2 font-medium">Relation</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Téléphone</th>
                    <th className="px-3 py-2 font-medium">Statut</th>
                    <th className="px-3 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLiens.map((l) => (
                    <tr key={l.lienId} onClick={() => setOpenLinked(l)} className="cursor-pointer border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-3 py-2 font-medium">{clientFullName(l.client) || "Sans nom"}</td>
                      <td className="px-3 py-2">{l.relation}</td>
                      <td className="px-3 py-2 text-muted-foreground">{allEmails(l.client)[0] ?? "—"}</td>
                      <td className="px-3 py-2 text-muted-foreground">{allPhones(l.client)[0] ?? "—"}</td>
                      <td className="px-3 py-2">
                        <StatusBadge
                          label={l.client.statutRelation === "CLIENT" ? "Client" : "Prospect"}
                          className={RELATION_BADGE[l.client.statutRelation ?? "PROSPECT"]}
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Retirer le lien"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUnlink(l)
                          }}
                        >
                          <Unlink className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Modales --- */}

      <ClientFormDialog open={editOpen} onOpenChange={setEditOpen} client={client} onSaved={reload} />

      <LinkClientDialog
        open={linkOpen}
        onOpenChange={setLinkOpen}
        clientId={client.id}
        onLinked={(m) => {
          setMessage(m)
          reload()
        }}
      />

      <DossierFormDialog
        kind={newDossier ?? "devis"}
        open={!!newDossier}
        onOpenChange={(o) => !o && setNewDossier(null)}
        defaultClient={client}
        onSaved={reload}
      />

      <Dialog open={!!openDossier} onOpenChange={(o) => !o && setOpenDossier(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {openDossier?.kind === "contrat" ? "Contrat" : "Devis"} {openDossier?.record.numero ?? ""}
            </DialogTitle>
          </DialogHeader>
          {openDossier ? (
            <div className="grid gap-4">
              <DossierDetails kind={openDossier.kind} record={openDossier.record} />
            </div>
          ) : null}
          <DialogFooter>
            {openDossier ? (
              <Button variant="outline" asChild>
                <Link href={openDossier.kind === "contrat" ? `/admin-panel/contracts/${openDossier.record.id}` : `/admin-panel/quotes/${openDossier.record.id}`}>
                  <ExternalLink /> Ouvrir la fiche
                </Link>
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={() => {
                setEditDossier(openDossier)
                setOpenDossier(null)
              }}
            >
              <Pencil /> Modifier
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteDossier(openDossier)
                setOpenDossier(null)
              }}
            >
              <Trash2 /> Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DossierFormDialog
        kind={editDossier?.kind ?? "devis"}
        open={!!editDossier}
        onOpenChange={(o) => !o && setEditDossier(null)}
        record={editDossier?.record}
        onSaved={reload}
      />

      <ConfirmDialog
        open={!!deleteDossier}
        onOpenChange={(o) => !o && setDeleteDossier(null)}
        title={`Supprimer le ${deleteDossier?.kind === "contrat" ? "contrat" : "devis"}`}
        description={`Supprimer définitivement ${deleteDossier?.record.numero ?? "ce dossier"} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleteDossier) return
          const base = deleteDossier.kind === "contrat" ? "contrats" : "devis"
          await ensureOk(await fetch(`/api/admin/crm/${base}/${deleteDossier.record.id}`, { method: "DELETE" }), "Échec de la suppression.")
          reload()
        }}
      />

      <Dialog open={!!openLinked} onOpenChange={(o) => !o && setOpenLinked(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {clientFullName(openLinked?.client) || "Client"} — {openLinked?.relation}
            </DialogTitle>
          </DialogHeader>
          {openLinked ? <ClientInfo client={openLinked.client} /> : null}
          <DialogFooter>
            {openLinked ? (
              <Button variant="outline" asChild>
                <Link href={`/admin-panel/clients/${openLinked.client.id}`}>
                  <ExternalLink /> Ouvrir la fiche
                </Link>
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={() => {
                setEditLinked(openLinked?.client ?? null)
                setOpenLinked(null)
              }}
            >
              <Pencil /> Modifier
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteLinked(openLinked?.client ?? null)
                setOpenLinked(null)
              }}
            >
              <Trash2 /> Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClientFormDialog open={!!editLinked} onOpenChange={(o) => !o && setEditLinked(null)} client={editLinked} onSaved={reload} />

      <ConfirmDialog
        open={!!deleteLinked}
        onOpenChange={(o) => !o && setDeleteLinked(null)}
        title="Supprimer le client lié"
        description={`Supprimer définitivement la fiche de ${clientFullName(deleteLinked) || "ce client"} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleteLinked) return
          await ensureOk(await fetch(`/api/admin/crm/clients/${deleteLinked.id}`, { method: "DELETE" }), "Échec de la suppression.")
          reload()
        }}
      />

      <ConfirmDialog
        open={!!unlink}
        onOpenChange={(o) => !o && setUnlink(null)}
        title="Retirer le lien"
        description={`Retirer le lien avec ${clientFullName(unlink?.client) || "ce client"} ? Les deux fiches sont conservées.`}
        confirmLabel="Retirer"
        destructive
        onConfirm={async () => {
          if (!unlink) return
          await ensureOk(await fetch(`/api/admin/crm/clients/${client.id}/liens/${unlink.lienId}`, { method: "DELETE" }), "Échec.")
          reload()
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={isProspect ? "Supprimer le prospect" : "Supprimer le client"}
        description={`Supprimer définitivement ${clientFullName(client) || "cette fiche"} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          await ensureOk(await fetch(`/api/admin/crm/clients/${client.id}`, { method: "DELETE" }), "Échec de la suppression.")
          router.push(backHref)
        }}
      />
    </div>
  )
}
