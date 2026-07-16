"use client"

import { useMemo } from "react"
import { Link } from "@/i18n/navigation"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { PRODUCT_ROUTES, VEHICLE_TYPES } from "@/lib/constants"
import { getMinPricePerDay } from "@/lib/pricing"

export function VehicleVignettes() {
  const t = useTranslations("home.vehicleVignettes")
  const tVehicles = useTranslations("vehicleTypes")
  const locale = useLocale()
  const currency = useMemo(
    () => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [locale]
  )

  return (
    <section className="section-y bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <Stagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VEHICLE_TYPES.map((vehicle) => {
            const Icon = vehicle.icon
            const price = getMinPricePerDay(vehicle.slug)
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
                    <h3 className="text-lg font-bold text-navy">{tVehicles(`${vehicle.slug}.label`)}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {tVehicles(`${vehicle.slug}.description`)}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {t("priceFrom", { price: currency.format(price) })}
                    </p>
                  </div>
                  <Link
                    href={PRODUCT_ROUTES[vehicle.slug]}
                    className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {t("cta")}
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
