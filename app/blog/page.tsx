import type { Metadata } from "next"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"

export const metadata: Metadata = {
  title: "Blog",
  description: "Actualités et conseils sur l'assurance temporaire.",
}

export default function BlogPage() {
  return (
    <>
      <PageHero title="Blog" description="Cette page est en cours de préparation." />
      <section className="section-y">
        <Container className="mx-auto max-w-2xl text-center">
          <p className="text-balance leading-relaxed text-muted-foreground">
            Nos premiers articles arrivent bientôt. Revenez prochainement pour retrouver nos
            conseils et actualités sur l&apos;assurance temporaire.
          </p>
        </Container>
      </section>
    </>
  )
}
