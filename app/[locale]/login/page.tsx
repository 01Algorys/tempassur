import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { AuthShell } from "@/components/layout/auth-shell"
import { LoginForm } from "@/components/forms/login-form"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.login")
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
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
