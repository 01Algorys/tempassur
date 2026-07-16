import type { Metadata } from "next"
import { Link } from "@/i18n/navigation"
import { notFound } from "next/navigation"
import { getLocale, getTranslations } from "next-intl/server"

import { Container } from "@/components/shared/container"
import { WhatsappButton } from "@/components/shared/whatsapp-button"
import { Button } from "@/components/ui/button"
import { PRODUCT_ROUTES } from "@/lib/constants"
import { BLOG_ARTICLES, BLOG_ARTICLE_SLUGS, type BlogBlock } from "@/lib/blog-content"
import { siteConfig } from "@/lib/site"

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return BLOG_ARTICLE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  if (!article) return {}

  const t = await getTranslations("blog.articles")

  return {
    title: t(`${slug}.title`),
    description: t(`${slug}.metaDescription`),
    alternates: { canonical: `${siteConfig.url}/blog/${article.slug}` },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = BLOG_ARTICLES.find((a) => a.slug === slug)
  if (!article) notFound()

  const t = await getTranslations("blog.articles")
  const tUi = await getTranslations("blog.articleUi")
  const tVehicles = await getTranslations("vehicleTypes")
  const locale = await getLocale()

  const title = t(`${slug}.title`)
  const body = t.raw(`${slug}.body`) as BlogBlock[]

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: article.date,
    author: { "@type": "Organization", name: "TempAssur" },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <section className="section-y">
        <Container className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold text-muted-foreground">
            {new Date(article.date).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {title}
          </h1>

          <div className="mt-8 flex flex-col gap-4">
            {body.map((block, index) => {
              if (block.type === "h2") {
                return (
                  <h2 key={index} className="mt-4 text-xl font-bold text-navy">
                    {block.text}
                  </h2>
                )
              }
              if (block.type === "ul") {
                return (
                  <ul key={index} className="list-disc pl-5 text-sm leading-relaxed text-foreground/80">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={index} className="leading-relaxed text-foreground/80">
                  {block.text}
                </p>
              )
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-8">
            <Button asChild size="lg" variant="cta" className="rounded-full">
              <Link href="/#tarificateur">{tUi("ctaEstimate")}</Link>
            </Button>
            <WhatsappButton />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{tUi("seeAlso")}</p>
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {article.relatedProducts.map((relatedSlug) => (
                <li key={relatedSlug}>
                  <Link href={PRODUCT_ROUTES[relatedSlug]} className="text-sm font-semibold text-primary hover:underline">
                    {tVehicles(`${relatedSlug}.label`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
                  {tUi("allArticles")}
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </section>
    </>
  )
}
