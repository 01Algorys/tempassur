import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { AuthShell } from "@/components/layout/auth-shell"
import { LoginForm } from "@/components/forms/login-form"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.login")
  return pageMetadata({
    path: "/login",
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: true },
  })
}

export default async function LoginPage() {
  const t = await getTranslations("pages.login")

  return (
    <AuthShell
      title={t("title")}
      description={t("description")}
      footerText={t("footerText")}
      footerLinkLabel={t("footerLinkLabel")}
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthShell>
  )
}
