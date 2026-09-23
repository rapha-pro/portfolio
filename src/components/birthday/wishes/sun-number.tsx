"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { seededRandom } from "@/lib/birthday/random"
import { EASE_OUT } from "../shared/motion"

type SunNumberProps = {
    value: string // e.g. "20"
    rays: number // lines around it
    delay: number // seconds before it appears
}

/** One full emission, from the first ray leaving to the last one fading. */
const BURST_SECONDS = 3.2

/**
 * Purpose:
 *   Digits do not sit in the middle of their line box: a font leaves more
 *   room above them than below, so a centered number looks low. This
 *   measures the real ink of the glyphs and returns how far to lift them,
 *   which keeps the number centered whatever font or value is used.
 *
 * Args:
 *   - element : the rendered number.
 *   - value   : the text it contains.
 *
 * Returns:
 *   The correction in pixels (positive means "move up").
 */
function inkOffset(element: HTMLElement, value: string): number {
    const style = getComputedStyle(element)
    const ctx = document.createElement("canvas").getContext("2d")
    if (!ctx) return 0
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    const m = ctx.measureText(value)
    const size = parseFloat(style.fontSize)
    const lineHeight = parseFloat(style.lineHeight) || size
    const fontHeight = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent
    const baseline = (lineHeight - fontHeight) / 2 + m.fontBoundingBoxAscent
    const inkTop = baseline - m.actualBoundingBoxAscent
    const inkCenter = inkTop + (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / 2
    const offset = inkCenter - lineHeight / 2
    return Number.isFinite(offset) ? offset : 0
}

/**
 * Purpose:
 *   Her new age as a little sun: a shimmering gold number that keeps
 *   sending out rays. Each ray starts short beside the number, stretches
 *   outward along its own direction, then fades and disappears, in a wave
 *   around the circle. Small four-pointed sparkles twinkle around it. The
 *   number is centered on its glyphs, so the rays radiate from the middle
 *   of the digits rather than from the middle of their line box.
 *
 * Args:
 *   - value : the number shown.
 *   - rays  : how many rays.
 *   - delay : start of the entrance, in seconds.
 *
 * Returns:
 *   A square, centered block sized by --bd-sun.
 */
export function SunNumber({ value, rays, delay }: SunNumberProps) {
    const numberRef = useRef<HTMLSpanElement>(null)
    const [lift, setLift] = useState(0)

    // Fonts load late, so measure again once they are ready.
    useEffect(() => {
        const measure = () => {
            const number = numberRef.current
            if (number) setLift(inkOffset(number, value))
        }
        measure()
        document.fonts?.ready.then(measure).catch(() => undefined)
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [value])

    const lines = useMemo(() => {
        const rand = seededRandom("sun-rays")
        return Array.from({ length: rays }, (_, i) => {
            // A little irregularity makes it feel hand drawn.
            const degrees = (i / rays) * 360 + (rand() - 0.5) * 4
            const long = i % 2 === 0
            const inner = 58 + rand() * 3
            const length = (long ? 30 : 20) + rand() * 5
            return {
                degrees,
                inner,
                outer: inner + length,
                width: long ? 4 : 3,
                // Rays leave in a wave around the circle, each with its own pace.
                delay: delay + 0.35 + (i / rays) * BURST_SECONDS * 0.85 + rand() * 0.25,
                dur: BURST_SECONDS + rand() * 0.8,
            }
        })
    }, [rays, delay])

    const sparkles = useMemo(() => {
        const rand = seededRandom("sun-sparkles")
        return Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2 + rand() * 0.6
            const radius = 26 + rand() * 18
            return {
                left: 50 + Math.cos(angle) * radius,
                top: 50 + Math.sin(angle) * radius,
                size: 7 + rand() * 9,
                delay: delay + 0.8 + rand() * 2.4,
                dur: 1.8 + rand() * 1.6,
            }
        })
    }, [delay])

    return (
        <div
            aria-label={value}
            role="img"
            className="relative my-6 grid shrink-0 place-items-center"
            style={{ width: "var(--bd-sun)", height: "var(--bd-sun)" }}
        >
            <motion.div
                aria-hidden
                className="absolute inset-[16%] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, color-mix(in srgb, var(--bd-light) 34%, transparent) 0%, color-mix(in srgb, var(--bd-light) 8%, transparent) 55%, transparent 72%)",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0.8], scale: 1 }}
                transition={{ duration: 1.6, delay, ease: EASE_OUT }}
            />

            <svg
                aria-hidden
                viewBox="-100 -100 200 200"
                className="absolute inset-0 block h-full w-full overflow-visible"
                style={{ color: "color-mix(in srgb, var(--bd-light) 85%, white)" }}
            >
                {lines.map((l, i) => (
                    <g key={i} transform={`rotate(${l.degrees})`}>
                        <line
                            className="bd-ray"
                            x1={l.inner}
                            y1="0"
                            x2={l.outer}
                            y2="0"
                            stroke="currentColor"
                            strokeWidth={l.width}
                            strokeLinecap="round"
                            style={
                                {
                                    transformOrigin: `${l.inner}px 0px`,
                                    "--delay": `${l.delay}s`,
                                    "--dur": `${l.dur}s`,
                                } as CSSProperties
                            }
                        />
                    </g>
                ))}
            </svg>

            <span
                aria-hidden
                className="bd-serif bd-sun-glow absolute"
                style={{ transform: `translateY(${-lift}px)` }}
            >
                {value}
            </span>
            <motion.span
                ref={numberRef}
                aria-hidden
                className="bd-serif bd-sun-number relative"
                style={{ top: -lift }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 11, delay }}
            >
                {value}
            </motion.span>

            {sparkles.map((s, i) => (
                <span
                    key={i}
                    aria-hidden
                    className="bd-sparkle"
                    style={
                        {
                            left: `${s.left}%`,
                            top: `${s.top}%`,
                            "--size": `${s.size}px`,
                            "--delay": `${s.delay}s`,
                            "--dur": `${s.dur}s`,
                        } as CSSProperties
                    }
                />
            ))}
        </div>
    )
}
