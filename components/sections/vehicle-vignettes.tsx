"use client"

import { useMemo } from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
// Imports par icône : le point d'entrée général embarquerait toute la bibliothèque.
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight"
import { Bus } from "@phosphor-icons/react/dist/csr/Bus"
import { Car } from "@phosphor-icons/react/dist/csr/Car"
import { CaretRight } from "@phosphor-icons/react/dist/csr/CaretRight"
import { GlobeHemisphereWest } from "@phosphor-icons/react/dist/csr/GlobeHemisphereWest"
import { Jeep } from "@phosphor-icons/react/dist/csr/Jeep"
import { Tractor } from "@phosphor-icons/react/dist/csr/Tractor"
import { Truck } from "@phosphor-icons/react/dist/csr/Truck"
import { TruckTrailer } from "@phosphor-icons/react/dist/csr/TruckTrailer"
import { Van } from "@phosphor-icons/react/dist/csr/Van"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"

import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal"
import { PRODUCT_ROUTES, VEHICLE_TYPES } from "@/lib/constants"
import { getMinPricePerDay } from "@/lib/pricing"
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

  const priceLine = (slug: VehicleSlug) =>
    t.rich("priceFrom", {
      price: currency.format(getMinPricePerDay(slug)),
      strong: (chunks) => <strong className="text-lg font-extrabold whitespace-nowrap text-orange">{chunks}</strong>,
    })

  return (
    <section className="section-y bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <Reveal className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-0.5 w-8 rounded-full bg-orange sm:w-12" />
            <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{t("title")}</h2>
            <span aria-hidden className="h-0.5 w-8 rounded-full bg-orange sm:w-12" />
          </div>
          <p className="max-w-2xl text-balance text-muted-foreground">{t("description")}</p>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VEHICLE_TYPES.map((vehicle) => {
            const Icon = CARD_ICONS[vehicle.slug]
            const label = tVehicles(`${vehicle.slug}.label`)
            const description = tVehicles(`${vehicle.slug}.description`)

            if (vehicle.slug === FEATURED_SLUG) {
              return (
                <StaggerItem key={vehicle.slug} className="h-full sm:col-span-2 lg:col-span-2">
                  <Link
                    href={PRODUCT_ROUTES[vehicle.slug]}
                    className="group relative isolate flex h-full min-h-60 flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-[#0a2a63] to-[#0d3a86] p-6 text-white shadow-lg shadow-navy/20 transition duration-300 outline-none hover:-translate-y-1 hover:shadow-xl focus-visible:ring-3 focus-visible:ring-primary/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"
                  >
                    <Image
                      src={`/categories/${vehicle.slug}.webp`}
                      alt=""
                      width={900}
                      height={385}
                      sizes="(min-width: 1024px) 480px, 80vw"
                      className="pointer-events-none absolute -end-4 top-1/2 -z-10 w-[56%] max-w-none -translate-y-1/2 opacity-30 mix-blend-screen sm:w-[48%] sm:opacity-90"
                    />
                    <div className="flex items-start gap-4">
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <Icon aria-hidden weight="duotone" className="size-8" />
                      </span>
                      <div className="sm:max-w-[55%]">
                        <h3 className="text-2xl font-extrabold tracking-tight">{label}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/85">{description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="rounded-full bg-white px-5 py-2 text-sm text-navy first-letter:uppercase">
                        {priceLine(vehicle.slug)}
                      </p>
                      <span className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-orange/90">
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
            }

            return (
              <StaggerItem key={vehicle.slug} className="h-full">
                <Link
                  href={PRODUCT_ROUTES[vehicle.slug]}
                  className="group relative isolate flex h-full min-h-60 flex-col overflow-hidden rounded-3xl border border-border bg-white p-5 shadow-sm transition duration-300 outline-none hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-900/8 focus-visible:ring-3 focus-visible:ring-primary/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span
                    aria-hidden
                    className="absolute -end-10 -top-12 -z-10 h-52 w-[68%] rounded-full bg-gradient-to-b from-primary/20 to-primary/5"
                  />
                  <Image
                    src={`/categories/${vehicle.slug}.webp`}
                    alt=""
                    width={760}
                    height={570}
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 60vw"
                    className="pointer-events-none absolute end-2 top-4 -z-10 h-36 w-[54%] object-contain object-right mix-blend-multiply transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none rtl:object-left"
                  />

                  <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon aria-hidden weight="duotone" className="size-7" />
                  </span>
                  <h3 className="mt-3 max-w-[60%] text-xl leading-tight font-extrabold tracking-tight text-navy">{label}</h3>
                  <p className="mt-1.5 max-w-[46%] text-sm leading-snug text-muted-foreground">{description}</p>

                  <div className="mt-auto flex items-center justify-between gap-3 rounded-full bg-surface py-1.5 ps-4 pe-1.5">
                    <p className="text-sm text-foreground/80 first-letter:uppercase">{priceLine(vehicle.slug)}</p>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none rtl:group-hover:-translate-x-0.5">
                      <span className="sr-only">{t("cta")}</span>
                      <CaretRight aria-hidden weight="bold" className="size-4 rtl:rotate-180" />
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
