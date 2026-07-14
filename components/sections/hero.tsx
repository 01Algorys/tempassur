"use client"

import { motion } from "framer-motion"

import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import { fadeUp, staggerContainer } from "@/lib/motion"

import { Tarificateur } from "./tarificateur"

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
          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl leading-[1.1] font-extrabold tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]"
          >
            Assurance temporaire de 1 à 90 jours — attestation immédiate par e-mail ou WhatsApp
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
            Auto, poids lourd, camping-car, quad, bus, tracteur, remorque et assurance frontière.
            Souscription 100&nbsp;% en ligne, 7j/7. Assureurs agréés : vos contrats sont portés par
            des entreprises d&apos;assurance régies par le Code des assurances.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <Button asChild size="xl" variant="cta" className="rounded-full">
              <a href="#tarificateur">Estimer votre assurance en 30 secondes</a>
            </Button>
            <WhatsappButton className="h-13 rounded-full px-8 text-base" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Tarificateur />
        </motion.div>
      </div>
    </section>
  )
}
