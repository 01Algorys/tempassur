"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5)

export function useCountUp(target: number, durationMs = 2000) {
  const ref = useRef<HTMLElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let frame: number
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      setValue(Math.round(target * easeOutQuint(progress)))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isInView, target, durationMs])

  return { ref, value }
}
