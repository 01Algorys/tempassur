"use client"

import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"

interface EuTimeInputProps {
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  className?: string
  id?: string
}

function displayToValue(display: string): string {
  const match = display.match(/^(\d{2}):(\d{2})$/)
  if (!match) return ""
  return Number(match[1]) < 24 && Number(match[2]) < 60 ? display : ""
}

// Native <input type="time"> can follow the browser's 12-hour format and keeps an empty
// value until its AM/PM part is filled, so a time that looks entered is not submitted.
// This masked text input always uses 24-hour hh:mm.
export function EuTimeInput({ value, onChange, onBlur, className, id }: EuTimeInputProps) {
  const [display, setDisplay] = useState(value ?? "")

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
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="hh:mm"
      value={display}
      onChange={handleChange}
      onBlur={onBlur}
      className={className}
      maxLength={5}
    />
  )
}
