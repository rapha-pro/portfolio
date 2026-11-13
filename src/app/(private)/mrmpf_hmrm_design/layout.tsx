import type { Metadata, Viewport } from "next"
import type { CSSProperties, ReactNode } from "react"
import { HMRM_DESIGN } from "@/lib/data/hmrm"
import type { HqTheme } from "@/lib/data/hmrm/types"
import { hqSerif } from "@/components/hmrm/shared/fonts"
import "@/components/hmrm/hmrm.css"

const { pageTitle, pageDescription } = HMRM_DESIGN.profile

// Private page: its own title and link preview instead of the portfolio's,
// and no search engine indexing. Room pages inherit this.
export const metadata: Metadata = {
    title: { absolute: pageTitle },
    description: pageDescription,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: { canonical: null },
    openGraph: { title: pageTitle, description: pageDescription, type: "website" },
    twitter: { card: "summary", title: pageTitle, description: pageDescription },
}

// Colors the mobile browser chrome with the page background.
export const viewport: Viewport = {
    themeColor: HMRM_DESIGN.theme.background,
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
}

/**
 * Purpose:
 *   Shell shared by the building and every room page: the serif font, the
 *   palette as --hq-* variables, and the French language tag.
 *
 * Args:
 *   - children : the building or a room page.
 *
 * Returns:
 *   The themed wrapper.
 */
export default function HmrmLayout({ children }: { children: ReactNode }) {
    return (
        <div
            lang="fr"
            className={`hq-root ${hqSerif.variable}`}
            style={themeVariables(HMRM_DESIGN.theme)}
        >
            <div className="hq-backdrop" aria-hidden />
            {children}
        </div>
    )
}

/** Maps the palette onto the --hq-* variables used by hmrm.css. */
function themeVariables(theme: HqTheme): CSSProperties {
    return {
        "--hq-bg": theme.background,
        "--hq-surface": theme.surface,
        "--hq-ink": theme.ink,
        "--hq-ink-muted": theme.inkMuted,
        "--hq-ink-subtle": theme.inkSubtle,
        "--hq-light": theme.light,
    } as CSSProperties
}
