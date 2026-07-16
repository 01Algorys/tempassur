import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { UserRound } from "lucide-react"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { Button } from "@/components/ui/button"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.monCompte")
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default function MonComptePage() {
  const t = useTranslations("pages.monCompte")

  return (
    <>
      <PageHero icon={UserRound} title={t("heroTitle")} description={t("heroDescription")} />
      <section className="section-y">
        <Container className="mx-auto flex max-w-md flex-col gap-3">
          <Button asChild size="lg">
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register">{t("register")}</Link>
          </Button>
        </Container>
      </section>
    </>
  )
}
