"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { PRODUCT_ROUTES, VEHICLE_TYPES } from "@/lib/constants"
import { getMinPrice } from "@/lib/pricing"

const currency = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 })

export function VehicleVignettes() {
  return (
    <section className="section-y bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <SectionHeading eyebrow="Nos véhicules" title="Nos assurances" />

        <Stagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VEHICLE_TYPES.map((vehicle) => {
            const Icon = vehicle.icon
            const price = getMinPrice(vehicle.slug)
            return (
              <StaggerItem key={vehicle.slug} className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-navy">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy">{vehicle.label}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{vehicle.description}</p>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      à partir de {currency.format(price)}/jour
                    </p>
                  </div>
                  <Link
                    href={PRODUCT_ROUTES[vehicle.slug]}
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
