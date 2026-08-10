"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import { fadeUp, staggerContainer } from "@/lib/motion"

import { CategoryDialog } from "./category-dialog"
import { Tarificateur } from "./tarificateur"

export function Hero() {
  const t = useTranslations("home.hero")
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-[#fdf3ea] via-white to-white pt-25 pb-8 sm:pt-24 lg:pt-32">
      <div className="relative mx-auto grid max-w-[145rem] grid-cols-1 items-center gap-6 container-px sm:gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12, 0.1)}
          className="order-1 flex flex-col items-start gap-14"
        >
          <motion.h1
            variants={fadeUp}
            className="text-balance text-3xl leading-[1.1] font-bold tracking-tight text-navy sm:text-5xl lg:text-[2.8rem]"
          >
            {t("title")}
          </motion.h1>

          <motion.p variants={fadeUp} className="w[100%] text-balance text-lg leading-relaxed text-muted-foreground">
            {t("description")}
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="xl"
              variant="cta"
              className="rounded-full"
              onClick={() => setCategoryDialogOpen(true)}
            >
              {t("ctaEstimate")}
            </Button>
            <WhatsappButton className="h-13 rounded-full px-8 text-base" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="order-2"
        >
          <Tarificateur />
        </motion.div>
      </div>

      <CategoryDialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen} />
    </section>
  )
}
