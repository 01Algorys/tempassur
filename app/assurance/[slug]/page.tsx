import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, LifeBuoy, Scale, ShieldCheck } from "lucide-react"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { Button } from "@/components/ui/button"
import { SubscriptionWizard } from "@/components/forms/subscription/subscription-wizard"
import { VEHICLE_TYPES } from "@/lib/constants"
import { VEHICLE_CONTENT } from "@/lib/vehicle-content"

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "Responsabilité civile",
    description:
      "Garantie obligatoire couvrant les dommages matériels et corporels causés à des tiers en cas d'accident responsable.",
  },
  {
    icon: Scale,
    title: "Défense pénale et recours",
    description:
      "Défense de vos intérêts en cas de poursuite pénale suite à un accident, et recours contre le responsable des dommages.",
  },
  {
    icon: LifeBuoy,
    title: "Assistance",
    description:
      "Incluse automatiquement pour les contrats de moins de 15 jours sous conditions d'éligibilité, optionnelle au-delà. Panne, accident, vandalisme et vol pour les véhicules de moins de 10 ans ; accident, vandalisme et vol pour les véhicules plus anciens.",
  },
]

interface VehicleTypePageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ duree?: string; email?: string }>
}

export function generateStaticParams() {
  return VEHICLE_TYPES.map((vehicle) => ({ slug: vehicle.slug }))
}

export async function generateMetadata({ params }: VehicleTypePageProps): Promise<Metadata> {
  const { slug } = await params
  const vehicle = VEHICLE_TYPES.find((item) => item.slug === slug)

  if (!vehicle) return {}

  return {
    title: `Assurance temporaire ${vehicle.label}`,
    description: vehicle.description,
  }
}

export default async function VehicleTypePage({ params, searchParams }: VehicleTypePageProps) {
  const { slug } = await params
  const { duree, email } = await searchParams
  const vehicle = VEHICLE_TYPES.find((item) => item.slug === slug)
  const content = VEHICLE_CONTENT[slug]

  if (!vehicle || !content) notFound()

  return (
    <>
      <PageHero
        eyebrow="Je m'assure"
        title={`Assurance temporaire ${vehicle.label}`}
        description={vehicle.description}
        icon={vehicle.icon}
      />

      <section className="section-y">
        <Container className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <p className="text-balance leading-relaxed text-muted-foreground">{content.intro}</p>

          <ul className="flex flex-col items-start gap-3 self-center text-left">
            {content.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-sm font-medium text-foreground/80">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={3} />
                {reason}
              </li>
            ))}
          </ul>

          <Button asChild size="lg" variant="cta" className="rounded-full">
            <Link href="#souscription">Souscrire en ligne</Link>
          </Button>
        </Container>
      </section>

      <section className="section-y bg-surface">
        <Container>
          <h2 className="text-balance text-center text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Nos garanties
          </h2>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
            {GUARANTEES.map((guarantee) => (
              <div
                key={guarantee.title}
                className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-navy">
                  <guarantee.icon className="size-5" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-navy">{guarantee.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {guarantee.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-y">
        <Container>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">Véhicules concernés</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.coverage}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">Durée</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.duration}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">Tarif</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.price}</p>
            </div>
          </div>
        </Container>
      </section>

      <section id="souscription" className="section-y bg-surface">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-balance text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Souscrivez votre assurance temporaire {vehicle.label.toLowerCase()}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Complétez le formulaire en quelques étapes : le montant de votre cotisation se met à jour en temps
              réel dans le récapitulatif ci-contre.
            </p>
          </div>

          <SubscriptionWizard
            slug={vehicle.slug}
            vehicleLabel={vehicle.label}
            initialDuree={duree ? Number(duree) : undefined}
            initialEmail={email}
          />
        </Container>
      </section>
    </>
  )
}
