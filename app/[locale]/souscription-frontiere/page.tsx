import { getLocale } from "next-intl/server"

import { permanentRedirect } from "@/i18n/navigation"
import { PRODUCT_ROUTES } from "@/lib/constants"

interface SouscriptionFrontierePageProps {
  searchParams: Promise<{ duree?: string }>
}

// Le formulaire vit sur la page produit : cette adresse ne redirige plus que les anciens liens.
export default async function SouscriptionFrontierePage({ searchParams }: SouscriptionFrontierePageProps) {
  const { duree } = await searchParams
  const pathname = PRODUCT_ROUTES["assurance-frontiere"]

  permanentRedirect({
    href: duree ? `${pathname}?duree=${encodeURIComponent(duree)}` : pathname,
    locale: await getLocale(),
  })
}
