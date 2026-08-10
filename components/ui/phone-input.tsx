"use client"

import * as React from "react"
import PhoneInputPrimitive, { type Value } from "react-phone-number-input"
import "react-phone-number-input/style.css"

import { cn } from "@/lib/utils"

interface PhoneInputProps {
  value?: Value | string
  onChange: (value: Value | undefined) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
  disabled?: boolean
  id?: string
  "aria-invalid"?: boolean
}

function PhoneInput({ className, value, onChange, ...props }: PhoneInputProps) {
  return (
    <PhoneInputPrimitive
      data-slot="phone-input"
      international
      defaultCountry="FR"
      value={value as Value | undefined}
      onChange={onChange}
      className={cn(
        "phone-input flex h-8 w-full min-w-0 items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30",
        className
      )}
      numberInputProps={{
        className: "flex-1 min-w-0 bg-transparent outline-none placeholder:text-muted-foreground",
      }}
      {...props}
    />
  )
}

export { PhoneInput }
