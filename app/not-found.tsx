import Link from "next/link"

import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="section-y">
      <Container className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          Oups, cette page n&apos;existe pas.
        </h1>
        <p className="text-balance leading-relaxed text-muted-foreground">
          Pas de panique : votre assurance, elle, est bien là.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="cta" className="rounded-full">
            <Link href="/#tarificateur">Estimer mon tarif en 30 secondes</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Ou écrivez-nous sur WhatsApp :{" "}
          <WhatsappButton className="ml-1 inline-flex align-middle" />
        </p>
      </Container>
    </section>
  )
}
