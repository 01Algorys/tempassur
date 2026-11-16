"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { useTranslations } from "next-intl"

import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface EuTimeInputProps {
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  className?: string
  id?: string
}

// Choix rapides toutes les 15 minutes ; toute autre heure reste saisissable au clavier.
const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(Math.floor(i / 4))}:${pad((i % 4) * 15)}`
})

function displayToValue(display: string): string {
  const match = display.match(/^(\d{2}):(\d{2})$/)
  if (!match) return ""
  return Number(match[1]) < 24 && Number(match[2]) < 60 ? display : ""
}

// Native <input type="time"> can follow the browser's 12-hour format and keeps an empty
// value until its AM/PM part is filled, so a time that looks entered is not submitted.
// This masked text input always uses 24-hour hh:mm, with a list of times to pick from.
export function EuTimeInput({ value, onChange, onBlur, className, id }: EuTimeInputProps) {
  const t = useTranslations("common")
  const [display, setDisplay] = useState(value ?? "")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (value) setDisplay(value)
  }, [value])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 4)
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits

    setDisplay(formatted)
    onChange(displayToValue(formatted))
  }

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="hh:mm"
        value={display}
        onChange={handleChange}
        onBlur={onBlur}
        className={cn("pe-11", className)}
        maxLength={5}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t("chooseTime")}
            className="absolute end-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <Clock className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 p-2"
          onOpenAutoFocus={(event) => {
            // Fait défiler la liste jusqu'à l'heure choisie (ou midi) à l'ouverture.
            event.preventDefault()
            const target = (event.currentTarget as HTMLElement).querySelector(
              `[data-time="${value || "12:00"}"]`
            ) as HTMLElement | null
            target?.scrollIntoView({ block: "center" })
          }}
        >
          <div className="grid max-h-64 grid-cols-4 gap-1 overflow-y-auto" role="listbox" aria-label={t("chooseTime")}>
            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                type="button"
                role="option"
                aria-selected={time === value}
                data-time={time}
                onClick={() => {
                  setDisplay(time)
                  onChange(time)
                  setOpen(false)
                  onBlur?.()
                }}
                className={cn(
                  "rounded-md px-1 py-1.5 text-sm tabular-nums transition-colors hover:bg-secondary",
                  time === value && "bg-primary text-white hover:bg-primary"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
