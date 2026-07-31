"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { ClientPicker } from "@/components/admin/client-picker"

interface Reference {
  id: string
  nom: string
}

interface ClientOption {
  id: string
  nom?: string | null
  prenom?: string | null
  email?: string | null
}

// Only fields the backend actually accepts on create (numero/clientId/prime required,
// everything else optional) or update (numero/clientId are immutable post-creation).
const formSchema = z.object({
  numero: z.string().min(1, "Le numéro est requis."),
  clientId: z.string().min(1, "Le client est requis."),
  prime: z.string().min(1, "La prime est requise."),
  numeroDemande: z.string().optional(),
  honoraires: z.string().optional(),
  distributeurId: z.string().optional(),
  produitId: z.string().optional(),
  statutRefId: z.string().optional(),
  marque: z.string().optional(),
  modele: z.string().optional(),
  immatriculation: z.string().optional(),
  dateEffet: z.string().optional(),
  dateFin: z.string().optional(),
  dureeJours: z.string().optional(),
  besoinsExprimes: z.string().optional(),
  notesInternes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export interface ContractFormInitial {
  id: string
  numero: string
  numeroDemande?: string | null
  prime: number
  honoraires?: number | null
  distributeurId?: string | null
  produitId?: string | null
  statutRefId?: string | null
  marque?: string | null
  modele?: string | null
  immatriculation?: string | null
  dateEffet?: string | null
  dateFin?: string | null
  dureeJours?: number | null
  besoinsExprimes?: string | null
  notesInternes?: string | null
  client: ClientOption | null
}

function toDateInput(value?: string | null): string {
  if (!value) return ""
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

export function ContractFormDialog({
  open,
  onOpenChange,
  mode,
  initial,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  initial?: ContractFormInitial
  onSuccess?: (contratId: string) => void
}) {
  const router = useRouter()
  const [statuts, setStatuts] = useState<Reference[]>([])
  const [produits, setProduits] = useState<Reference[]>([])
  const [distributeurs, setDistributeurs] = useState<Reference[]>([])
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(initial?.client ?? null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numero: initial?.numero ?? "",
      clientId: initial?.client?.id ?? "",
      prime: initial?.prime !== undefined ? String(initial.prime) : "",
      numeroDemande: initial?.numeroDemande ?? "",
      honoraires: initial?.honoraires !== undefined && initial?.honoraires !== null ? String(initial.honoraires) : "",
      distributeurId: initial?.distributeurId ?? "",
      produitId: initial?.produitId ?? "",
      statutRefId: initial?.statutRefId ?? "",
      marque: initial?.marque ?? "",
      modele: initial?.modele ?? "",
      immatriculation: initial?.immatriculation ?? "",
      dateEffet: toDateInput(initial?.dateEffet),
      dateFin: toDateInput(initial?.dateFin),
      dureeJours: initial?.dureeJours !== undefined && initial?.dureeJours !== null ? String(initial.dureeJours) : "",
      besoinsExprimes: initial?.besoinsExprimes ?? "",
      notesInternes: initial?.notesInternes ?? "",
    },
  })

  useEffect(() => {
    if (!open) return
    setError(null)
    setSelectedClient(initial?.client ?? null)
    form.reset({
      numero: initial?.numero ?? "",
      clientId: initial?.client?.id ?? "",
      prime: initial?.prime !== undefined ? String(initial.prime) : "",
      numeroDemande: initial?.numeroDemande ?? "",
      honoraires: initial?.honoraires !== undefined && initial?.honoraires !== null ? String(initial.honoraires) : "",
      distributeurId: initial?.distributeurId ?? "",
      produitId: initial?.produitId ?? "",
      statutRefId: initial?.statutRefId ?? "",
      marque: initial?.marque ?? "",
      modele: initial?.modele ?? "",
      immatriculation: initial?.immatriculation ?? "",
      dateEffet: toDateInput(initial?.dateEffet),
      dateFin: toDateInput(initial?.dateFin),
      dureeJours: initial?.dureeJours !== undefined && initial?.dureeJours !== null ? String(initial.dureeJours) : "",
      besoinsExprimes: initial?.besoinsExprimes ?? "",
      notesInternes: initial?.notesInternes ?? "",
    })

    fetch("/api/admin/crm/contrats?full=1&page=1")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return
        setStatuts(data.statuts ?? [])
        setProduits(data.produits ?? [])
        setDistributeurs(data.distributeurs ?? [])
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial?.id])

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setError(null)
    try {
      const clean = <T,>(v: T) => (v === "" ? undefined : v)
      const toNumber = (v: string | undefined) => (v && v.trim() !== "" ? Number(v) : undefined)
      if (mode === "create") {
        const res = await fetch("/api/admin/crm/contrats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            numero: values.numero,
            clientId: values.clientId,
            prime: toNumber(values.prime),
            numeroDemande: clean(values.numeroDemande),
            honoraires: toNumber(values.honoraires),
            distributeurId: clean(values.distributeurId),
            produitId: clean(values.produitId),
            marque: clean(values.marque),
            modele: clean(values.modele),
            immatriculation: clean(values.immatriculation),
            dateEffet: clean(values.dateEffet),
            dateFin: clean(values.dateFin),
            dureeJours: toNumber(values.dureeJours),
            besoinsExprimes: clean(values.besoinsExprimes),
            notesInternes: clean(values.notesInternes),
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.message ?? "Échec de la création du contrat.")
        }
        const created = await res.json()
        onOpenChange(false)
        onSuccess?.(created.id)
        router.push(`/admin-panel/contracts/${created.id}`)
      } else if (initial) {
        const res = await fetch(`/api/admin/crm/contrats/${initial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prime: toNumber(values.prime),
            honoraires: toNumber(values.honoraires),
            distributeurId: clean(values.distributeurId) ?? null,
            produitId: clean(values.produitId) ?? null,
            statutRefId: clean(values.statutRefId) ?? null,
            marque: clean(values.marque) ?? null,
            modele: clean(values.modele) ?? null,
            immatriculation: clean(values.immatriculation) ?? null,
            dateEffet: clean(values.dateEffet) ?? null,
            dateFin: clean(values.dateFin),
            dureeJours: toNumber(values.dureeJours) ?? null,
            besoinsExprimes: clean(values.besoinsExprimes) ?? null,
            notesInternes: clean(values.notesInternes) ?? null,
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => null)
          throw new Error(data?.message ?? "Échec de la mise à jour du contrat.")
        }
        onOpenChange(false)
        onSuccess?.(initial.id)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nouveau contrat" : "Modifier le contrat"}</DialogTitle>
          <DialogDescription>
            Seuls le numéro, le client et la prime sont obligatoires — tous les autres champs sont optionnels.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={mode === "edit"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prime (€) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="clientId"
              render={() => (
                <FormItem>
                  <FormLabel>Client *</FormLabel>
                  <FormControl>
                    <ClientPicker
                      value={form.watch("clientId")}
                      selected={selectedClient}
                      onChange={(client) => {
                        setSelectedClient(client)
                        form.setValue("clientId", client?.id ?? "", { shouldValidate: true })
                      }}
                    />
                  </FormControl>
                  {mode === "edit" ? (
                    <p className="text-xs text-muted-foreground">Le client d&apos;un contrat existant ne peut pas être changé.</p>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="numeroDemande"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N° de demande</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={mode === "edit"} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="honoraires"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Honoraires (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="produitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produit</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Aucun" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {produits.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distributeurId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distributeur</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Aucun" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {distributeurs.map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {mode === "edit" ? (
              <FormField
                control={form.control}
                name="statutRefId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Aucun" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuts.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            ) : null}

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="marque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modele"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="immatriculation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immatriculation</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="dateEffet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d&apos;effet</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dureeJours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (jours)</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="besoinsExprimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Besoins exprimés</FormLabel>
                  <FormControl><Textarea rows={2} {...field} /></FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notesInternes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes internes</FormLabel>
                  <FormControl><Textarea rows={2} {...field} /></FormControl>
                </FormItem>
              )}
            />

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Enregistrement..." : mode === "create" ? "Créer le contrat" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
