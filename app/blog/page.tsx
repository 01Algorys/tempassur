import type { Metadata } from "next"
import Link from "next/link"

import { Container } from "@/components/shared/container"
import { PageHero } from "@/components/layout/page-hero"
import { BLOG_ARTICLES } from "@/lib/blog-content"
import { siteConfig } from "@/lib/site"

export const metadata: Metadata = {
  title: "Blog",
  description: "Actualités et conseils sur l'assurance temporaire : véhicules, pays couverts, éligibilité et démarches.",
  alternates: { canonical: `${siteConfig.url}/blog` },
}

const sortedArticles = [...BLOG_ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1))

export default function BlogPage() {
  return (
    <>
      <PageHero title="Blog" description="Nos conseils et actualités sur l'assurance temporaire." />
      <section className="section-y">
        <Container className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {sortedArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
            >
              <p className="text-xs font-semibold text-muted-foreground">
                {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h2 className="text-base font-bold text-navy">{article.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{article.metaDescription}</p>
            </Link>
          ))}
        </Container>
      </section>
    </>
  )
}
