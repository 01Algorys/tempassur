import type { Metadata } from "next"

import { AuthShell } from "@/components/layout/auth-shell"
import { LoginForm } from "@/components/forms/login-form"

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte TempAssur pour gérer vos contrats et attestations.",
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Bon retour"
      description="Connectez-vous pour gérer vos contrats, retrouver vos attestations et suivre vos garanties."
      footerText="Vous n'avez pas de compte ?"
      footerLinkLabel="Créer un compte"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthShell>
  )
}
