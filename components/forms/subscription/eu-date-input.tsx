"use client"

import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"

interface EuDateInputProps {
  value?: string
  onChange: (isoValue: string) => void
  onBlur?: () => void
  className?: string
  id?: string
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

// Native <input type="date"> renders in whatever format the browser/OS locale
// dictates (often mm/dd/yyyy even on a French page) — this masked text input
// guarantees a jj/mm/aaaa display while still storing an ISO yyyy-mm-dd value
// in the form, so existing validation logic (new Date(...)) keeps working.
export function EuDateInput({ value, onChange, onBlur, className, id }: EuDateInputProps) {
  const [display, setDisplay] = useState(() => isoToDisplay(value))

  useEffect(() => {
    setDisplay(isoToDisplay(value))
  }, [value])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 8)
    let formatted = digits
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`

    setDisplay(formatted)
    onChange(displayToIso(formatted))
  }

  return (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="bday"
      placeholder="jj/mm/aaaa"
      value={display}
      onChange={handleChange}
      onBlur={onBlur}
      className={className}
      maxLength={10}
    />
  )
}
