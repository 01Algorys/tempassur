"use client"

import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COUNTRIES, getCountryLabel } from "@/lib/countries"
import type { ClientRecord } from "@/lib/admin/crm-types"

// Valeurs du formulaire client. Téléphones/emails en listes : le premier
// élément va dans Client.telephone/email (lu par les écrans existants), les
// suivants dans Client.telephones/emails.
export interface ClientFormValues {
  type: "PARTICULIER" | "PROFESSIONNEL"
  statutRelation: "PROSPECT" | "CLIENT"
  civilite: string
  nom: string
  prenom: string
  phones: string[]
  emails: string[]
  raisonSociale: string
  siret: string
  secteurActivite: string
  adresse: string
  codePostal: string
  ville: string
  pays: string
  nationalite: string
  dateNaissance: string
  paysNaissance: string
  paysResidence: string
  territoireResidence: string
  numeroPermis: string
  paysPermis: string
  dateObtentionPermis: string
  isVip: boolean
  notes: string
}

const dateInput = (v: string | null | undefined) => (v ? new Date(v).toISOString().slice(0, 10) : "")

export function toClientForm(client?: ClientRecord | null): ClientFormValues {
  return {
    type: client?.type ?? "PARTICULIER",
    statutRelation: client?.statutRelation ?? "PROSPECT",
    civilite: client?.civilite ?? "",
    nom: client?.nom ?? "",
    prenom: client?.prenom ?? "",
    phones: [client?.telephone ?? "", ...(client?.telephones ?? [])].filter((v, i) => i === 0 || v),
    emails: [client?.email ?? "", ...(client?.emails ?? [])].filter((v, i) => i === 0 || v),
    raisonSociale: client?.raisonSociale ?? "",
    siret: client?.siret ?? "",
    secteurActivite: client?.secteurActivite ?? "",
    adresse: client?.adresse ?? "",
    codePostal: client?.codePostal ?? "",
    ville: client?.ville ?? "",
    pays: client?.pays ?? "",
    nationalite: client?.nationalite ?? "",
    dateNaissance: dateInput(client?.dateNaissance),
    paysNaissance: client?.paysNaissance ?? "",
    paysResidence: client?.paysResidence ?? "",
    territoireResidence: client?.territoireResidence ?? "",
    numeroPermis: client?.numeroPermis ?? "",
    paysPermis: client?.paysPermis ?? "",
    dateObtentionPermis: dateInput(client?.dateObtentionPermis),
    isVip: client?.isVip ?? false,
    notes: client?.notes ?? "",
  }
}

// Payload pour POST/PATCH /api/clients (champs vides -> null côté CRM).
export function toClientPayload(values: ClientFormValues) {
  const phones = values.phones.map((p) => p.trim()).filter(Boolean)
  const emails = values.emails.map((e) => e.trim()).filter(Boolean)
  const rest: Partial<ClientFormValues> = { ...values }
  delete rest.phones
  delete rest.emails
  return {
    ...rest,
    telephone: phones[0] ?? null,
    telephones: phones.slice(1),
    email: emails[0] ?? null,
    emails: emails.slice(1),
    dateNaissance: values.dateNaissance || null,
    dateObtentionPermis: values.dateObtentionPermis || null,
  }
}

