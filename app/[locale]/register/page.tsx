import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { AuthShell } from "@/components/layout/auth-shell"
import { RegisterForm } from "@/components/forms/register-form"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.register")
  return pageMetadata({
    path: "/register",
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: true },
  })
}

export default async function RegisterPage() {
  const t = await getTranslations("pages.register")

  return (
    <AuthShell
      title={t("title")}
      description={t("description")}
      footerText={t("footerText")}
      footerLinkLabel={t("footerLinkLabel")}
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  )
}
