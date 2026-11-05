import type { Metadata } from "next"

import { UseCasePageTemplate, getUseCaseMetadata } from "@/components/use-case/use-case-page-template"

const SLUG = "plaque-ww"

export function generateMetadata(): Promise<Metadata> {
  return getUseCaseMetadata(SLUG)
}

export default function Page() {
  return <UseCasePageTemplate slug={SLUG} />
}
