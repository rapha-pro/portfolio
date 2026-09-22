"use client"

import { useMemo, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { seededRandom } from "@/lib/birthday/random"
import { EASE_OUT } from "../shared/motion"

type SunNumberProps = {
    value: string // e.g. "20"
    rays: number // lines around it
    delay: number // seconds before it appears
}

/**
 * Purpose:
 *   Her new age as a little sun, the way a child draws one: a shimmering
 *   gold number inside a ring, with long and short rays drawn one by one
 *   around it. The rays turn slowly and breathe; small four-pointed
 *   sparkles twinkle around the number.
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
    const lines = useMemo(() => {
        const rand = seededRandom("sun-rays")
        return Array.from({ length: rays }, (_, i) => {
            // A little irregularity makes it feel hand drawn.
            const angle = (i / rays) * Math.PI * 2 + (rand() - 0.5) * 0.07
            const long = i % 2 === 0
            const inner = 64 + rand() * 3
            const outer = (long ? 94 : 82) + rand() * 4
            return {
                x1: Math.cos(angle) * inner,
                y1: Math.sin(angle) * inner,
                x2: Math.cos(angle) * outer,
                y2: Math.sin(angle) * outer,
                long,
            }
        })
    }, [rays])

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

            <div aria-hidden className="bd-sun-spin absolute inset-0">
                <svg
                    viewBox="-100 -100 200 200"
                    className="bd-sun-breathe block h-full w-full overflow-visible"
                    style={{ color: "color-mix(in srgb, var(--bd-light) 85%, white)" }}
                >
                    <motion.circle
                        r="54"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeOpacity="0.75"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.1, delay: delay + 0.2, ease: EASE_OUT }}
                    />
                    {lines.map((l, i) => (
                        <motion.line
                            key={i}
                            x1={l.x1}
                            y1={l.y1}
                            x2={l.x2}
                            y2={l.y2}
                            stroke="currentColor"
                            strokeWidth={l.long ? 4 : 3}
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                                duration: 0.45,
                                delay: delay + 0.6 + i * 0.045,
                                ease: EASE_OUT,
                            }}
                        />
                    ))}
                </svg>
            </div>

            <span aria-hidden className="bd-serif bd-sun-glow absolute">
                {value}
            </span>
            <motion.span
                aria-hidden
                className="bd-serif bd-sun-number relative"
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
