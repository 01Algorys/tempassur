import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  className?: string
  size?: number
}

export function StarRating({ rating, className, size = 16 }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          width={size}
          height={size}
          className={cn(
            index < rating ? "fill-orange text-orange" : "fill-muted text-muted-foreground/40"
          )}
        />
      ))}
    </div>
  )
}
