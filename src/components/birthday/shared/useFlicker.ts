"use client"

import { useEffect } from "react"
import { animate, useMotionValue, type MotionValue } from "framer-motion"

type FlickerOptions = {
    enabled: boolean
    minGapMs: number
    maxGapMs: number
}

/** A few imperfect dips, picked at random so the rhythm never repeats. */
const PATTERNS: { values: number[]; times: number[]; duration: number }[] = [
    { values: [1, 0.62, 1], times: [0, 0.35, 1], duration: 0.22 },
    { values: [1, 0.4, 0.92, 0.6, 1], times: [0, 0.18, 0.42, 0.68, 1], duration: 0.55 },
    { values: [1, 0.78, 1, 0.84, 1], times: [0, 0.25, 0.5, 0.75, 1], duration: 0.7 },
    { values: [1, 0.55, 1], times: [0, 0.5, 1], duration: 0.16 },
]

/**
 * Purpose:
 *   Drives the occasional flicker of the room's single light. Returns a
 *   motion value (1 = steady) that light layers multiply into their
 *   opacity, so the flicker never re-renders React.
 *
 * Args:
 *   - enabled  : false holds the light steady (reduced motion, gate, tunnel).
 *   - minGapMs : shortest pause between two flickers.
 *   - maxGapMs : longest pause between two flickers.
 *
 * Returns:
 *   A MotionValue<number> between roughly 0.4 and 1.
 */
export function useFlicker({ enabled, minGapMs, maxGapMs }: FlickerOptions): MotionValue<number> {
    const light = useMotionValue(1)

    useEffect(() => {
        if (!enabled) {
            light.set(1)
            return
        }

        let timer = 0
        let controls: ReturnType<typeof animate> | undefined

        const schedule = () => {
            const gap = minGapMs + Math.random() * Math.max(0, maxGapMs - minGapMs)
            timer = window.setTimeout(() => {
                const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)]
                controls = animate(light, pattern.values, {
                    duration: pattern.duration,
                    times: pattern.times,
                    ease: "linear",
                })
                schedule()
            }, gap)
        }

        schedule()
        return () => {
            window.clearTimeout(timer)
            controls?.stop()
            light.set(1)
        }
    }, [enabled, minGapMs, maxGapMs, light])

    return light
}
