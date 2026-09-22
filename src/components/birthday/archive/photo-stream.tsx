"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useTransform, type MotionValue } from "framer-motion"
import type { BirthdayMedia } from "@/lib/data/birthday/types"
import { seededRandom } from "@/lib/birthday/random"
import { PhotoCard, type CardOpening } from "./photo-card"

type PhotoStreamProps = {
    photos: BirthdayMedia[]
    flicker: MotionValue<number>
    speed: number // px per second, tablets and desktops
    speedMobile: number // px per second, phones
    reduceMotion: boolean
    label: string
    liftedIndex: number | null // card currently shown enlarged
    onOpen: ((opening: CardOpening) => void) | null
}

/** A loop needs enough cards to overflow even very wide screens. */
const MIN_CARDS_PER_LOOP = 16

/**
 * Purpose:
 *   The memory stream: one row of photographs and videos drifting right to
 *   left forever, like a logo marquee made of prints. The set is repeated
 *   so the -50% loop is seamless, and the speed is in px/s so it feels the
 *   same whatever the count. The bulb's light falls on the center of the
 *   row (a soft mask lets the edges fall into shadow; flickers dim the
 *   prints). Only videos on screen play. Hover, keyboard focus, a long
 *   press or an enlarged card pauses it. With reduced motion it becomes a
 *   still row she can swipe through.
 *
 * Args:
 *   - photos       : ordered photos and videos.
 *   - flicker      : shared light flicker motion value.
 *   - speed        : desktop speed.
 *   - speedMobile  : phone speed.
 *   - reduceMotion : render the still, scrollable version.
 *   - label        : accessible description of the row.
 *   - liftedIndex  : card to hide while its enlarged copy is shown.
 *   - onOpen       : a card was tapped (null while leaving).
 *
 * Returns:
 *   The stream, or nothing when there are no photos.
 */
export function PhotoStream({
    photos,
    flicker,
    speed,
    speedMobile,
    reduceMotion,
    label,
    liftedIndex,
    onOpen,
}: PhotoStreamProps) {
    const trackRef = useRef<HTMLDivElement>(null)
    const [held, setHeld] = useState(false)
    // Photos sink into the dark when the bulb dips.
    const lit = useTransform(flicker, [0.35, 1], [0.4, 1])
    const loop = !reduceMotion

    const layout = useMemo(() => {
        const rand = seededRandom("memory-stream")
        return photos.map(() => ({
            tilt: Math.round((rand() * 2 - 1) * 22) / 10,
            lift: (rand() * 2 - 1) * 0.045,
        }))
    }, [photos])

    const baseSet = useMemo(() => {
        if (!loop || photos.length === 0) return photos
        const reps = Math.max(1, Math.ceil(MIN_CARDS_PER_LOOP / photos.length))
        return Array.from({ length: reps }, () => photos).flat()
    }, [photos, loop])

    const items = loop ? [...baseSet, ...baseSet] : baseSet

    // Duration = distance / speed, so the drift feels the same with 20 or 80 items.
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

    // Play only the videos that are on screen, so a phone never decodes more
    // than a couple at once.
    useEffect(() => {
        const track = trackRef.current
        if (!track) return
        const videos = Array.from(track.querySelectorAll("video"))
        if (videos.length === 0) return
        const check = () => {
            const width = window.innerWidth
            for (const video of videos) {
                const r = video.getBoundingClientRect()
                const onScreen = r.width > 0 && r.right > -width * 0.1 && r.left < width * 1.1
                if (onScreen && video.paused) {
                    video.muted = true
                    video.play().catch(() => undefined)
                } else if (!onScreen && !video.paused) {
                    video.pause()
                }
            }
        }
        check()
        const timer = window.setInterval(check, 700)
        return () => {
            window.clearInterval(timer)
            videos.forEach((v) => v.pause())
        }
    }, [items.length])

    if (photos.length === 0) return null

    const release = () => setHeld(false)

    return (
        <div
            role="region"
            aria-label={label}
            tabIndex={0}
            className="bd-stream relative w-full"
            data-held={held || liftedIndex !== null}
            onPointerDown={(e) => {
                if (e.pointerType !== "mouse") setHeld(true)
            }}
            onPointerUp={release}
            onPointerCancel={release}
            onPointerLeave={release}
        >
            <motion.div
                className={`bd-stream-mask ${loop ? "overflow-hidden" : "bd-stream-static"}`}
                style={{ paddingBlock: "calc(var(--bd-card-h) * 0.09)", opacity: lit }}
            >
                <div
                    ref={trackRef}
                    className={loop ? "bd-track" : "flex w-max"}
                    style={
                        loop ? undefined : { paddingInline: "calc(50vw - var(--bd-card-w) / 2)" }
                    }
                >
                    {items.map((media, i) => {
                        const k = i % photos.length
                        return (
                            <PhotoCard
                                key={i}
                                media={media}
                                index={i}
                                tilt={layout[k].tilt}
                                lift={layout[k].lift}
                                eager={i < 8}
                                duplicate={loop ? i >= baseSet.length : false}
                                hidden={i === liftedIndex}
                                onOpen={onOpen}
                            />
                        )
                    })}
                </div>
            </motion.div>
        </div>
    )
}
