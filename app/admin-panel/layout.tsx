import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"

import { AdminThemeProvider } from "@/components/admin/theme-provider"

import "../globals.css"

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Admin — TempAssur",
    template: "%s — Admin TempAssur",
  },
  robots: { index: false, follow: false },
}

export default function AdminPanelRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="h-full bg-background text-foreground">
        <AdminThemeProvider>{children}</AdminThemeProvider>
      </body>
    </html>
  )
}
