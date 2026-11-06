"use client"

import { useMemo } from "react"
import { Link } from "@/i18n/navigation"
// Imports par icône : le point d'entrée général embarquerait toute la bibliothèque.
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight"
import { Bus } from "@phosphor-icons/react/dist/csr/Bus"
import { Car } from "@phosphor-icons/react/dist/csr/Car"
import { GlobeHemisphereWest } from "@phosphor-icons/react/dist/csr/GlobeHemisphereWest"
import { Jeep } from "@phosphor-icons/react/dist/csr/Jeep"
import { Tractor } from "@phosphor-icons/react/dist/csr/Tractor"
import { Truck } from "@phosphor-icons/react/dist/csr/Truck"
import { TruckTrailer } from "@phosphor-icons/react/dist/csr/TruckTrailer"
import { Van } from "@phosphor-icons/react/dist/csr/Van"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"

import { SectionHeading } from "@/components/shared/section-heading"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { PRODUCT_ROUTES, VEHICLE_TYPES } from "@/lib/constants"
import { getMinPricePerDay } from "@/lib/pricing"
import { cn } from "@/lib/utils"
import type { VehicleSlug } from "@/types"

const CARD_ICONS: Record<VehicleSlug, PhosphorIcon> = {
  automobiles: Car,
  "poids-lourds": Truck,
  "camping-cars": Van,
  quadricycles: Jeep,
  "bus-autocars": Bus,
  "tracteurs-agricoles": Tractor,
  remorques: TruckTrailer,
  "assurance-frontiere": GlobeHemisphereWest,
}

// Sur grand écran, 7 cartes + la carte frontière sur 2 colonnes remplissent 3 × 3.
const FEATURED_SLUG: VehicleSlug = "assurance-frontiere"

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

        <Stagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VEHICLE_TYPES.map((vehicle) => {
            const Icon = CARD_ICONS[vehicle.slug]
            const featured = vehicle.slug === FEATURED_SLUG
            const price = currency.format(getMinPricePerDay(vehicle.slug))
            return (
              <StaggerItem key={vehicle.slug} className={cn("h-full", featured && "lg:col-span-2")}>
                <Link
                  href={PRODUCT_ROUTES[vehicle.slug]}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 transition duration-300 outline-none hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-primary/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7",
                    featured
                      ? "border-navy bg-navy text-white shadow-lg shadow-navy/20 hover:shadow-xl hover:shadow-navy/30"
                      : "border-border bg-white shadow-sm hover:border-primary/30 hover:shadow-xl hover:shadow-slate-900/8"
                  )}
                >
                  {featured ? (
                    <Icon
                      aria-hidden
                      weight="duotone"
                      className="pointer-events-none absolute -end-10 -bottom-12 size-64 text-white/6"
                    />
                  ) : null}

                  <span
                    className={cn(
                      "relative flex size-14 items-center justify-center rounded-2xl transition-colors duration-300",
                      featured
                        ? "bg-white/10 text-white group-hover:bg-orange"
                        : "bg-primary/8 text-primary group-hover:bg-primary group-hover:text-white"
                    )}
                  >
                    <Icon aria-hidden weight="duotone" className="size-8" />
                  </span>

                  <h3 className={cn("relative mt-5 text-xl font-bold tracking-tight", featured ? "text-white" : "text-navy")}>
                    {tVehicles(`${vehicle.slug}.label`)}
                  </h3>
                  <p
                    className={cn(
                      "relative mt-2 text-sm leading-relaxed",
                      featured ? "max-w-xl text-white/75" : "text-muted-foreground"
                    )}
                  >
                    {tVehicles(`${vehicle.slug}.description`)}
                  </p>

                  <div
                    className={cn(
                      "relative mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-6"
                    )}
                  >
                    <p className={cn("text-sm first-letter:uppercase", featured ? "text-white/75" : "text-muted-foreground")}>
                      {t.rich("priceFrom", {
                        price,
                        strong: (chunks) => (
                          <strong className={cn("text-base font-bold", featured ? "text-white" : "text-navy")}>
                            {chunks}
                          </strong>
                        ),
                      })}
                    </p>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-semibold",
                        featured ? "text-orange-light" : "text-primary"
                      )}
                    >
                      {t("cta")}
                      <ArrowRight
                        aria-hidden
                        weight="bold"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none rtl:rotate-180 rtl:group-hover:-translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
