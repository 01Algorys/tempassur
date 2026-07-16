import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import { Mail, MapPin, Phone } from "lucide-react"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { TelLink } from "@/components/shared/tel-link"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { ContactForm } from "@/components/forms/contact-form"
import { siteConfig } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.contact")
  return {
    title: { absolute: t("metaTitle") },
    alternates: { canonical: `${siteConfig.url}/contact` },
  }
}

export default function ContactPage() {
  const t = useTranslations("pages.contact")

  return (
    <>
      <PageHero title={t("heroTitle")} />
      <section className="section-y">
        <Container className="mx-auto grid max-w-4xl grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">{t("fastest")}</p>
              <WhatsappButton className="mt-2" />
            </div>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                <TelLink phone={siteConfig.phone} className="font-medium text-foreground hover:text-primary">
                  {siteConfig.phone}
                </TelLink>
                {" · "}
                <TelLink phone={siteConfig.phoneSecondary} className="font-medium text-foreground hover:text-primary">
                  {siteConfig.phoneSecondary}
                </TelLink>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <a href={`mailto:${siteConfig.email}`} className="font-medium text-foreground hover:text-primary">
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="font-medium text-foreground">
                  {t("addressLine", { address: siteConfig.address })}
                </span>
              </li>
            </ul>

            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title={t("mapTitle")}
                src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address)}&output=embed`}
                width="100%"
                height="260"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  )
}
