import type { Metadata } from "next"
import Link from "next/link"
import { UserRound } from "lucide-react"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Connectez-vous ou créez un compte pour gérer vos contrats.",
}

export default function MonComptePage() {
  return (
    <>
      <PageHero
        icon={UserRound}
        title="Mon compte"
        description="Connectez-vous pour gérer vos contrats, ou créez un compte en quelques secondes."
      />
      <section className="section-y">
        <Container className="mx-auto flex max-w-md flex-col gap-3">
          <Button asChild size="lg">
            <Link href="/login">Se connecter</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register">Créer un compte</Link>
          </Button>
        </Container>
      </section>
    </>
  )
}
