import type Stripe from "stripe"

import { getStripe } from "@/lib/stripe"

export interface PaymentsAnalytics {
  totalRevenue: number
  successRate: number
  totalCount: number
  succeededCount: number
  failedCount: number
  daily: number
  weekly: number
  monthly: number
  annual: number
  revenueByMonth: { month: string; revenue: number }[]
  revenueByProduct: { product: string; count: number; revenue: number }[]
}

// Pulls every PaymentIntent created since `since` (paginated, capped) and
// aggregates in-memory — Stripe has no built-in "revenue by day" report API
// for this account tier, so this is computed from real, individually fetched data.
async function fetchAllSince(stripe: Stripe, sinceUnix: number, cap = 1000): Promise<Stripe.PaymentIntent[]> {
  const all: Stripe.PaymentIntent[] = []
  let startingAfter: string | undefined
  while (all.length < cap) {
    const page = await stripe.paymentIntents.list({
      limit: 100,
      starting_after: startingAfter,
      created: { gte: sinceUnix },
    })
    all.push(...page.data)
    if (!page.has_more || page.data.length === 0) break
    startingAfter = page.data[page.data.length - 1].id
  }
  return all
}

export async function getPaymentsAnalytics(months = 12): Promise<PaymentsAnalytics> {
  const boundedMonths = Number.isFinite(months) && months > 0 ? Math.min(months, 24) : 12

  const since = new Date()
  since.setMonth(since.getMonth() - boundedMonths)
  since.setHours(0, 0, 0, 0)

  const stripe = getStripe()
  const payments = await fetchAllSince(stripe, Math.floor(since.getTime() / 1000))

  const succeeded = payments.filter((p) => p.status === "succeeded")
  const failed = payments.filter((p) => p.status === "requires_payment_method" || p.status === "canceled")

  const totalRevenue = succeeded.reduce((sum, p) => sum + p.amount, 0) / 100
  const successRate = payments.length ? Math.round((succeeded.length / payments.length) * 100) : 0

  const now = new Date()
  const dayMs = 86400000
  const daily = succeeded.filter((p) => now.getTime() - p.created * 1000 <= 7 * dayMs).reduce((sum, p) => sum + p.amount, 0) / 100
  const weekly = succeeded.filter((p) => now.getTime() - p.created * 1000 <= 30 * dayMs).reduce((sum, p) => sum + p.amount, 0) / 100
  const monthly =
    succeeded
      .filter((p) => {
        const d = new Date(p.created * 1000)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, p) => sum + p.amount, 0) / 100
  const annual = succeeded.filter((p) => new Date(p.created * 1000).getFullYear() === now.getFullYear()).reduce((sum, p) => sum + p.amount, 0) / 100

  const byMonth = new Map<string, number>()
  for (let i = boundedMonths - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    byMonth.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, 0)
  }
  for (const p of succeeded) {
    const d = new Date(p.created * 1000)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (byMonth.has(key)) byMonth.set(key, (byMonth.get(key) ?? 0) + p.amount / 100)
  }
  const revenueByMonth = Array.from(byMonth.entries()).map(([month, revenue]) => ({ month, revenue }))

  const byProduct = new Map<string, { count: number; revenue: number }>()
  for (const p of succeeded) {
    const key = p.metadata?.categorie || "Non spécifié"
    const entry = byProduct.get(key) ?? { count: 0, revenue: 0 }
    entry.count += 1
    entry.revenue += p.amount / 100
    byProduct.set(key, entry)
  }
  const revenueByProduct = Array.from(byProduct.entries())
    .map(([product, v]) => ({ product, ...v }))
    .sort((a, b) => b.revenue - a.revenue)

  return {
    totalRevenue,
    successRate,
    totalCount: payments.length,
    succeededCount: succeeded.length,
    failedCount: failed.length,
    daily,
    weekly,
    monthly,
    annual,
    revenueByMonth,
    revenueByProduct,
  }
}
