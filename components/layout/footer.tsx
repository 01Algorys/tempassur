import Link from "next/link"

import { Logo } from "@/components/shared/logo"
import { siteConfig } from "@/lib/site"

const USEFUL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Conditions générales de vente", href: "/conditions-generales-de-vente" },
  { label: "Politique de confidentialité et de cookies", href: "/politique-de-confidentialite" },
]

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl container-px py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4">
            <Logo light />
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Assurance temporaire 100&nbsp;% en ligne, de 1 à 90 jours, pour tous types de véhicules.
            </p>
            <p className="max-w-xs text-xs leading-relaxed text-white/40">
              {siteConfig.legalName} — Courtier d&apos;assurance immatriculé ORIAS n°{siteConfig.orias}
              {" "}(orias.fr)
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-white">Liens utiles</p>
            <ul className="flex flex-col gap-2.5">
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl container-px py-6 text-center text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} {siteConfig.legalName}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