const COUNTRY_NAMES = COUNTRIES.filter((c) => c.code !== "OTHER").map((c) => getCountryLabel(c.code, "fr", ""))

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function MultiInput({
  label,
  values,
  onChange,
  type,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  type: "tel" | "email"
}) {
  const list = values.length ? values : [""]
  return (
    <div className="space-y-1.5 sm:col-span-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {list.map((value, i) => (
          <div key={i} className="flex gap-2">
            <Input
              type={type}
              value={value}
              placeholder={i === 0 ? "Principal" : "Supplémentaire"}
              onChange={(e) => onChange(list.map((v, j) => (j === i ? e.target.value : v)))}
            />
            {list.length > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onChange(list.filter((_, j) => j !== i))}
                aria-label="Retirer"
              >
                <Minus className="size-4" />
              </Button>
            ) : null}
            {i === list.length - 1 ? (
              <Button type="button" variant="outline" size="icon" onClick={() => onChange([...list, ""])} aria-label="Ajouter">
                <Plus className="size-4" />
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

// datalist plutôt que Select : les pays sont des textes libres dans le CRM
// (données importées d'Excel) — on suggère sans imposer.
function CountryInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Input list="admin-countries" value={value} onChange={(e) => onChange(e.target.value)} />
}

export function ClientFields({
  value,
  onChange,
  compact = false,
}: {
  value: ClientFormValues
  onChange: (value: ClientFormValues) => void
  // Formulaire réduit (identité + coordonnées) pour les créations rapides.
  compact?: boolean
}) {
  const set = <K extends keyof ClientFormValues>(key: K, v: ClientFormValues[K]) => onChange({ ...value, [key]: v })
  const text = (key: keyof ClientFormValues) => ({
    value: value[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value as never),
  })

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <datalist id="admin-countries">
        {COUNTRY_NAMES.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>

      <Field label="Type">
        <Select value={value.type} onValueChange={(v) => set("type", v as ClientFormValues["type"])}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PARTICULIER">Particulier</SelectItem>
            <SelectItem value="PROFESSIONNEL">Professionnel</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Statut">
        <Select value={value.statutRelation} onValueChange={(v) => set("statutRelation", v as ClientFormValues["statutRelation"])}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PROSPECT">Prospect</SelectItem>
            <SelectItem value="CLIENT">Client</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field label="Civilité">
        <Select value={value.civilite || undefined} onValueChange={(v) => set("civilite", v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="—" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="M.">M.</SelectItem>
            <SelectItem value="Mme">Mme</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <div className="hidden sm:block" />
      <Field label="Prénom"><Input {...text("prenom")} /></Field>
      <Field label="Nom"><Input {...text("nom")} /></Field>

      {value.type === "PROFESSIONNEL" ? (
        <>
          <Field label="Raison sociale"><Input {...text("raisonSociale")} /></Field>
          <Field label="SIRET"><Input {...text("siret")} /></Field>
          <Field label="Secteur d'activité" full><Input {...text("secteurActivite")} /></Field>
        </>
      ) : null}

      <MultiInput label="Téléphones" type="tel" values={value.phones} onChange={(v) => set("phones", v)} />
      <MultiInput label="Emails" type="email" values={value.emails} onChange={(v) => set("emails", v)} />

      <Field label="Adresse" full><Input {...text("adresse")} /></Field>
      <Field label="Code postal"><Input {...text("codePostal")} /></Field>
      <Field label="Ville"><Input {...text("ville")} /></Field>

      {compact ? null : (
        <>
          <Field label="Pays"><CountryInput value={value.pays} onChange={(v) => set("pays", v)} /></Field>
          <Field label="Nationalité"><Input {...text("nationalite")} /></Field>
          <Field label="Date de naissance"><Input type="date" {...text("dateNaissance")} /></Field>
          <Field label="Pays de naissance"><CountryInput value={value.paysNaissance} onChange={(v) => set("paysNaissance", v)} /></Field>
          <Field label="Pays de résidence"><CountryInput value={value.paysResidence} onChange={(v) => set("paysResidence", v)} /></Field>
          <Field label="Territoire de résidence"><Input {...text("territoireResidence")} /></Field>
          <Field label="N° de permis"><Input {...text("numeroPermis")} /></Field>
          <Field label="Pays du permis"><CountryInput value={value.paysPermis} onChange={(v) => set("paysPermis", v)} /></Field>
          <Field label="Date d'obtention du permis"><Input type="date" {...text("dateObtentionPermis")} /></Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <Checkbox checked={value.isVip} onCheckedChange={(v) => set("isVip", v === true)} /> Client VIP
          </label>
          <Field label="Notes" full><Textarea rows={3} {...text("notes")} /></Field>
        </>
      )}
    </div>
  )
}
