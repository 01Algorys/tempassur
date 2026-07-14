import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Logo } from "@/components/shared/logo"
import { TelLink } from "@/components/shared/tel-link"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { PRODUCT_ROUTES, VEHICLE_TYPES } from "@/lib/constants"
import { siteConfig } from "@/lib/site"

const INFO_LINKS = [
  { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Réclamation", href: "/reclamation" },
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGV", href: "/cgv" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
  { label: "Gérer mes cookies", href: "/politique-de-confidentialite#cookies" },
]

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl container-px py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo light />
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              TempAssur — L&apos;assurance temporaire de 1 à 90 jours, pour tous les véhicules. Attestation
              immédiate par e-mail ou WhatsApp.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-white">Nos assurances</p>
            <ul className="flex flex-col gap-2.5">
              {VEHICLE_TYPES.map((vehicle) => (
                <li key={vehicle.slug}>
                  <Link
                    href={PRODUCT_ROUTES[vehicle.slug]}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {vehicle.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/pays-couverts" className="text-sm text-white/60 transition-colors hover:text-white">
                  Pays couverts
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-white">Informations</p>
            <ul className="flex flex-col gap-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-white">Contact</p>
            <ul className="flex flex-col gap-2.5 text-sm text-white/60">
              <li>
                <TelLink phone={siteConfig.phone} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                  <Phone className="size-4 shrink-0" strokeWidth={2} />
                  {siteConfig.phone} (7j/7)
                </TelLink>
              </li>
              <li>
                <TelLink
                  phone={siteConfig.phoneSecondary}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Phone className="size-4 shrink-0" strokeWidth={2} />
                  {siteConfig.phoneSecondary}
                </TelLink>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Mail className="size-4 shrink-0" strokeWidth={2} />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.address} — Retrouvez-nous sur Google Maps
                </a>
              </li>
              <li className="pt-1">
                <WhatsappButton className="w-full justify-center" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl container-px flex flex-col items-center gap-2 py-6 text-center text-xs text-white/50 sm:flex-row sm:justify-between sm:text-left">
          <p>
            {siteConfig.legalName} — Courtier en assurances · ORIAS n°{siteConfig.orias} (
            <a href="https://www.orias.fr" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              www.orias.fr
            </a>
            ) · {siteConfig.reassuranceStatement} · Paiement sécurisé
          </p>
          <p>&copy; {siteConfig.name} {new Date().getFullYear()} — Tous droits réservés</p>
        </div>
      </div>
    </footer>
  )
}
