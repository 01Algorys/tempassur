"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mic, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormActions, FormField as Field, FormGrid, FormPage, FormSection as Section } from "@/components/admin/form-page"
import { ClientPicker } from "@/components/admin/client-picker"
import { ClientFields, toClientForm, toClientPayload, type ClientFormValues } from "@/components/admin/client-fields"
import { CategoryFields } from "@/components/admin/dossier-fields"
import { ConfirmDialog, ensureOk } from "@/components/admin/confirm-dialog"
import {
  CATEGORIES,
  CATEGORIE_OPTIONS,
  NATURE_REMUNERATION_OPTIONS,
  type Categorie,
  type FieldDef,
} from "@/lib/admin/categories"
import { DEVIS_PIPELINE_LABELS, currencyFmt } from "@/lib/admin/labels"
import { siteFilterOptions } from "@/lib/admin/sites"
import { dateInputValue } from "@/lib/admin/date-input"
import type { ClientRecord, ContratRecord, DevisRecord, Reference } from "@/lib/admin/crm-types"

type Kind = "devis" | "contrat"
type Dossier = DevisRecord | ContratRecord

const dateInput = dateInputValue
const numStr = (v: number | null | undefined) => (v === null || v === undefined ? "" : String(v))
const toNum = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")))

// Champs du contrat qui sont de vraies colonnes (et non des clés de details).
type ColumnKey = "marque" | "modele" | "immatriculation"

interface FormState {
  numero: string
  numeroDemande: string
  categorie: Categorie | ""
  sousCategorie: string
  details: Record<string, unknown>
  columns: Record<ColumnKey, string>
  statut: string
  produitId: string
  distributeurId: string
  encaissement: string
  prime: string
  natureRemuneration: string
  note: string
  siteOrigine: string
  // devis
  montantEstime: string
  probabilite: string
  dateRelance: string
  motifPerte: string
  // contrat
  dateSouscription: string
  dateEffet: string
  dureeJours: string
  dateDebut: string
  dateFin: string
  dateResiliation: string
  motifResiliation: string
  dateRappel: string
}

function initialState(kind: Kind, record?: Dossier | null, defaultClient?: ClientRecord | null): FormState {
  const c = kind === "contrat" ? (record as ContratRecord | undefined) : undefined
  const d = kind === "devis" ? (record as DevisRecord | undefined) : undefined
  return {
    numero: record?.numero ?? "",
    numeroDemande: c?.numeroDemande ?? "",
    categorie: record?.categorie ?? "",
    sousCategorie: record?.sousCategorie ?? "",
    details: { ...(record?.details ?? {}) },
    columns: { marque: c?.marque ?? "", modele: c?.modele ?? "", immatriculation: c?.immatriculation ?? "" },
    statut: kind === "devis" ? d?.statutPipeline ?? "NOUVEAU" : c?.statutRefId ?? "",
    produitId: (kind === "devis" ? d?.produitId : c?.produitId) ?? "",
    distributeurId: record?.distributeurId ?? "",
    encaissement: numStr(record?.encaissement),
    prime: numStr(record?.prime),
    natureRemuneration: record?.natureRemuneration ?? "",
    note: (kind === "devis" ? d?.notes : c?.notesInternes) ?? "",
    siteOrigine: (record ? record.siteOrigine : defaultClient?.siteOrigine) ?? "",
    montantEstime: numStr(d?.montantEstime),
    probabilite: numStr(d?.probabilite),
    dateRelance: dateInput(d?.dateRelance),
    motifPerte: d?.motifPerte ?? "",
    dateSouscription: dateInput(c?.dateSouscription),
    dateEffet: dateInput(c?.dateEffet),
    dureeJours: numStr(c?.dureeJours),
    dateDebut: dateInput(c?.dateDebut),
    dateFin: dateInput(c?.dateFin),
    dateResiliation: dateInput(c?.dateResiliation),
    motifResiliation: c?.motifResiliation ?? "",
    dateRappel: dateInput(c?.dateRappel),
  }
}

