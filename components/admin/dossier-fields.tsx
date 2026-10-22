"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CATEGORIES, type Categorie, type FieldDef } from "@/lib/admin/categories"

// Champs propres à la catégorie (catalogue lib/admin/categories.ts), groupés
// par section. `getValue`/`setValue` permettent au parent de router certains
// champs vers de vraies colonnes (contrat : marque, modèle, immatriculation).
export function CategoryFields({
  categorie,
  sousCategorie,
  details,
  getValue,
  setValue,
  hiddenKeys = [],
}: {
  categorie: Categorie
  sousCategorie: string
  details: Record<string, unknown>
  getValue: (field: FieldDef) => unknown
  setValue: (field: FieldDef, value: unknown) => void
  hiddenKeys?: string[]
}) {
  const fields = CATEGORIES[categorie].fields.filter(
    (f) => !hiddenKeys.includes(f.key) && (!f.showIf || f.showIf(details, sousCategorie))
  )
  const sections = [...new Set(fields.map((f) => f.section))]

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section} className="space-y-3">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{section}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields
              .filter((f) => f.section === section)
              .map((f) => (
                <FieldInput key={f.key} field={f} value={getValue(f)} onChange={(v) => setValue(f, v)} />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 self-end pb-2 text-sm">
        <Checkbox checked={value === true} onCheckedChange={(v) => onChange(v === true)} />
        {field.label}
      </label>
    )
  }

  const str = value === null || value === undefined ? "" : String(value)
  let input: React.ReactNode
  if (field.type === "select") {
    input = (
      <Select value={str || undefined} onValueChange={(v) => onChange(v === "__none" ? "" : v)}>
        <SelectTrigger className="w-full"><SelectValue placeholder="—" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__none">—</SelectItem>
          {field.options?.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  } else if (field.type === "textarea") {
    input = <Textarea rows={2} value={str} onChange={(e) => onChange(e.target.value)} />
  } else {
    input = (
      <Input
        type={field.type === "number" ? "number" : field.type}
        value={field.type === "date" ? str.slice(0, 10) : str}
        onChange={(e) => onChange(field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
      />
    )
  }

  return (
    <div className={field.full || field.type === "textarea" ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
      <Label>{field.label}</Label>
      {input}
    </div>
  )
}
