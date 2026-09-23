"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import type { BirthdayMedia } from "@/lib/data/birthday/types"
import { seededRandom } from "@/lib/birthday/random"
import { CARD_SIZES } from "../shared/preload"

type PhotoBandProps = {
    photos: BirthdayMedia[] // photographs only; videos are left to the archive
    reverse: boolean // drift left to right instead of right to left
    speed: number // px per second, tablets and desktops
    speedMobile: number // px per second, phones
    reduceMotion: boolean
    seed: string // keeps each row's tilts its own
}

/** A loop needs enough prints to overflow even very wide screens. */
const MIN_CARDS_PER_LOOP = 18

/**
 * Purpose:
 *   A slim band of photographs drifting past, above and below the notebook
 *   at the very end: the memory stream come back, quieter and smaller, with
 *   nothing to tap. Two of them run in opposite directions, so the room
 *   feels like it is still turning around her while she reads the last
 *   words. With reduced motion the band simply stands still.
 *
 * Args:
 *   - photos       : the photographs, in the order this row shows them.
 *   - reverse      : drift towards the right.
 *   - speed        : desktop speed.
 *   - speedMobile   : phone speed.
 *   - reduceMotion : render the still version.
 *   - seed         : per row seed for the hand laid tilts.
 *
 * Returns:
 *   The band, or nothing when there are no photographs.
 */
export function PhotoBand({
    photos,
    reverse,
    speed,
    speedMobile,
    reduceMotion,
    seed,
}: PhotoBandProps) {
    const trackRef = useRef<HTMLDivElement>(null)
    const loop = !reduceMotion

    const layout = useMemo(() => {
        const rand = seededRandom(seed)
        return photos.map(() => ({
            tilt: Math.round((rand() * 2 - 1) * 16) / 10,
            lift: (rand() * 2 - 1) * 0.05,
        }))
    }, [photos, seed])

    const baseSet = useMemo(() => {
        if (!loop || photos.length === 0) return photos
        const reps = Math.max(1, Math.ceil(MIN_CARDS_PER_LOOP / photos.length))
        return Array.from({ length: reps }, () => photos).flat()
    }, [photos, loop])

    const items = loop ? [...baseSet, ...baseSet] : baseSet

    // Duration = distance / speed, so both rows drift at the same pace.
    useEffect(() => {
        const track = trackRef.current
        if (!track || !loop) return
        const measure = () => {
            const setWidth = track.scrollWidth / 2
            const pxPerSecond = window.innerWidth < 640 ? speedMobile : speed
            const seconds = Math.max(20, setWidth / Math.max(1, pxPerSecond))
            track.style.setProperty("--bd-marquee-duration", `${seconds}s`)
        }
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [loop, speed, speedMobile, baseSet.length])

    if (photos.length === 0) return null

    return (
        <div aria-hidden className="bd-band">
            <div className="bd-band-mask overflow-hidden">
                <div
                    ref={trackRef}
                    className={
                        loop ? `bd-track ${reverse ? "bd-track-reverse" : ""}` : "flex w-max"
                    }
                >
                    {items.map((media, i) => (
                        <BandCard key={i} media={media} {...layout[i % photos.length]} />
                    ))}
                </div>
            </div>
        </div>
    )
}

/** One print in the band: the archive card, without the tilt or the tap. */
function BandCard({ media, tilt, lift }: { media: BirthdayMedia; tilt: number; lift: number }) {
    const [loaded, setLoaded] = useState(false)

    return (
        <div
            className="bd-card-slot"
            style={
                {
                    "--tilt": `${tilt}deg`,
                    "--lift": `calc(var(--bd-card-h) * ${lift})`,
                } as CSSProperties
            }
        >
            <div className="bd-card" data-loaded={loaded} data-kind="image">
                <Image
                    src={media.src}
                    alt=""
                    fill
                    sizes={CARD_SIZES}
                    loading="lazy"
                    draggable={false}
                    onLoad={() => setLoaded(true)}
                    className="bd-card-img"
                    style={media.position ? { objectPosition: media.position } : undefined}
                />
                <span aria-hidden className="bd-card-sheen" />
            </div>
        </div>
    )
}
