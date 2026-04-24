import type { Metadata } from "next"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

/**
 * Typography.
 *
 * Plus Jakarta Sans: warm, geometric, premium — UI + body.
 * JetBrains Mono:    for code, numerals, and tech-flavored accents.
 */
const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Raphaël Onana — Portfolio",
  description:
    "Portfolio of Raphaël Onana — building immersive web experiences with Next.js, animation, and 3D.",
}

/**
 * Purpose:
 *   Root HTML shell. Installs font CSS variables and wraps the tree in
 *   theme + accent providers. `suppressHydrationWarning` is required
 *   because `next-themes` applies the theme class on the client.
 *
 * Args:
 *   children — the rendered route tree.
 *
 * Returns:
 *   The full <html> document.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
