import { getLocale } from "next-intl/server"

import { permanentRedirect } from "@/i18n/navigation"
import { PRODUCT_ROUTES } from "@/lib/constants"
import { VEHICLE_SLUGS } from "@/types"
import type { VehicleSlug } from "@/types"

interface SouscriptionPageProps {
  searchParams: Promise<{ categorie?: string; duree?: string; paiement?: string }>
}

function isVehicleSlug(value: string | undefined): value is VehicleSlug {
  return !!value && (VEHICLE_SLUGS as readonly string[]).includes(value)
}

// Le formulaire vit sur les pages produit. Cette adresse ne sert plus qu'à rediriger les
// anciens liens et le retour d'un paiement échoué (`paiement`, voir /merci).
export default async function SouscriptionPage({ searchParams }: SouscriptionPageProps) {
  const { categorie, duree, paiement } = await searchParams
  const locale = await getLocale()

  // Permanent: /souscription is an old WordPress URL that search engines still have
  // indexed, so it must hand its signals over to the homepage instead of staying listed.
  if (!isVehicleSlug(categorie) && !paiement) {
    permanentRedirect({ href: "/#tarificateur", locale })
  }

  const pathname = PRODUCT_ROUTES[isVehicleSlug(categorie) ? categorie : "automobiles"]
  const query = new URLSearchParams({ ...(duree ? { duree } : {}), ...(paiement ? { paiement } : {}) }).toString()

  permanentRedirect({ href: query ? `${pathname}?${query}` : pathname, locale })
}
