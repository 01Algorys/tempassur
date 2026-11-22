"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, Save, Trash2, UserPlus, KeyRound, Pencil } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PERMISSIONS } from "@/lib/admin/permissions"

interface GeneralSettings {
  platformName?: string
  companyName?: string
  companyAddress?: string
  contactEmail?: string
  contactPhone?: string
}
interface EmailSettings {
  senderName?: string
  replyTo?: string
}
interface SecuritySettings {
  sessionTimeoutMinutes?: number
  passwordMinLength?: number
}
interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "SUPER_ADMIN" | "ADMIN" | "COMMERCIAL"
  permissions?: string[]
  createdAt: string
}

function SettingsInner() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get("tab") ?? "general")

  const [general, setGeneral] = useState<GeneralSettings>({})
  const [email, setEmail] = useState<EmailSettings>({})
  const [security, setSecurity] = useState<SecuritySettings>({ sessionTimeoutMinutes: 15, passwordMinLength: 8 })
  const [admins, setAdmins] = useState<AdminUser[]>([])
  // Gestion des comptes : onglet visible seulement pour un super administrateur (accès complet).
  const [isSuper, setIsSuper] = useState(false)
  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const me = await fetch("/api/admin/auth/me").then((r) => r.json()).catch(() => null)
      const superAdmin = me?.user?.role === "SUPER_ADMIN"
      setIsSuper(superAdmin)
      const [settings, adminUsers] = await Promise.all([
        fetch("/api/admin/crm/settings").then((r) => r.json()).catch(() => ({})),
        superAdmin ? fetch("/api/admin/crm/admin-users").then((r) => r.json()).catch(() => []) : Promise.resolve([]),
      ])
      if (settings.general) setGeneral(settings.general)
      if (settings.email) setEmail(settings.email)
      if (settings.security) setSecurity((s) => ({ ...s, ...settings.security }))
      setAdmins(Array.isArray(adminUsers) ? adminUsers : [])
    }
    load().finally(() => setLoading(false))
  }, [])

  async function saveSection(key: "general" | "email" | "security", value: GeneralSettings | EmailSettings | SecuritySettings) {
    setSaving(key)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/crm/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key, value }),
      })
      if (!res.ok) throw new Error()
      setMessage("Enregistré.")
    } catch {
      setMessage("Échec de l'enregistrement.")
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Chargement...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Configuration générale, email, sécurité et comptes administrateurs</p>
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          {isSuper ? <TabsTrigger value="admins">Administrateurs</TabsTrigger> : null}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Nom de la plateforme et coordonnées affichées dans les documents générés.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom de la plateforme">
                <Input value={general.platformName ?? ""} onChange={(e) => setGeneral((g) => ({ ...g, platformName: e.target.value }))} />
              </Field>
              <Field label="Nom de l'entreprise">
                <Input value={general.companyName ?? ""} onChange={(e) => setGeneral((g) => ({ ...g, companyName: e.target.value }))} />
              </Field>
              <Field label="Email de contact">
                <Input type="email" value={general.contactEmail ?? ""} onChange={(e) => setGeneral((g) => ({ ...g, contactEmail: e.target.value }))} />
              </Field>
              <Field label="Téléphone de contact">
                <Input value={general.contactPhone ?? ""} onChange={(e) => setGeneral((g) => ({ ...g, contactPhone: e.target.value }))} />
              </Field>
              <Field label="Adresse" full>
                <Textarea value={general.companyAddress ?? ""} onChange={(e) => setGeneral((g) => ({ ...g, companyAddress: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <Button onClick={() => saveSection("general", general)} disabled={saving === "general"}>
                  <Save /> Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Expéditeur des emails</CardTitle>
              <CardDescription>
                L&apos;envoi SMTP lui-même est configuré côté serveur (variables d&apos;environnement) — ces champs servent aux
                gabarits d&apos;email affichés, pas à la connexion SMTP.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom de l'expéditeur">
                <Input value={email.senderName ?? ""} onChange={(e) => setEmail((v) => ({ ...v, senderName: e.target.value }))} />
              </Field>
              <Field label="Adresse de réponse (reply-to)">
                <Input type="email" value={email.replyTo ?? ""} onChange={(e) => setEmail((v) => ({ ...v, replyTo: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <Button onClick={() => saveSection("email", email)} disabled={saving === "email"}>
                  <Save /> Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <CardDescription>Durée d&apos;inactivité avant déconnexion automatique.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Timeout de session (minutes)">
                <Input
                  type="number"
                  min={1}
                  max={240}
                  value={security.sessionTimeoutMinutes ?? 15}
                  onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeoutMinutes: Number(e.target.value) }))}
                />
              </Field>
              <Field label="Longueur minimale du mot de passe">
                <Input
                  type="number"
                  min={8}
                  max={64}
                  value={security.passwordMinLength ?? 8}
                  onChange={(e) => setSecurity((s) => ({ ...s, passwordMinLength: Number(e.target.value) }))}
                />
              </Field>
              <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground sm:col-span-2">
                Authentification à deux facteurs : pas encore implémentée dans cette version — aucun contrôle actif tant que ce
                n&apos;est pas construit (pas de faux interrupteur ici).
              </div>
              <div className="sm:col-span-2">
                <Button onClick={() => saveSection("security", security)} disabled={saving === "security"}>
                  <Save /> Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>

          <ChangePasswordCard />
        </TabsContent>

        {isSuper ? (
          <TabsContent value="admins">
            <AdminsCard admins={admins} setAdmins={setAdmins} />
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  )
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message ?? "Échec.")
      setStatus({ type: "success", message: "Mot de passe modifié." })
      setCurrentPassword("")
      setNewPassword("")
    } catch (err) {
      setStatus({ type: "error", message: err instanceof Error ? err.message : "Échec." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changer le mot de passe</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Mot de passe actuel">
            <Input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </Field>
          <Field label="Nouveau mot de passe">
            <Input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Field>
          {status ? (
            <p className={`sm:col-span-2 text-sm ${status.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
              {status.message}
            </p>
          ) : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={loading}>
              <KeyRound /> Mettre à jour
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

type AccessType = "full" | "limited"

const ALL_PERMISSIONS = PERMISSIONS.map((p) => p.key as string)

function accessLabel(a: AdminUser): string {
  if (a.role === "SUPER_ADMIN") return "Accès complet"
  if (a.role === "ADMIN") {
    const n = a.permissions?.length ?? 0
    return n ? `Accès limité · ${n} rubrique${n > 1 ? "s" : ""}` : "Accès limité · aucune rubrique"
  }
  return "Commercial (sans accès au panneau)"
}

/** Choix du type d'accès et des rubriques, pour la création comme pour la modification. */
function AccessEditor({
  type,
  setType,
  permissions,
  setPermissions,
  idPrefix,
}: {
  type: AccessType
  setType: (t: AccessType) => void
  permissions: string[]
  setPermissions: (p: string[]) => void
  idPrefix: string
}) {
  const toggle = (key: string, on: boolean) =>
    setPermissions(on ? Array.from(new Set([...permissions, key])) : permissions.filter((p) => p !== key))
  return (
    <div className="space-y-3">
      <RadioGroup value={type} onValueChange={(v) => setType(v as AccessType)} className="grid gap-2 sm:grid-cols-2">
        <Label htmlFor={`${idPrefix}-full`} className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 font-normal">
          <RadioGroupItem value="full" id={`${idPrefix}-full`} className="mt-0.5" />
          <span>
            <span className="block font-medium text-foreground">Accès complet</span>
            <span className="text-xs text-muted-foreground">Toutes les rubriques, y compris la gestion des comptes administrateurs.</span>
          </span>
        </Label>
        <Label htmlFor={`${idPrefix}-limited`} className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 font-normal">
          <RadioGroupItem value="limited" id={`${idPrefix}-limited`} className="mt-0.5" />
          <span>
            <span className="block font-medium text-foreground">Accès limité</span>
            <span className="text-xs text-muted-foreground">Seulement les rubriques cochées ci-dessous.</span>
          </span>
        </Label>
      </RadioGroup>
      {type === "limited" ? (
        <div className="rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">Rubriques autorisées</p>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setPermissions(ALL_PERMISSIONS)}>Tout cocher</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setPermissions([])}>Tout décocher</Button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {PERMISSIONS.map((p) => (
              <Label key={p.key} htmlFor={`${idPrefix}-${p.key}`} className="flex cursor-pointer items-center gap-2 font-normal">
                <Checkbox id={`${idPrefix}-${p.key}`} checked={permissions.includes(p.key)} onCheckedChange={(v) => toggle(p.key, v === true)} />
                {p.label}
              </Label>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function AdminsCard({ admins, setAdmins }: { admins: AdminUser[]; setAdmins: (a: AdminUser[]) => void }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [type, setType] = useState<AccessType>("limited")
  const [permissions, setPermissions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [editType, setEditType] = useState<AccessType>("limited")
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [editError, setEditError] = useState<string | null>(null)
  const [savingEdit, setSavingEdit] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (type === "limited" && permissions.length === 0) {
      setError("Cochez au moins une rubrique pour un accès limité.")
      return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/admin/crm/admin-users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role: type === "full" ? "SUPER_ADMIN" : "ADMIN",
          permissions: type === "full" ? [] : permissions,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message ?? "Échec de création.")
      setAdmins([data, ...admins])
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setPermissions([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de création.")
    } finally {
      setCreating(false)
    }
  }

  function openEdit(a: AdminUser) {
    setEditing(a)
    setEditType(a.role === "SUPER_ADMIN" ? "full" : "limited")
    setEditPermissions(a.permissions ?? [])
    setEditError(null)
  }

  async function handleSaveEdit() {
    if (!editing) return
    setEditError(null)
    if (editType === "limited" && editPermissions.length === 0) {
      setEditError("Cochez au moins une rubrique pour un accès limité.")
      return
    }
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/admin/crm/admin-users/${editing.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role: editType === "full" ? "SUPER_ADMIN" : "ADMIN", permissions: editType === "full" ? [] : editPermissions }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message ?? "Échec de l'enregistrement.")
      setAdmins(admins.map((a) => (a.id === data.id ? data : a)))
      setEditing(null)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Échec de l'enregistrement.")
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleDelete(a: AdminUser) {
    if (!window.confirm(`Supprimer le compte de ${a.firstName} ${a.lastName} (${a.email}) ? Il ne pourra plus se connecter.`)) return
    const res = await fetch(`/api/admin/crm/admin-users/${a.id}`, { method: "DELETE" })
    if (res.ok) setAdmins(admins.filter((x) => x.id !== a.id))
    else {
      const data = await res.json().catch(() => ({}))
      window.alert(data?.message ?? "Suppression impossible.")
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un administrateur</CardTitle>
          <CardDescription>Accès complet, ou accès limité aux rubriques que vous cochez. Seul un compte à accès complet peut gérer les comptes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom"><Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Field>
            <Field label="Nom"><Input required value={lastName} onChange={(e) => setLastName(e.target.value)} /></Field>
            <Field label="Email"><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field label="Mot de passe"><Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
            <Field label="Type d'accès" full>
              <AccessEditor type={type} setType={setType} permissions={permissions} setPermissions={setPermissions} idPrefix="new" />
            </Field>
            {error ? <p className="text-sm text-destructive sm:col-span-2">{error}</p> : null}
            <div className="sm:col-span-2">
              <Button type="submit" disabled={creating}>
                <UserPlus /> Créer le compte
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="p-0">
        <CardHeader><CardTitle className="px-1">Comptes existants</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {admins.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{a.firstName} {a.lastName}</p>
                <p className="truncate text-xs text-muted-foreground">{a.email}</p>
                {a.role === "ADMIN" && a.permissions?.length ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {PERMISSIONS.filter((p) => a.permissions?.includes(p.key)).map((p) => p.label).join(" · ")}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant={a.role === "SUPER_ADMIN" ? "default" : "outline"}>{accessLabel(a)}</Badge>
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(a)} aria-label={`Modifier l'accès de ${a.firstName} ${a.lastName}`}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(a)} aria-label={`Supprimer le compte de ${a.firstName} ${a.lastName}`}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={editing !== null} onOpenChange={(open) => (open ? null : setEditing(null))}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Accès de {editing?.firstName} {editing?.lastName}</DialogTitle>
            <DialogDescription>{editing?.email} · les changements s&apos;appliquent immédiatement.</DialogDescription>
          </DialogHeader>
          <AccessEditor type={editType} setType={setEditType} permissions={editPermissions} setPermissions={setEditPermissions} idPrefix="edit" />
          {editError ? <p className="text-sm text-destructive">{editError}</p> : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
            <Button onClick={handleSaveEdit} disabled={savingEdit}><Save /> Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsInner />
    </Suspense>
  )
}
