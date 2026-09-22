import { getImageProps } from "next/image"
import type { BirthdayMedia } from "@/lib/data/birthday/types"

/** Responsive sizes of a photo card; must match --bd-card-w in birthday.css. */
export const CARD_SIZES = "(max-width: 640px) 48vw, 300px"

/** Responsive sizes of an enlarged photo. */
export const FOCUS_SIZES = "(max-width: 640px) 92vw, 620px"

const thumbCache = new Map<string, HTMLImageElement>()

/** The still image that represents a media item (a video's poster). */
function stillOf(item: BirthdayMedia): string | undefined {
    return item.kind === "video" ? item.poster : item.src
}

/**
 * Purpose:
 *   Warms the browser cache with the first cards while she is still on the
 *   entrance screen, using the exact srcset the cards will request (the
 *   poster for videos).
 *
 * Args:
 *   - media : ordered photos and videos.
 *   - count : how many of the first items to fetch.
 *
 * Returns:
 *   Nothing.
 */
export function preloadCardImages(media: BirthdayMedia[], count: number): void {
    for (const item of media.slice(0, count)) {
        if (item.kind === "video") {
            if (item.poster) new Image().src = item.poster
            continue
        }
        const { props } = getImageProps({ src: item.src, alt: "", fill: true, sizes: CARD_SIZES })
        const img = new Image()
        img.decoding = "async"
        img.sizes = CARD_SIZES
        if (props.srcSet) img.srcset = props.srcSet
        img.src = props.src
    }
}

/**
 * Purpose:
 *   Loads small optimized thumbnails used as ghostly photographs inside the
 *   tunnel (video posters included). Cached per source, so calling it early
 *   (to preload) and again in the tunnel returns the same image elements.
 *
 * Args:
 *   - media : ordered photos and videos.
 *   - count : how many thumbnails, picked evenly across the list.
 *
 * Returns:
 *   Image elements, possibly still loading.
 */
export function loadGhostImages(media: BirthdayMedia[], count: number): HTMLImageElement[] {
    const stills = media.map(stillOf).filter((s): s is string => Boolean(s))
    if (stills.length === 0) return []
    const step = Math.max(1, stills.length / count)
    const picks: string[] = []
    for (let i = 0; i < Math.min(count, stills.length); i++) {
        picks.push(stills[Math.floor(i * step)])
    }

    return picks.map((src) => {
        const cached = thumbCache.get(src)
        if (cached) return cached
        // width 128 at 2x density resolves to a 256px wide optimized file.
        const { props } = getImageProps({ src, alt: "", width: 128, height: 160 })
        const img = new Image()
        img.decoding = "async"
        img.src = props.src
        thumbCache.set(src, img)
        return img
    })
}
