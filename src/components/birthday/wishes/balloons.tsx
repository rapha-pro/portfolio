"use client"

import { useId, useMemo, type CSSProperties } from "react"
import { seededRandom } from "@/lib/birthday/random"

type BalloonsProps = {
    count: number
    colors: string[] // festive palette from theme.ts
    delay: number // seconds before the first balloon rises
}

/**
 * Purpose:
 *   Glossy balloons rising slowly from the bottom of the screen, swaying on
 *   their strings. Most drift up along the sides so they frame the text
 *   rather than cover it; the few in the middle are smaller and fainter.
 *   Pure CSS animation with seeded positions.
 *
 * Args:
 *   - count  : number of balloons.
 *   - colors : palette to cycle through.
 *   - delay  : start time of the first one, in seconds.
 *
 * Returns:
 *   A decorative layer (place it behind the text).
 */
export function Balloons({ count, colors, delay }: BalloonsProps) {
    const gid = useId().replace(/:/g, "")

    const balloons = useMemo(() => {
        const rand = seededRandom("balloons")
        return Array.from({ length: count }, (_, i) => {
            const side = rand() < 0.72
            const left = side
                ? rand() < 0.5
                    ? 1 + rand() * 20
                    : 79 + rand() * 18
                : 30 + rand() * 38
            return {
                left,
                size: side ? 42 + rand() * 26 : 30 + rand() * 12,
                alpha: side ? 0.78 : 0.38,
                dur: 15 + rand() * 9,
                delay: delay + i * 1.15 + rand() * 0.8,
                sway: 8 + rand() * 18,
                swayDur: 2.8 + rand() * 2.4,
                color: colors[i % Math.max(1, colors.length)] ?? "#e9c27a",
            }
        })
    }, [count, colors, delay])

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {balloons.map((b, i) => (
                <div
                    key={i}
                    className="bd-balloon"
                    style={
                        {
                            left: `${b.left}%`,
                            width: b.size,
                            "--dur": `${b.dur}s`,
                            "--delay": `${b.delay}s`,
                            "--alpha": b.alpha,
                        } as CSSProperties
                    }
                >
                    <div
                        className="bd-balloon-sway"
                        style={
                            {
                                "--sway": `${b.sway}px`,
                                "--sway-dur": `${b.swayDur}s`,
                            } as CSSProperties
                        }
                    >
                        <svg viewBox="0 0 40 74" className="block w-full overflow-visible">
                            <defs>
                                <radialGradient id={`${gid}-${i}`} cx="34%" cy="28%" r="78%">
                                    <stop
                                        offset="0"
                                        style={{
                                            stopColor: `color-mix(in srgb, ${b.color} 55%, white)`,
                                        }}
                                    />
                                    <stop offset="0.55" style={{ stopColor: b.color }} />
                                    <stop
                                        offset="1"
                                        style={{
                                            stopColor: `color-mix(in srgb, ${b.color} 62%, black)`,
                                        }}
                                    />
                                </radialGradient>
                            </defs>
                            <path
                                d="M20 1C9.2 1 2 9.6 2 20.4c0 12.3 9.6 22.2 18 24.4 8.4-2.2 18-12.1 18-24.4C38 9.6 30.8 1 20 1Z"
                                fill={`url(#${gid}-${i})`}
                            />
                            <path
                                d="M17.6 44.4h4.8L20 48.2Z"
                                style={{ fill: `color-mix(in srgb, ${b.color} 62%, black)` }}
                            />
                            <path
                                d="M20 48.2c-2.6 4.6 2.6 8.4 0 13s2.6 8 0 12.6"
                                fill="none"
                                stroke="rgba(243,236,225,0.35)"
                                strokeWidth="0.8"
                                strokeLinecap="round"
                            />
                            <ellipse
                                cx="12.5"
                                cy="13"
                                rx="3.4"
                                ry="6.2"
                                fill="white"
                                opacity="0.38"
                                transform="rotate(-24 12.5 13)"
                            />
                        </svg>
                    </div>
                </div>
            ))}
        </div>
    )
}
