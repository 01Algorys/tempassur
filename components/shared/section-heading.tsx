import { cn } from "@/lib/utils"
import { Reveal } from "@/components/shared/reveal"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
  titleClassName?: string
  light?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleClassName,
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <Reveal>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide uppercase",
              light
                ? "border-white/20 bg-white/10 text-orange-light"
                : "border-orange/20 bg-orange/10 text-orange"
            )}
          >
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]",
            light ? "text-white" : "text-foreground",
            titleClassName
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "max-w-2xl text-balance text-base leading-relaxed sm:text-lg",
              light ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}
