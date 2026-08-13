"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface ComboboxProps {
  value: string
  onValueChange: (value: string) => void
  options: string[]
  placeholder?: string
  emptyText?: string
  className?: string
  id?: string
  /** Minimum characters typed before suggestions are shown (default 0 = always). */
  minChars?: number
}

// Free-text input with a filtered, Select-styled suggestion list — used where
// native <datalist> looks inconsistent with the rest of the design system but
// the field must stay free text (e.g. "marque", not limited to a fixed set).
export function Combobox({
  value,
  onValueChange,
  options,
  placeholder,
  emptyText,
  className,
  id,
  minChars = 0,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const query = value.trim().toLowerCase()
  const belowThreshold = query.length < minChars
  const filtered = query ? options.filter((o) => o.toLowerCase().includes(query)) : options
  const visible = belowThreshold ? [] : filtered.slice(0, 50)

  return (
    <PopoverPrimitive.Root open={open && !belowThreshold} onOpenChange={setOpen}>
      <PopoverPrimitive.Anchor asChild>
        <div className={cn("relative flex items-center", className)}>
          <input
            id={id}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              onValueChange(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            className="h-11 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            autoComplete="off"
          />
          <ChevronDownIcon className="pointer-events-none absolute right-2.5 size-4 text-muted-foreground" />
        </div>
      </PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="z-50 max-h-64 w-(--radix-popper-anchor-width) overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          {visible.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">{emptyText}</p>
          ) : (
            visible.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onValueChange(option)
                  setOpen(false)
                }}
                className="relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-left text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
              >
                {option}
                {option === value ? (
                  <CheckIcon className="pointer-events-none absolute right-2 size-4" />
                ) : null}
              </button>
            ))
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
