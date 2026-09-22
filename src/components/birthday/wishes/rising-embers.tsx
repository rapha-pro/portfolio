"use client"

import { useMemo, type CSSProperties } from "react"
import { seededRandom } from "@/lib/birthday/random"

type RisingEmbersProps = {
    count?: number
}

/**
 * Purpose:
 *   Warm specks of light rising slowly through the birthday chapter, like
 *   the air above a candle. Deliberately few and faint: warmth, not
 *   confetti.
 *
 * Args:
 *   - count : number of embers (default 16).
 *
 * Returns:
 *   Decorative CSS-animated dots.
 */
export function RisingEmbers({ count = 16 }: RisingEmbersProps) {
    const embers = useMemo(() => {
        const rand = seededRandom("embers")
        return Array.from({ length: count }, () => ({
            left: 6 + rand() * 88,
            size: 2 + rand() * 3.5,
            dur: 14 + rand() * 12,
            delay: -rand() * 26,
            dx: (rand() * 2 - 1) * 60,
            alpha: 0.25 + rand() * 0.4,
        }))
    }, [count])

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {embers.map((e, i) => (
                <span
                    key={i}
                    className="bd-ember"
                    style={
                        {
                            left: `${e.left}%`,
                            "--size": `${e.size}px`,
                            "--dur": `${e.dur}s`,
                            "--delay": `${e.delay}s`,
                            "--dx": `${e.dx}px`,
                            "--alpha": e.alpha,
                        } as CSSProperties
                    }
                />
            ))}
        </div>
    )
}
