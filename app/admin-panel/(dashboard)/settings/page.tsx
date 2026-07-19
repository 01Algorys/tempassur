"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2, Save, Trash2, UserPlus, KeyRound } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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
  createdAt: string
}

function SettingsInner() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get("tab") ?? "general")

  const [general, setGeneral] = useState<GeneralSettings>({})
  const [email, setEmail] = useState<EmailSettings>({})
  const [security, setSecurity] = useState<SecuritySettings>({ sessionTimeoutMinutes: 15, passwordMinLength: 8 })
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/crm/settings").then((r) => r.json()),
      fetch("/api/admin/crm/admin-users").then((r) => r.json()),
    ])
      .then(([settings, adminUsers]) => {
        if (settings.general) setGeneral(settings.general)
        if (settings.email) setEmail(settings.email)
        if (settings.security) setSecurity((s) => ({ ...s, ...settings.security }))
        setAdmins(Array.isArray(adminUsers) ? adminUsers : [])
      })
      .finally(() => setLoading(false))
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
          <TabsTrigger value="admins">Administrateurs</TabsTrigger>
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

        <TabsContent value="admins">
          <AdminsCard admins={admins} setAdmins={setAdmins} />
        </TabsContent>
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

function AdminsCard({ admins, setAdmins }: { admins: AdminUser[]; setAdmins: (a: AdminUser[]) => void }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<AdminUser["role"]>("ADMIN")
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/crm/admin-users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message ?? "Échec de création.")
      setAdmins([data, ...admins])
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de création.")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/crm/admin-users/${id}`, { method: "DELETE" })
    if (res.ok) setAdmins(admins.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter un administrateur</CardTitle>
          <CardDescription>Accès réservé — seul un super administrateur peut créer un compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom"><Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} /></Field>
            <Field label="Nom"><Input required value={lastName} onChange={(e) => setLastName(e.target.value)} /></Field>
            <Field label="Email"><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
            <Field label="Mot de passe"><Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
            <Field label="Rôle">
              <Select value={role} onValueChange={(v) => setRole(v as AdminUser["role"])}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">Super administrateur</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                </SelectContent>
              </Select>
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
              <div>
                <p className="font-medium text-foreground">{a.firstName} {a.lastName}</p>
                <p className="text-xs text-muted-foreground">{a.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{a.role}</Badge>
                <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(a.id)} aria-label="Supprimer">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
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
