"use client"

import { useRouter } from "next/navigation"

import { ConformiteCard } from "@/components/admin/conformite-card"

// Contrôle Efficiale (gel des avoirs, PPE) du client, directement depuis la fiche devis
// ou contrat ; après un contrôle, la page se recharge pour mettre à jour le badge du client.
export function DossierConformiteCard({ clientId }: { clientId: string }) {
  const router = useRouter()
  return <ConformiteCard clientId={clientId} onChecked={() => router.refresh()} />
}
