"use client"

import { useState } from "react"

import { Reveal } from "@/components/shared/reveal"
import { INSURANCE_CATEGORIES } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function InsuranceCategories() {
  const [active, setActive] = useState(INSURANCE_CATEGORIES[0].id)

  return (
    <section id="insurance" className="relative z-10 -mt-8 bg-white pb-4">
      <div className="mx-auto max-w-7xl container-px">
        <Reveal delay={0.1}>
          <div className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-white p-1.5 shadow-lg shadow-slate-900/5">
            {INSURANCE_CATEGORIES.map((category) => {
              const Icon = category.icon
              const isActive = active === category.id

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActive(category.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5",
                    isActive
                      ? "bg-orange text-white shadow-[0_8px_20px_-8px_rgba(255,122,26,0.7)]"
                      : "text-foreground/70 hover:bg-secondary hover:text-navy"
                  )}
                >
                  <Icon className="size-4" strokeWidth={2} />
                  {category.title}
                </button>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
