"use client"

import { useId } from "react"
import { motion, type MotionValue } from "framer-motion"

type HangingBulbProps = {
    lit: MotionValue<number> // 0 = dark glass, 1 = fully lit (includes flicker)
    visible: boolean
}

/**
 * Purpose:
 *   The single light source of the room: a cord from the top edge, a
 *   brass socket, an old filament bulb and its glow. Brightness follows
 *   the `lit` motion value so flickers never re-render React.
 *
 * Args:
 *   - lit     : brightness motion value.
 *   - visible : fades the cord and glass in or out.
 *
 * Returns:
 *   The bulb, positioned at the top center of the stage.
 */
export function HangingBulb({ lit, visible }: HangingBulbProps) {
    const id = useId().replace(/:/g, "")
    const glassId = `bd-glass-${id}`
    const socketId = `bd-socket-${id}`
    const blurId = `bd-blur-${id}`

    return (
        <motion.div
            className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-col items-center"
            initial={false}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: visible ? 0.9 : 0.5 }}
        >
            {/* Cord */}
            <div
                className="w-px"
                style={{
                    height: "var(--bd-cord)",
                    background:
                        "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--bd-ink) 22%, transparent))",
                }}
            />

            <div className="relative" style={{ width: "var(--bd-bulb-w)" }}>
                {/* Wide halo */}
                <motion.div
                    aria-hidden
                    className="absolute left-1/2 rounded-full"
                    style={{
                        opacity: lit,
                        top: "56%",
                        width: "calc(var(--bd-bulb-w) * 9)",
                        height: "calc(var(--bd-bulb-w) * 9)",
                        x: "-50%",
                        y: "-50%",
                        background:
                            "radial-gradient(circle, color-mix(in srgb, var(--bd-light) 22%, transparent) 0%, color-mix(in srgb, var(--bd-light) 6%, transparent) 38%, transparent 68%)",
                    }}
                />
                {/* Hot core */}
                <motion.div
                    aria-hidden
                    className="absolute left-1/2 rounded-full"
                    style={{
                        opacity: lit,
                        top: "56%",
                        width: "calc(var(--bd-bulb-w) * 2.4)",
                        height: "calc(var(--bd-bulb-w) * 2.4)",
                        x: "-50%",
                        y: "-50%",
                        background:
                            "radial-gradient(circle, color-mix(in srgb, var(--bd-light) 70%, white) 0%, color-mix(in srgb, var(--bd-light) 40%, transparent) 28%, transparent 70%)",
                    }}
                />

                <svg viewBox="0 0 60 100" className="relative block w-full" aria-hidden>
                    <defs>
                        <radialGradient id={glassId} cx="50%" cy="58%" r="58%">
                            <stop offset="0" style={{ stopColor: "#fffaf0", stopOpacity: 0.95 }} />
                            <stop
                                offset="0.35"
                                style={{ stopColor: "var(--bd-light)", stopOpacity: 0.7 }}
                            />
                            <stop
                                offset="1"
                                style={{ stopColor: "var(--bd-light)", stopOpacity: 0.12 }}
                            />
                        </radialGradient>
                        <linearGradient id={socketId} x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0" stopColor="#1a1612" />
                            <stop offset="0.45" stopColor="#4a3f33" />
                            <stop offset="1" stopColor="#15110e" />
                        </linearGradient>
                        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1.4" />
                        </filter>
                    </defs>

                    {/* Socket */}
                    <rect x="21" y="0" width="18" height="15" rx="2.5" fill={`url(#${socketId})`} />
                    <path
                        d="M21 4.5h18M21 8h18M21 11.5h18"
                        stroke="black"
                        strokeOpacity="0.45"
                        strokeWidth="0.8"
                    />
                    <rect x="19.5" y="14" width="21" height="4.5" rx="1.5" fill="#1f1a15" />

                    {/* Unlit glass, always visible */}
                    <path
                        d="M23 18.5C23 27 12 33 12 55C12 73 20 86 30 86C40 86 48 73 48 55C48 33 37 27 37 18.5Z"
                        fill="rgba(255,245,230,0.04)"
                        stroke="rgba(255,240,220,0.22)"
                        strokeWidth="0.8"
                    />

                    {/* Lit glass */}
                    <motion.path
                        d="M23 18.5C23 27 12 33 12 55C12 73 20 86 30 86C40 86 48 73 48 55C48 33 37 27 37 18.5Z"
                        fill={`url(#${glassId})`}
                        style={{ opacity: lit }}
                    />

                    {/* Filament supports */}
                    <path
                        d="M27 19.5L27 47M33 19.5L33 47"
                        stroke="rgba(255,240,220,0.35)"
                        strokeWidth="0.7"
                        fill="none"
                    />
                    {/* Glowing coil */}
                    <motion.g style={{ opacity: lit }}>
                        <path
                            d="M27 47l1-2.4l1 2.4l1-2.4l1 2.4l1-2.4l1 2.4"
                            stroke="#fff4d6"
                            strokeWidth="2.4"
                            fill="none"
                            filter={`url(#${blurId})`}
                        />
                        <path
                            d="M27 47l1-2.4l1 2.4l1-2.4l1 2.4l1-2.4l1 2.4"
                            stroke="#fffbef"
                            strokeWidth="0.9"
                            fill="none"
                            strokeLinejoin="round"
                        />
                    </motion.g>

                    {/* Glass highlight */}
                    <ellipse
                        cx="19.5"
                        cy="50"
                        rx="2.2"
                        ry="8"
                        fill="white"
                        opacity="0.16"
                        transform="rotate(10 19.5 50)"
                    />
                </svg>
            </div>
        </motion.div>
    )
}
