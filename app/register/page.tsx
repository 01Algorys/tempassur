import type { Metadata } from "next"

import { AuthShell } from "@/components/layout/auth-shell"
import { RegisterForm } from "@/components/forms/register-form"

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez gratuitement votre compte TempAssur pour obtenir un devis instantané et gérer vos contrats en ligne.",
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Créez votre compte"
      description="Rejoignez les conducteurs qui gèrent leur assurance temporaire en ligne avec TempAssur."
      footerText="Vous avez déjà un compte ?"
      footerLinkLabel="Se connecter"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  )
}
