import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  steps: { title: string }[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep

        return (
          <li key={step.title} className="flex flex-1 items-center gap-2 last:flex-none sm:gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  isCompleted && "bg-navy text-white",
                  isCurrent && "bg-orange text-white",
                  !isCompleted && !isCurrent && "bg-secondary text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-4" strokeWidth={3} /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-center text-[11px] font-semibold tracking-wide uppercase sm:block",
                  isCurrent ? "text-navy" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span className={cn("h-0.5 flex-1 rounded-full transition-colors", isCompleted ? "bg-navy" : "bg-border")} />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
