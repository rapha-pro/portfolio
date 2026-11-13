"use client"

import { useCallback, useEffect, useRef, useState, type UIEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import type { HqCopy, HqPhoto } from "@/lib/data/hmrm/types"
import { useMediaQuery } from "./shared/useMediaQuery"

type RoomGalleryProps = {
    photos: HqPhoto[] // at least one
    label: string // accessible name of the gallery
    copy: HqCopy
    nextHref: string | null // next room of the tour, opened after the last photo; null loops
}

/** Time each photo stays on screen while the slideshow runs. */
const SLIDE_MS = 4000
/** After the visitor swipes or taps, the slideshow waits this long before going on. */
const RESUME_MS = 8000

/**
 * Purpose:
 *   The room's photos, full width. On arrival they scroll by themselves
 *   one after the other (a thin gold bar shows the time left); after the
 *   last one the tour moves on to the next room (the last room of the tour
 *   loops back to its first photo instead). Previous and next arrows,
 *   swiping and the thumbnails move by hand; doing so pauses the slideshow
 *   for a moment. A pause button stops it (and the tour) for good, and it
 *   never starts for visitors who ask for reduced motion.
 *
 * Args:
 *   - photos   : the room's photos.
 *   - label    : accessible name of the gallery.
 *   - copy     : page words (button labels).
 *   - nextHref : the next room of the tour, or null.
 *
 * Returns:
 *   The gallery.
 */
export function RoomGallery({ photos, label, copy, nextHref }: RoomGalleryProps) {
    const router = useRouter()
    const trackRef = useRef<HTMLDivElement>(null)
    const holdTimer = useRef<number | undefined>(undefined)
    const [index, setIndex] = useState(0)
    const [playing, setPlaying] = useState(true)
    const [held, setHeld] = useState(false)
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)")
    const count = photos.length
    const many = count > 1
    const timed = many || nextHref !== null
    const running = timed && playing && !held && !reduced

    const goTo = useCallback(
        (i: number) => {
            const track = trackRef.current
            if (!track) return
            const target = (i + count) % count
            setIndex(target)
            track.scrollTo({
                left: target * track.clientWidth,
                behavior: reduced ? "auto" : "smooth",
            })
        },
        [count, reduced]
    )

    // The visitor took over: wait a moment before the slideshow goes on.
    const hold = useCallback(() => {
        setHeld(true)
        window.clearTimeout(holdTimer.current)
        holdTimer.current = window.setTimeout(() => setHeld(false), RESUME_MS)
    }, [])

    useEffect(() => () => window.clearTimeout(holdTimer.current), [])

    useEffect(() => {
        if (!running) return
        const last = index >= count - 1
        const timer = window.setTimeout(() => {
            if (last && nextHref) router.push(nextHref)
            else goTo(index + 1)
        }, SLIDE_MS)
        return () => window.clearTimeout(timer)
    }, [running, index, count, nextHref, router, goTo])

    const onScroll = (event: UIEvent<HTMLDivElement>) => {
        const track = event.currentTarget
        const next = Math.round(track.scrollLeft / Math.max(1, track.clientWidth))
        if (next !== index) setIndex(next)
    }

    const step = (delta: number) => {
        hold()
        goTo(index + delta)
    }

    return (
        <div className="hq-gallery" role="group" aria-roledescription="carousel" aria-label={label}>
            <div className="hq-gallery-stage">
                <div
                    ref={trackRef}
                    className="hq-gallery-track"
                    onScroll={onScroll}
                    onPointerDown={many ? hold : undefined}
                    onWheel={many ? hold : undefined}
                >
                    {photos.map((photo, i) => (
                        <div
                            key={photo.src}
                            className="hq-gallery-slide"
                            aria-hidden={i !== index || undefined}
                        >
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                sizes="(min-width: 900px) 900px, 100vw"
                                priority={i === 0}
                                className="hq-gallery-image"
                            />
                        </div>
                    ))}
                </div>

                {many && (
                    <>
                        <button
                            type="button"
                            className="hq-arrow hq-arrow--prev"
                            onClick={() => step(-1)}
                            aria-label={copy.previousPhoto}
                        >
                            <ChevronLeft size={22} aria-hidden />
                        </button>
                        <button
                            type="button"
                            className="hq-arrow hq-arrow--next"
                            onClick={() => step(1)}
                            aria-label={copy.nextPhoto}
                        >
                            <ChevronRight size={22} aria-hidden />
                        </button>
                    </>
                )}

                {timed && (
                    <>
                        <div className="hq-gallery-bar">
                            <button
                                type="button"
                                className="hq-play"
                                onClick={() => setPlaying((p) => !p)}
                                aria-label={playing ? copy.pause : copy.play}
                                aria-pressed={!playing}
                            >
                                {playing && !reduced ? (
                                    <Pause size={13} aria-hidden />
                                ) : (
                                    <Play size={13} aria-hidden />
                                )}
                            </button>
                            <span className="hq-gallery-count" aria-live="polite">
                                {index + 1} / {count}
                            </span>
                        </div>

                        <span className="hq-progress" aria-hidden>
                            {running && (
                                <span
                                    key={index}
                                    className="hq-progress-fill"
                                    style={{ animationDuration: `${SLIDE_MS}ms` }}
                                />
                            )}
                        </span>
                    </>
                )}
            </div>

            {many && (
                <div className="hq-thumbs">
                    {photos.map((photo, i) => (
                        <button
                            key={photo.src}
                            type="button"
                            className="hq-thumb"
                            data-on={i === index || undefined}
                            aria-label={photo.alt}
                            aria-current={i === index || undefined}
                            onClick={() => {
                                hold()
                                goTo(i)
                            }}
                        >
                            <Image src={photo.src} alt="" fill sizes="72px" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
