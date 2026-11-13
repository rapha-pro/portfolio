"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Pause, Play } from "lucide-react"
import type { HqCopy } from "@/lib/data/hmrm/types"
import { useMediaQuery } from "./shared/useMediaQuery"

type TourAutoAdvanceProps = {
    href: string // next room of the tour
    copy: HqCopy
}

/** Reading time on a room that has no photos, before the tour moves on. */
const READ_MS = 8000

/**
 * Purpose:
 *   Keeps the guided tour going on a room without photos: a gold bar at the
 *   top of the screen fills for READ_MS, then the next room opens. The
 *   pause button stops it; it never runs for visitors who ask for reduced
 *   motion.
 *
 * Args:
 *   - href : the next room.
 *   - copy : page words (button labels).
 *
 * Returns:
 *   The timer controls.
 */
export function TourAutoAdvance({ href, copy }: TourAutoAdvanceProps) {
    const router = useRouter()
    const reduced = useMediaQuery("(prefers-reduced-motion: reduce)")
    const [playing, setPlaying] = useState(true)
    const running = playing && !reduced

    useEffect(() => {
        if (!running) return
        const timer = window.setTimeout(() => router.push(href), READ_MS)
        return () => window.clearTimeout(timer)
    }, [running, href, router])

    return (
        <>
            <div className="hq-gallery-bar hq-gallery-bar--fixed">
                <button
                    type="button"
                    className="hq-play"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? copy.pause : copy.play}
                    aria-pressed={!playing}
                >
                    {running ? <Pause size={13} aria-hidden /> : <Play size={13} aria-hidden />}
                </button>
            </div>
            <span className="hq-progress hq-progress--page" aria-hidden>
                {running && (
                    <span
                        className="hq-progress-fill"
                        style={{ animationDuration: `${READ_MS}ms` }}
                    />
                )}
            </span>
        </>
    )
}
