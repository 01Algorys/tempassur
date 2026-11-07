interface MostChosenBadgeProps {
  label: string
}

export function MostChosenBadge({ label }: MostChosenBadgeProps) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
      {label}
    </span>
  )
}
