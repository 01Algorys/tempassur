# TempAssur — Digital Insurance Platform

A production-ready, SEO-optimized marketing site for TempAssur (temporary & digital
insurance), built with Next.js 15 App Router, TypeScript, Tailwind CSS v4, shadcn/ui,
Framer Motion, React Hook Form and Zod.

## Tech Stack

- **Next.js 15** (App Router, React 19)
- **TypeScript** (strict mode)
- **Tailwind CSS v4** with a custom TempAssur design token system
- **shadcn/ui** (Radix primitives) for accessible, composable UI primitives
- **Framer Motion** for scroll reveals, staggered animations and floating elements
- **Lucide React** for icons
- **React Hook Form + Zod** for validated, accessible forms
- **next/og** for a dynamically generated Open Graph image

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Folder Structure

```
tempassur/
├── app/
│   ├── layout.tsx            # Root layout: fonts, metadata, JSON-LD, Header/Footer
│   ├── page.tsx               # Homepage — composes all marketing sections
│   ├── globals.css            # Tailwind v4 theme tokens (TempAssur brand palette)
│   ├── sitemap.ts             # Dynamic sitemap.xml
│   ├── robots.ts              # Dynamic robots.txt
│   ├── opengraph-image.tsx    # Dynamic OG image (next/og)
│   ├── login/page.tsx
│   └── register/page.tsx
├── components/
│   ├── layout/                # Header, Footer, AuthShell, LanguageSwitcher
│   ├── sections/               # Hero, InsuranceCategories, Packages, WhyChooseUs,
│   │                            # QuoteFormSection, Stats, Testimonials, AppShowcase,
│   │                            # Faq, CtaBanner
│   ├── forms/                  # QuoteRequestForm, LoginForm, RegisterForm, NewsletterForm
│   ├── shared/                 # Reveal/Stagger (Framer Motion), SectionHeading,
│   │                            # AnimatedCounter, StarRating, Logo, Container, social icons
│   └── ui/                     # shadcn/ui primitives (Button, Card, Input, Select, ...)
├── hooks/
│   ├── use-scrolled.ts         # Sticky header scroll state
│   └── use-count-up.ts         # In-view counter animation
├── lib/
│   ├── constants.ts             # Nav links, categories, packages, features, testimonials, FAQ
│   ├── site.ts                  # siteConfig (SEO metadata source of truth)
│   ├── motion.ts                # Shared Framer Motion variants
│   ├── quote.ts                  # Quote submission handler (swap in a real API call)
│   ├── utils.ts                  # cn() class merge helper
│   └── validations/              # Zod schemas (quote form, login, register)
├── types/
│   └── index.ts                 # Shared TypeScript types
└── public/                      # Static assets, favicon
```

## Design System

Brand colors are defined as CSS custom properties in `app/globals.css` and exposed as
Tailwind utilities (`bg-primary`, `bg-navy`, `text-orange`, `bg-orange-light`, `bg-surface`):

| Token           | Hex       | Usage                                   |
| --------------- | --------- | ---------------------------------------- |
| `primary`       | `#0A4D9E` | Primary blue — links, primary UI         |
| `navy`          | `#072F5F` | Dark navy — footer, dark sections        |
| `orange`        | `#FF7A00` | CTA buttons, highlights, active states   |
| `orange-light`  | `#FFA94D` | Accents, gradients                       |
| `surface`       | `#F5F7FA` | Light gray section backgrounds           |

The `cta` and `navy` Button variants (`components/ui/button.tsx`) implement the
orange-for-action / blue-for-structure rule requested in the brief (≈70% white,
20% blue, 10% orange).

## Notes for going to production

- Replace the placeholder `siteConfig.url`, phone, email and address in `lib/site.ts`
  with real values before deploying.
- `lib/quote.ts`, and the login/register forms, currently simulate network requests.
  Wire them up to your real API/CRM before launch.
- Social links in `lib/site.ts` and partner names in `lib/constants.ts`
  (`PARTNER_NAMES`) are placeholders — replace with real accounts/partners.
- Run `npx shadcn@latest add <component>` to pull in any additional shadcn/ui
  primitives as the product grows.



home page -> 1. categorie (type de vehicule) liste deroulante
            2. 