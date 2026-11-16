"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { DayPicker } from "react-day-picker"
import { ar, de, enGB, es, fr, it, ro } from "react-day-picker/locale"
import "react-day-picker/style.css"

import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const CALENDAR_LOCALES = { fr, en: enGB, ar, de, it, ro, es } as const

interface EuDateInputProps {
  value?: string
  onChange: (isoValue: string) => void
  onBlur?: () => void
  className?: string
  id?: string
  // Bornes du calendrier (dates locales). La validation du formulaire reste la référence.
  minDate?: Date
  maxDate?: Date
}

function isoToDisplay(iso?: string): string {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return ""
  const [, y, m, d] = match
  return `${d}/${m}/${y}`
}

function displayToIso(display: string): string {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return ""
  const [, d, m, y] = match
  return `${y}-${m}-${d}`
}

function isoToDate(iso?: string): Date | undefined {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return undefined
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? undefined : date
}

function dateToIso(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Native <input type="date"> renders in whatever format the browser/OS locale
// dictates (often mm/dd/yyyy even on a French page) — this masked text input
// guarantees a jj/mm/aaaa display while still storing an ISO yyyy-mm-dd value
// in the form. The calendar button offers the same value without typing.
export function EuDateInput({ value, onChange, onBlur, className, id, minDate, maxDate }: EuDateInputProps) {
  const t = useTranslations("common")
  const locale = useLocale() as keyof typeof CALENDAR_LOCALES
  const [display, setDisplay] = useState(() => isoToDisplay(value))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setDisplay(isoToDisplay(value))
  }, [value])

  const selected = isoToDate(value)
  const startMonth = minDate ?? new Date(1920, 0, 1)
  const endMonth = maxDate ?? new Date(new Date().getFullYear() + 2, 11, 31)
  const disabled = useMemo(
    () => [...(minDate ? [{ before: minDate }] : []), ...(maxDate ? [{ after: maxDate }] : [])],
    [minDate, maxDate]
  )

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 8)
    let formatted = digits
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`

    setDisplay(formatted)
    onChange(displayToIso(formatted))
  }

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="jj/mm/aaaa"
        value={display}
        onChange={handleChange}
        onBlur={onBlur}
        className={cn("pe-11", className)}
        maxLength={10}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t("openCalendar")}
            className="absolute end-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
          >
            <CalendarDays className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <DayPicker
            mode="single"
            locale={CALENDAR_LOCALES[locale] ?? fr}
            dir={locale === "ar" ? "rtl" : "ltr"}
            weekStartsOn={1}
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            defaultMonth={selected ?? maxDate ?? minDate ?? new Date()}
            selected={selected}
            disabled={disabled}
            onSelect={(date) => {
              if (!date) return
              onChange(dateToIso(date))
              setOpen(false)
              onBlur?.()
            }}
            style={
              {
                "--rdp-accent-color": "var(--primary)",
                "--rdp-accent-background-color": "color-mix(in oklab, var(--primary) 12%, transparent)",
                "--rdp-day-height": "2.25rem",
                "--rdp-day-width": "2.25rem",
                "--rdp-day_button-height": "2.1rem",
                "--rdp-day_button-width": "2.1rem",
                fontSize: "0.875rem",
              } as React.CSSProperties
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
