import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description: `Contactez l'équipe ${siteConfig.name}.`,
}

const CONTACT_DETAILS = [
  { icon: Phone, label: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
  {
    icon: Phone,
    label: siteConfig.phoneSecondary,
    href: `tel:${siteConfig.phoneSecondary.replace(/\s/g, "")}`,
  },
  { icon: Mail, label: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: MapPin, label: siteConfig.address, href: undefined },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contactez-nous"
        description="Une question sur votre contrat ou votre devis ? Notre équipe est disponible 24h/24 et 7j/7 pour vous répondre."
      />
      <section className="section-y">
        <Container className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <ul className="flex flex-col gap-4">
            {CONTACT_DETAILS.map((detail) => (
              <li key={detail.label} className="flex items-center justify-center gap-3 text-muted-foreground">
                <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-navy">
                  <detail.icon className="size-4" />
                </span>
                {detail.href ? (
                  <a href={detail.href} className="text-sm font-medium text-foreground hover:text-primary">
                    {detail.label}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-foreground">{detail.label}</span>
                )}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" variant="cta" className="rounded-full">
            <Link href="/#quote">Demander un devis</Link>
          </Button>
        </Container>
      </section>
    </>
  )
}
