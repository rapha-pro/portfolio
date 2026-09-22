"use client"

import { useMemo, type CSSProperties } from "react"
import { seededRandom } from "@/lib/birthday/random"

type DustMotesProps = {
    count?: number
}

/**
 * Purpose:
 *   Specks of dust drifting through the beam under the bulb. Pure CSS
 *   animations with seeded positions, so it is cheap and hydration safe.
 *
 * Args:
 *   - count : number of motes (default 22).
 *
 * Returns:
 *   Absolutely positioned decorative dots.
 */
export function DustMotes({ count = 22 }: DustMotesProps) {
    const motes = useMemo(() => {
        const rand = seededRandom("dust")
        return Array.from({ length: count }, () => {
            const depth = rand()
            // Stay inside the cone: narrow near the bulb, wider further down.
            const top = 14 + depth * 62
            const spread = 4 + depth * 26
            return {
                left: 50 + (rand() * 2 - 1) * spread,
                top,
                size: 1.4 + rand() * 2.4,
                dur: 10 + rand() * 12,
                delay: -rand() * 20,
                dx: (rand() * 2 - 1) * 36,
                dy: (rand() * 2 - 1) * 42,
                alpha: 0.25 + rand() * 0.5,
            }
        })
    }, [count])

    return (
        <div aria-hidden className="absolute inset-0">
            {motes.map((m, i) => (
                <span
                    key={i}
                    className="bd-mote"
                    style={
                        {
                            left: `${m.left}%`,
                            top: `${m.top}%`,
                            "--size": `${m.size}px`,
                            "--dur": `${m.dur}s`,
                            "--delay": `${m.delay}s`,
                            "--dx": `${m.dx}px`,
                            "--dy": `${m.dy}px`,
                            "--alpha": m.alpha,
                        } as CSSProperties
                    }
                />
            ))}
        </div>
    )
}
