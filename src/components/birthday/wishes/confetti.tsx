"use client"

import { useMemo, type CSSProperties } from "react"
import { seededRandom } from "@/lib/birthday/random"

type ConfettiProps = {
    count: number // phones show about half
    colors: string[] // festive palette from theme.ts
    delay: number // seconds before the first pieces fall
}

/**
 * Purpose:
 *   Confetti drifting down across the screen: small paper strips and dots
 *   tumbling in 3D as they fall. The first wave starts together when the
 *   number appears, then it keeps falling gently. Pure CSS animation with
 *   seeded values; transform and opacity only, so it stays smooth.
 *
 * Args:
 *   - count  : number of pieces.
 *   - colors : palette to cycle through.
 *   - delay  : start of the first wave, in seconds.
 *
 * Returns:
 *   A decorative, non-interactive layer.
 */
export function Confetti({ count, colors, delay }: ConfettiProps) {
    const pieces = useMemo(() => {
        const rand = seededRandom("confetti")
        return Array.from({ length: count }, (_, i) => {
            const dot = rand() < 0.22
            const width = dot ? 6 + rand() * 3 : 5 + rand() * 4
            return {
                left: rand() * 100,
                width,
                height: dot ? width : 9 + rand() * 7,
                radius: dot ? "9999px" : "1.5px",
                color: colors[i % Math.max(1, colors.length)] ?? "#e9c27a",
                dur: 5.5 + rand() * 5,
                delay: delay + rand() * 3.5,
                drift: (rand() * 2 - 1) * 70,
                spin: 1.1 + rand() * 1.9,
            }
        })
    }, [count, colors, delay])

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[16] overflow-hidden">
            {pieces.map((p, i) => (
                <span
                    key={i}
                    className="bd-confetti"
                    style={
                        {
                            left: `${p.left}%`,
                            "--dur": `${p.dur}s`,
                            "--delay": `${p.delay}s`,
                            "--drift": `${p.drift}px`,
                        } as CSSProperties
                    }
                >
                    <span
                        className="bd-confetti-piece"
                        style={
                            {
                                width: p.width,
                                height: p.height,
                                borderRadius: p.radius,
                                background: p.color,
                                "--spin": `${p.spin}s`,
                            } as CSSProperties
                        }
                    />
                </span>
            ))}
        </div>
    )
}
