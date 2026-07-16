import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"

export default async function NotFound() {
  const t = await getTranslations("pages.notFound")

  return (
    <section className="section-y">
      <Container className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          {t("title")}
        </h1>
        <p className="text-balance leading-relaxed text-muted-foreground">{t("subtitle")}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="cta" className="rounded-full">
            <Link href="/#tarificateur">{t("ctaEstimate")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/">{t("ctaHome")}</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("contactPrompt")} <WhatsappButton className="ml-1 inline-flex align-middle" />
        </p>
      </Container>
    </section>
  )
}
