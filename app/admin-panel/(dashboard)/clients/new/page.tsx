import { returnParam } from "@/lib/admin/return-path"
import { ClientForm } from "@/components/admin/client-form"

// Nouvelle fiche client / prospect en plein écran (?statut=CLIENT|PROSPECT, ?retour=…).
export default async function NewClientPage({ searchParams }: { searchParams: Promise<{ statut?: string; retour?: string }> }) {
  const { statut, retour } = await searchParams
  return (
    <ClientForm
      defaultStatut={statut === "CLIENT" ? "CLIENT" : "PROSPECT"}
      retour={returnParam(retour)}
    />
  )
}
