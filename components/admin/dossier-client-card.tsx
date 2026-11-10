import Link from "next/link"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DetailField } from "@/components/admin/detail-field"
import { SiteBadge } from "@/components/admin/site-badge"
import { ConformiteBadge } from "@/components/admin/conformite-badge"
import { withReturn } from "@/lib/admin/return-path"
import { allEmails, allPhones, clientFullName, type ClientRecord } from "@/lib/admin/crm-types"

// Carte « Client » des fiches contrat / devis, avec accès direct à la modification
// de la fiche (email ou téléphone mal saisi…) puis retour sur le dossier.
export function DossierClientCard({ client, retour }: { client: ClientRecord | null; retour: string }) {
  return (
    <Card className="self-start">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>
          {client ? (
            <Link href={`/admin-panel/clients/${client.id}`} className="hover:underline">Client</Link>
          ) : (
            "Client"
          )}
        </CardTitle>
        {client ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={withReturn(`/admin-panel/clients/${client.id}/edit`, retour)}>
              <Pencil /> Modifier le client
            </Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <DetailField label="Nom" value={clientFullName(client) || "—"} />
        <DetailField label="Emails" value={allEmails(client).join("\n") || "—"} />
        <DetailField label="Téléphones" value={allPhones(client).join("\n") || "—"} />
        <DetailField label="Adresse" value={[client?.adresse, client?.codePostal, client?.ville].filter(Boolean).join(", ") || "—"} />
        <DetailField label="Site d'origine du client" value={<SiteBadge site={client?.siteOrigine} />} />
        <DetailField label="Conformité (gel des avoirs, PPE)" value={<ConformiteBadge statut={client?.conformiteStatut} />} />
      </CardContent>
    </Card>
  )
}
