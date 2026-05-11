import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "@/components/analytics"
import "./globals.css"
import { Providers } from "./providers"
import { BASE_URL } from "@/lib/site"
import { PROFILE } from "@/lib/data/contact-copy"

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

const metaTitle = `${PROFILE.firstName} Developer Portfolio`
const metaDescription = `Personal portfolio of ${PROFILE.fullName} - Data Scientist, and ML Engineer.`

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),

    title: {
        default: metaTitle,
        template: `%s | ${PROFILE.fullName}`,
    },

    description: metaDescription,

    keywords: [
        PROFILE.fullName,
        "software engineer",
        "data scientist",
        "machine learning engineer",
        "AI engineer",
        PROFILE.institution,
        "ottawa",
        "portfolio",
        "Next.js",
        "React",
    ],

    authors: [{ name: PROFILE.fullName, url: BASE_URL }],
    creator: PROFILE.fullName,

    openGraph: {
        type: "website",
        url: BASE_URL,
        siteName: PROFILE.fullName,
        title: metaTitle,
        description: metaDescription,
        images: [
            {
                url: "/images/website_banner.png",
                width: 1200,
                height: 630,
                alt: `${PROFILE.fullName} — Portfolio`,
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: metaDescription,
        images: ["/images/website_banner.png"],
    },

    icons: {
        icon: "/favicon.ico",
        apple: "/favicon.ico",
        shortcut: "/favicon.ico",
    },

    manifest: "/manifest.json",

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    alternates: {
        canonical: BASE_URL,
    },
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f7f7fb" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0b11" },
    ],
    width: "device-width",
    initialScale: 1,
}

/**
 * Purpose:
 *   Root HTML shell. Installs font CSS variables, sets SEO metadata and PWA
 *   viewport, and wraps the tree in theme + accent providers.
 *   suppressHydrationWarning is required because next-themes applies the
 *   theme class on the client.
 *   data-scroll-behavior="smooth" satisfies Next.js App Router's requirement
 *   when scroll-behavior:smooth is set on <html>.
 *
 * Args:
 *   - children : the rendered route tree.
 *
 * Returns:
 *   The full <html> document.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
            className={`${sans.variable} ${mono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col overflow-x-hidden">
                <Providers>{children}</Providers>
                <Analytics />
                <SpeedInsights />
                <GoogleAnalytics />
            </body>
        </html>
    )
}
