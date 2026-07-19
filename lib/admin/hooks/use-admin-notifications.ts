"use client"

import { useEffect, useRef, useState } from "react"

export interface AdminNotification {
  id: string
  type: string
  title: string
  message: string
  createdAt: string
  read?: boolean
}

const MAX_NOTIFICATIONS = 50

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [connected, setConnected] = useState(false)
  const seenIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    const source = new EventSource("/api/admin/events")

    source.addEventListener("connected", () => setConnected(true))

    source.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse((event as MessageEvent).data) as AdminNotification
        if (seenIds.current.has(data.id)) return
        seenIds.current.add(data.id)
        setNotifications((prev) => [{ ...data, read: false }, ...prev].slice(0, MAX_NOTIFICATIONS))
      } catch {
        // ignore malformed event
      }
    })

    source.onerror = () => setConnected(false)

    return () => source.close()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return { notifications, unreadCount, connected, markAllRead }
}
