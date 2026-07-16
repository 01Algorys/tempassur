import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { siteConfig } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.cgv.meta")
  return {
    title: t("title"),
    description: t("description", { siteName: siteConfig.name }),
    alternates: { canonical: `${siteConfig.url}/cgv` },
  }
}

interface LegalSection {
  title: string
  body: string
}

export default async function CgvPage() {
  const tLegal = await getTranslations("legal")
  const t = await getTranslations("legal.cgv")
  const sections = t.raw("sections") as LegalSection[]

  return (
    <>
      <PageHero eyebrow={tLegal("eyebrow")} title={t("pageTitle")} />
      <section className="section-y">
        <Container className="mx-auto flex max-w-3xl flex-col gap-10">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-navy">{section.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  )
}
