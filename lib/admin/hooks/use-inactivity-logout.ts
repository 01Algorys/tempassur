"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { ADMIN_IDLE_TIMEOUT_MS } from "@/lib/admin/session-cookie"

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const

export function useInactivityLogout(timeoutMs: number = ADMIN_IDLE_TIMEOUT_MS) {
  const router = useRouter()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const logout = async () => {
      await fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {})
      router.replace("/admin-panel/login")
    }

    const reset = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(logout, timeoutMs)
    }

    reset()
    for (const event of ACTIVITY_EVENTS) window.addEventListener(event, reset, { passive: true })

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      for (const event of ACTIVITY_EVENTS) window.removeEventListener(event, reset)
    }
  }, [router, timeoutMs])
}