function RefSelect({ value, onChange, options, placeholder = "Aucun" }: { value: string; onChange: (v: string) => void; options: Reference[]; placeholder?: string }) {
  return (
    <Select value={value || "__none"} onValueChange={(v) => onChange(v === "__none" ? "" : v)}>
      <SelectTrigger className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        <SelectItem value="__none">{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.id} value={o.id}>{o.nom}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Création / modification d'un devis ou d'un contrat, en plein écran. Tous les
// champs sont optionnels ; chaque catégorie a son propre formulaire (catalogue
// lib/admin/categories.ts) ; un nouveau client saisi ici est créé par le CRM
// avec le dossier. Après enregistrement : `retour` ou la fiche du dossier.
export function DossierForm({
  kind,
  record,
  defaultClient,
  retour,
}: {
  kind: Kind
  record?: Dossier | null
  defaultClient?: ClientRecord | null
  retour?: string
}) {
  const router = useRouter()
  const isEdit = !!record
  const [state, setState] = useState<FormState>(() => initialState(kind, record, defaultClient))
  const [client, setClient] = useState<ClientRecord | null>(record?.client ?? defaultClient ?? null)
  const [newClient, setNewClient] = useState<ClientFormValues | null>(null)
  const [audioFiles, setAudioFiles] = useState<File[]>([])
  const [refs, setRefs] = useState<{ statuts: Reference[]; produits: Reference[]; distributeurs: Reference[] }>({
    statuts: [],
    produits: [],
    distributeurs: [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmStatut, setConfirmStatut] = useState(false)
  const [notifierClient, setNotifierClient] = useState(true)

  useEffect(() => {
    fetch("/api/admin/crm/contrats?full=1&page=1")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setRefs({ statuts: data.statuts ?? [], produits: data.produits ?? [], distributeurs: data.distributeurs ?? [] })
      })
      .catch(() => {})
  }, [])

  const listHref = kind === "devis" ? "/admin-panel/quotes" : "/admin-panel/contracts"
  const cancelHref = retour ?? (record ? `${listHref}/${record.id}` : listHref)

  // Client choisi dans la liste : son site d'origine pré-remplit celui du dossier s'il est vide.
  function pickClient(c: ClientRecord | null) {
    setClient(c)
    if (c?.siteOrigine) setState((s) => (s.siteOrigine ? s : { ...s, siteOrigine: c.siteOrigine ?? "" }))
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setState((s) => ({ ...s, [key]: value }))
  const text = (key: keyof FormState) => ({
    value: state[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value as never),
  })

  const encaissement = toNum(state.encaissement)
  const prime = toNum(state.prime)
  const honoraires = encaissement === null ? null : Math.round((encaissement - (prime ?? 0)) * 100) / 100

  const categorieDef = state.categorie ? CATEGORIES[state.categorie] : null

  // Contrat : marque/modèle/immatriculation -> colonnes ; date d'effet/durée
  // -> section Dates (évite de les saisir deux fois).
  const hiddenKeys = kind === "contrat" ? ["dateEffet", "duree"] : []
  const getValue = (f: FieldDef) =>
    kind === "contrat" && f.contratColumn && f.contratColumn in state.columns
      ? state.columns[f.contratColumn as ColumnKey]
      : state.details[f.key]
  const setValue = (f: FieldDef, value: unknown) => {
    if (kind === "contrat" && f.contratColumn && f.contratColumn in state.columns) {
      setState((s) => ({ ...s, columns: { ...s.columns, [f.contratColumn as ColumnKey]: String(value ?? "") } }))
    } else {
      setState((s) => ({ ...s, details: { ...s.details, [f.key]: value } }))
    }
  }

  const statutChanged = useMemo(
    () => kind === "contrat" && isEdit && state.statut !== ((record as ContratRecord | undefined)?.statutRefId ?? ""),
    [kind, isEdit, state.statut, record]
  )

  function buildPayload(notify: boolean) {
    // Détails vides retirés pour ne stocker que ce qui a été saisi.
    const details = Object.fromEntries(Object.entries(state.details).filter(([, v]) => v !== "" && v !== null && v !== undefined))
    const clientPart = newClient
      ? { client: toClientPayload(newClient) }
      : client
        ? { clientId: client.id }
        : isEdit
          ? {}
          : { client: {} }
    const common = {
      ...clientPart,
      categorie: state.categorie || null,
      sousCategorie: state.sousCategorie || null,
      details,
      produitId: state.produitId || null,
      distributeurId: state.distributeurId || null,
      encaissement,
      prime,
      natureRemuneration: state.natureRemuneration || null,
      siteOrigine: state.siteOrigine || null,
    }
    if (kind === "devis") {
      return {
        ...common,
        numero: state.numero.trim() || undefined,
        statutPipeline: state.statut || "NOUVEAU",
        montantEstime: toNum(state.montantEstime),
        probabilite: state.probabilite ? Math.round(Number(state.probabilite)) : null,
        dateRelance: state.dateRelance || null,
        motifPerte: state.motifPerte || null,
        notes: state.note || null,
      }
    }
    return {
      ...common,
      // Numéro vide à la création -> attribué par le CRM ; en modification il reste inchangé.
      numero: state.numero.trim() || undefined,
      numeroDemande: state.numeroDemande || null,
      statutRefId: state.statut || null,
      notifierClient: notify,
      marque: state.columns.marque || null,
      modele: state.columns.modele || null,
      immatriculation: state.columns.immatriculation || null,
      dateSouscription: state.dateSouscription || null,
      dateEffet: state.dateEffet || null,
      dureeJours: state.dureeJours ? Math.round(Number(state.dureeJours)) : null,
      // Vide à la création -> date d'effet (règle du CRM) ; vide en modification -> inchangée.
      dateDebut: state.dateDebut || undefined,
      dateFin: state.dateFin || undefined,
      dateResiliation: state.dateResiliation || null,
      motifResiliation: state.motifResiliation || null,
      dateRappel: state.dateRappel || null,
      notesInternes: state.note || null,
    }
  }

  async function uploadAudio(saved: Dossier) {
    if (audioFiles.length === 0) return
    const formData = new FormData()
    formData.append(kind === "devis" ? "devisId" : "contratId", saved.id)
    formData.append("libelleAutre", "Audio")
    for (const f of audioFiles) formData.append("file", f)
    const res = await fetch("/api/admin/crm/documents", { method: "POST", body: formData })
    await ensureOk(res, "Dossier enregistré, mais l'envoi de l'audio a échoué.")
  }

  async function save(notify: boolean) {
    setSaving(true)
    setError(null)
    try {
      const base = kind === "devis" ? "/api/admin/crm/devis" : "/api/admin/crm/contrats"
      const res = await fetch(isEdit ? `${base}/${record!.id}` : base, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(notify)),
      })
      await ensureOk(res, "Échec de l'enregistrement.")
      const saved = (await res.json()) as Dossier & { notification?: { sent: boolean; reason?: string } | null }
      await uploadAudio(saved)
      if (saved.notification && !saved.notification.sent) {
        window.alert(`Statut enregistré, mais l'email au client n'a pas été envoyé : ${saved.notification.reason ?? ""}`)
      }
      router.push(retour ?? `${listHref}/${saved.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
      setSaving(false)
      throw err
    }
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (statutChanged) {
      setConfirmStatut(true)
      return
    }
    save(false).catch(() => {})
  }

  const label = kind === "devis" ? "devis" : "contrat"
  const nouveauStatutNom = refs.statuts.find((s) => s.id === state.statut)?.nom ?? "Aucun"

  return (
    <FormPage
      title={isEdit ? `Modifier le ${label}${record?.numero ? ` ${record.numero}` : ""}` : `Nouveau ${label}`}
      description="Tous les champs sont optionnels."
      backHref={cancelHref}
      backLabel="Retour"
    >
      <form
        onSubmit={handleSubmit}
        // Entrée dans un champ (recherche de client…) ne doit pas enregistrer le dossier.
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") e.preventDefault()
        }}
        className="space-y-4"
      >
        <Section title="Général">
          <FormGrid>
            <Field label="Numéro">
              <Input {...text("numero")} placeholder={isEdit ? "" : "Attribué automatiquement si vide"} />
            </Field>
            {kind === "contrat" ? (
              <Field label="N° de demande"><Input {...text("numeroDemande")} /></Field>
            ) : (
              <Field label="Statut">
                <Select value={state.statut} onValueChange={(v) => set("statut", v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(DEVIS_PIPELINE_LABELS).map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
            {kind === "contrat" ? (
              <Field label="Statut">
                <RefSelect value={state.statut} onChange={(v) => set("statut", v)} options={refs.statuts} />
              </Field>
            ) : null}
            <Field label="Catégorie">
              <Select
                value={state.categorie || "__none"}
                onValueChange={(v) => setState((s) => ({ ...s, categorie: v === "__none" ? "" : (v as Categorie), sousCategorie: "" }))}
              >
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Aucune</SelectItem>
                  {CATEGORIE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {categorieDef ? (
              <Field label={categorieDef.sousCategorieLabel}>
                {categorieDef.sousCategories ? (
                  <Select value={state.sousCategorie || "__none"} onValueChange={(v) => set("sousCategorie", v === "__none" ? "" : v)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">—</SelectItem>
                      {categorieDef.sousCategories.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input {...text("sousCategorie")} />
                )}
              </Field>
            ) : null}
            <Field label="Produit">
              <RefSelect value={state.produitId} onChange={(v) => set("produitId", v)} options={refs.produits} />
            </Field>
            <Field label="Distributeur">
              <RefSelect value={state.distributeurId} onChange={(v) => set("distributeurId", v)} options={refs.distributeurs} />
            </Field>
            <Field label="Site d'origine">
              <Select value={state.siteOrigine || "__none"} onValueChange={(v) => set("siteOrigine", v === "__none" ? "" : v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Non renseigné</SelectItem>
                  {siteFilterOptions(state.siteOrigine ? [state.siteOrigine] : []).map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {kind === "devis" ? (
              <>
                <Field label="Montant estimé (€)"><Input type="number" step="0.01" {...text("montantEstime")} /></Field>
                <Field label="Probabilité (%)"><Input type="number" min={0} max={100} {...text("probabilite")} /></Field>
                <Field label="Date de relance"><Input type="date" {...text("dateRelance")} /></Field>
                <Field label="Motif de perte"><Input {...text("motifPerte")} /></Field>
              </>
            ) : null}
          </FormGrid>
        </Section>

        <Section title="Client">
          {newClient ? (
            <div className="space-y-3">
              <ClientFields value={newClient} onChange={setNewClient} wide />
              <Button type="button" variant="outline" size="sm" onClick={() => setNewClient(null)}>
                Choisir un client existant
              </Button>
            </div>
          ) : (
            <ClientPicker
              selected={client}
              onChange={pickClient}
              onCreateNew={() => {
                setClient(null)
                setNewClient({ ...toClientForm(null), statutRelation: kind === "contrat" ? "CLIENT" : "PROSPECT" })
              }}
            />
          )}
          {!client && !newClient && !isEdit ? (
            <p className="text-xs text-muted-foreground">Sans client choisi, une fiche client vide sera créée.</p>
          ) : null}
        </Section>

        {categorieDef ? (
          <Section title={`Détails ${categorieDef.label}`}>
            <CategoryFields
              categorie={categorieDef.value}
              sousCategorie={state.sousCategorie}
              details={state.details}
              getValue={getValue}
              setValue={setValue}
              hiddenKeys={hiddenKeys}
            />
          </Section>
        ) : null}

        {kind === "contrat" ? (
          <Section title="Dates">
            <FormGrid>
              <Field label="Date de souscription"><Input type="date" {...text("dateSouscription")} /></Field>
              <Field label="Date d'effet"><Input type="date" {...text("dateEffet")} /></Field>
              <Field label="Durée (jours)"><Input type="number" {...text("dureeJours")} /></Field>
              <Field label="Date de début"><Input type="date" {...text("dateDebut")} /></Field>
              <Field label="Date de fin"><Input type="date" {...text("dateFin")} /></Field>
              <Field label="Date de rappel"><Input type="date" {...text("dateRappel")} /></Field>
              <Field label="Date de résiliation"><Input type="date" {...text("dateResiliation")} /></Field>
              <Field label="Motif de résiliation" full><Input {...text("motifResiliation")} /></Field>
            </FormGrid>
          </Section>
        ) : null}

        <Section title="Rémunération">
          <FormGrid className="lg:grid-cols-4">
            <Field label="Encaissement (€)"><Input type="number" step="0.01" {...text("encaissement")} /></Field>
            <Field label="Prime (€)"><Input type="number" step="0.01" {...text("prime")} /></Field>
            <Field label="Honoraires (encaissement − prime)">
              <Input readOnly value={honoraires === null ? "—" : currencyFmt(honoraires)} className="bg-muted" />
            </Field>
            <Field label="Nature de rémunération">
              <Select value={state.natureRemuneration || "__none"} onValueChange={(v) => set("natureRemuneration", v === "__none" ? "" : v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">—</SelectItem>
                  {NATURE_REMUNERATION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FormGrid>
        </Section>

        <Section title="Note & audio">
          <Field label="Note"><Textarea rows={5} {...text("note")} /></Field>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Mic className="size-4" /> Fichiers audio</Label>
            <Input
              type="file"
              accept="audio/*"
              multiple
              onChange={(e) => {
                setAudioFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])
                e.target.value = ""
              }}
            />
            {audioFiles.map((f, i) => (
              <div key={`${f.name}-${i}`} className="flex items-center justify-between rounded-md border border-border px-2 py-1 text-xs">
                <span className="truncate">{f.name}</span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setAudioFiles((p) => p.filter((_, j) => j !== i))}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
            {isEdit ? <p className="text-xs text-muted-foreground">Les audios déjà enregistrés sont gérés depuis la fiche.</p> : null}
          </div>
        </Section>

        <FormActions error={error}>
          <Button type="button" variant="outline" asChild>
            <Link href={cancelHref}>Annuler</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : isEdit ? "Enregistrer les modifications" : `Créer le ${label}`}
          </Button>
        </FormActions>
      </form>

      <ConfirmDialog
        open={confirmStatut}
        onOpenChange={setConfirmStatut}
        title="Changer le statut du contrat"
        description={`Le statut passera à « ${nouveauStatutNom} ».`}
        confirmLabel="Confirmer et enregistrer"
        onConfirm={() => save(notifierClient)}
      >
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={notifierClient} onCheckedChange={(v) => setNotifierClient(v === true)} />
          Notifier le client par email
        </label>
      </ConfirmDialog>
    </FormPage>
  )
}
