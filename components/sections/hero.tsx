"use client"

import { motion } from "framer-motion"
import { Car, Check, FileCheck2, Laptop, ShieldCheck } from "lucide-react"

import { fadeUp, staggerContainer } from "@/lib/motion"

import { HeroQuoteForm } from "./hero-quote-form"

const CHECKLIST = ["Souscription en 3 min", "Assureurs agréés ACPR", "Sans frais cachés"]

const TRUST_ITEMS = [
  {
    icon: FileCheck2,
    title: "Attestation immédiate",
    description: "Par email en 5 minutes",
  },
  {
    icon: Laptop,
    title: "100 % en ligne",
    description: "Aucun document papier",
  },
  {
    icon: ShieldCheck,
    title: "Assureurs agréés",
    description: "Partenaires certifiés ACPR",
  },
  {
    icon: Car,
    title: "Tous véhicules",
    description: "Auto, poids lourd, camping-car, remorque",
  },
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-[#fdf3ea] via-white to-white pt-32 pb-16 sm:pt-40">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 container-px lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12, 0.1)}
          className="flex flex-col items-start gap-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm"
          >
            <span className="flex size-2 rounded-full bg-emerald-500" />
            Attestation envoyée en 5 minutes
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl leading-[1.1] font-extrabold tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]"
          >
            Assurez votre véhicule de{" "}
            <span className="text-primary">1 à 90 jours</span>.
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
            L&apos;assurance auto temporaire 100&nbsp;% en ligne. Sans engagement, sans frais de
            dossier — votre carte verte par email, immédiatement.
          </motion.p>

          <motion.ul variants={fadeUp} className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <Check className="size-4 shrink-0 text-primary" strokeWidth={3} />
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-primary" strokeWidth={1.8} />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-navy">Courtier d&apos;assurance</span> régulé
              ORIAS n°24004933, sous le contrôle de l&apos;ACPR
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroQuoteForm />
        </motion.div>
      </div>

      <div className="relative mx-auto mt-14 max-w-7xl border-t border-border pt-10 container-px sm:mt-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-navy">
                <item.icon className="size-4.5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-sm font-bold text-navy">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
