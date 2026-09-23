import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { BIRTHDAYS, getBirthday } from "@/lib/data/birthday"
import { resolveMedia } from "@/lib/birthday/resolveMedia"
import { BirthdayExperience, type BirthdayChapter } from "@/components/birthday/birthday-experience"
import { birthdaySerif, birthdayScript } from "@/components/birthday/shared/fonts"

type BirthdayPageProps = {
    params: Promise<{ slug: string }>
}

type BirthdayPageRouteProps = BirthdayPageProps & {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

const PREVIEW_CHAPTERS: Record<string, BirthdayChapter> = {
    room: "archive",
    verse: "verse",
    siblings: "siblings",
    wishes: "wishes",
    finale: "finale",
}

// Only the slugs registered in src/lib/data/birthday/index.ts exist; every
// other single segment URL stays a 404.
export const dynamicParams = false

/**
 * Purpose:
 *   Prerenders one page per registered birthday at build time.
 *
 * Returns:
 *   The list of { slug } params.
 */
export function generateStaticParams(): { slug: string }[] {
    return BIRTHDAYS.map((b) => ({ slug: b.profile.slug }))
}

/**
 * Purpose:
 *   Private, personal metadata: her own title and description for the link
 *   preview (instead of the portfolio's), and no search engine indexing.
 *
 * Args:
 *   - params : route params (a promise in Next.js 16).
 *
 * Returns:
 *   Page metadata.
 */
export async function generateMetadata({ params }: BirthdayPageProps): Promise<Metadata> {
    const { slug } = await params
    const config = getBirthday(slug)
    if (!config) return {}
    const { pageTitle, pageDescription } = config.profile

    return {
        title: { absolute: pageTitle },
        description: pageDescription,
        robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
        alternates: { canonical: null },
        openGraph: { title: pageTitle, description: pageDescription, type: "website" },
        twitter: { card: "summary", title: pageTitle, description: pageDescription },
    }
}

/**
 * Purpose:
 *   Colors the mobile browser chrome with the experience's background.
 *
 * Args:
 *   - params : route params.
 *
 * Returns:
 *   Viewport settings.
 */
export async function generateViewport({ params }: BirthdayPageProps): Promise<Viewport> {
    const { slug } = await params
    const config = getBirthday(slug)
    return {
        themeColor: config?.theme.background ?? "#080706",
        colorScheme: "dark",
        width: "device-width",
        initialScale: 1,
        viewportFit: "cover",
    }
}

/**
 * Purpose:
 *   A personal birthday experience, e.g. raphaelonana.dev/mystery.
 *   Resolves the photo and video folder on the server and hands everything to the
 *   client experience.
 *
 *   In development only, ?chapter=room|verse|siblings|wishes|finale opens
 *   on that chapter so copy edits can be previewed without replaying the
 *   whole story. Production ignores it (and stays statically rendered).
 *
 * Args:
 *   - params       : route params.
 *   - searchParams : query string (read in development only).
 *
 * Returns:
 *   The full-screen experience.
 */
export default async function BirthdayPage({ params, searchParams }: BirthdayPageRouteProps) {
    const { slug } = await params
    const config = getBirthday(slug)
    if (!config) notFound()

    const photos = resolveMedia(config.photos, config.profile.slug)

    let startAt: BirthdayChapter | undefined
    if (process.env.NODE_ENV === "development") {
        const chapter = (await searchParams).chapter
        startAt = typeof chapter === "string" ? PREVIEW_CHAPTERS[chapter] : undefined
    }

    return (
        <div className={`${birthdaySerif.variable} ${birthdayScript.variable}`}>
            <BirthdayExperience config={config} photos={photos} startAt={startAt} />
        </div>
    )
}
