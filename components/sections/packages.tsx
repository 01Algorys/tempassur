"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { PACKAGES } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function Packages() {
  return (
    <section id="packages" className="section-y bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <SectionHeading
          eyebrow="Nos véhicules"
          title="Une formule pour chaque véhicule"
          description="Un tarif clair par jour, sans frais cachés — choisissez votre véhicule pour découvrir votre formule."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg) => {
            const Icon = pkg.icon
            return (
              <StaggerItem key={pkg.id} className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className={cn(
                    "flex h-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-900/5",
                    pkg.featured ? "border-primary shadow-md shadow-primary/10" : "border-border"
                  )}
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-navy">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy">{pkg.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pkg.tagline}</p>
                  </div>
                  <Link
                    href={pkg.href}
                    className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary hover:underline"
                  >
                    En savoir plus
                    <ArrowRight className="size-3.5" />
                  </Link>
                </motion.div>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
