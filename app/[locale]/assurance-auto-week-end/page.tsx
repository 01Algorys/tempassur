import type { Metadata } from "next"

import { LandingPageTemplate, getLandingMetadata } from "@/components/landing/landing-page-template"

const SLUG = "auto-week-end"

export function generateMetadata(): Promise<Metadata> {
  return getLandingMetadata(SLUG)
}

export default function Page() {
  return <LandingPageTemplate slug={SLUG} />
}
