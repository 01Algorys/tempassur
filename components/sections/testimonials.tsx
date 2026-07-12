"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { SectionHeading } from "@/components/shared/section-heading"
import { StarRating } from "@/components/shared/star-rating"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Stagger, StaggerItem } from "@/components/shared/reveal"
import { TESTIMONIALS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const VISIBLE = 4

export function Testimonials() {
  const [start, setStart] = useState(0)
  const maxStart = Math.max(0, TESTIMONIALS.length - VISIBLE)

  const visible = TESTIMONIALS.slice(start, start + VISIBLE)

  return (
    <section className="section-y bg-white">
      <div className="mx-auto max-w-7xl container-px">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Client Reviews"
            title="Our Client Reviews"
            description="Discover why our clients love working with us and hear their honest feedback."
          />

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Previous reviews"
              disabled={start === 0}
              onClick={() => setStart((s) => Math.max(0, s - 1))}
              className="flex size-10 items-center justify-center rounded-full border border-border text-navy transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next reviews"
              disabled={start >= maxStart}
              onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
              className="flex size-10 items-center justify-center rounded-full bg-orange text-white transition-colors hover:bg-orange/90 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-navy">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <StarRating rating={testimonial.rating} size={14} />
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className={cn("mt-8 flex items-center justify-center gap-2", maxStart === 0 && "hidden")}>
          {Array.from({ length: maxStart + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to review set ${i + 1}`}
              onClick={() => setStart(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === start ? "w-6 bg-orange" : "w-2 bg-border hover:bg-primary/30"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
