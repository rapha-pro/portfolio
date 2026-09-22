"use client"

import { useId } from "react"
import { motion } from "framer-motion"
import { EASE_IN_OUT } from "../shared/motion"

type NotebookIllustrationProps = {
    delay?: number // seconds before the drawing starts
}

/**
 * Purpose:
 *   The little book she will open: an old leather notebook with stitched
 *   edges, a ribbon bookmark, and a pen resting on it. It draws itself in warm gold lines, then the leather fills in and
 *   the whole thing floats gently in the light.
 *
 * Args:
 *   - delay : start delay in seconds.
 *
 * Returns:
 *   An inline SVG illustration with a soft glow behind it.
 */
export function NotebookIllustration({ delay = 0 }: NotebookIllustrationProps) {
    const id = useId().replace(/:/g, "")
    const leather = `bd-leather-${id}`
    const penBody = `bd-pen-${id}`

    const draw = (order: number, duration = 1.8) => ({
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        transition: {
            pathLength: { duration, delay: delay + order * 0.18, ease: EASE_IN_OUT },
            opacity: { duration: 0.3, delay: delay + order * 0.18 },
        },
    })
    const fill = (extra = 0) => ({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1.6, delay: delay + 1.5 + extra },
    })

    return (
        <div className="relative w-[clamp(160px,min(44vw,27dvh),230px)]">
            <motion.div
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[170%] w-[170%] rounded-full"
                style={{
                    x: "-50%",
                    y: "-50%",
                    background:
                        "radial-gradient(circle, color-mix(in srgb, var(--bd-light) 16%, transparent) 0%, transparent 62%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{
                    duration: 5.5,
                    delay: delay + 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.svg
                viewBox="0 0 260 230"
                role="img"
                aria-label="A small leather notebook with a pen"
                className="relative block w-full overflow-visible"
                style={{ color: "color-mix(in srgb, var(--bd-light) 78%, white)" }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay + 3 }}
            >
                <defs>
                    <linearGradient id={leather} x1="0" y1="0" x2="1" y2="1">
                        <stop
                            offset="0"
                            style={{
                                stopColor: "color-mix(in srgb, var(--bd-ember) 42%, #1a110a)",
                            }}
                        />
                        <stop
                            offset="1"
                            style={{
                                stopColor: "color-mix(in srgb, var(--bd-ember) 16%, #0d0906)",
                            }}
                        />
                    </linearGradient>
                    <linearGradient id={penBody} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#0f0b08" />
                        <stop offset="0.5" stopColor="#2b2119" />
                        <stop offset="1" stopColor="#0f0b08" />
                    </linearGradient>
                </defs>

                <g
                    transform="rotate(-6 120 105)"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Page block */}
                    <motion.rect
                        x="69"
                        y="34"
                        width="112"
                        height="150"
                        rx="6"
                        strokeWidth="1"
                        strokeOpacity="0.45"
                        fill="rgba(243,236,225,0.05)"
                        {...draw(0)}
                    />
                    <motion.rect
                        x="65.5"
                        y="31"
                        width="112"
                        height="150"
                        rx="6"
                        strokeWidth="1"
                        strokeOpacity="0.6"
                        fill="rgba(243,236,225,0.05)"
                        {...draw(1)}
                    />

                    {/* Cover */}
                    <motion.rect
                        x="62"
                        y="28"
                        width="112"
                        height="150"
                        rx="7"
                        stroke="none"
                        fill={`url(#${leather})`}
                        {...fill()}
                    />
                    <motion.rect
                        x="62"
                        y="28"
                        width="112"
                        height="150"
                        rx="7"
                        strokeWidth="1.4"
                        {...draw(2, 2.2)}
                    />

                    {/* Spine */}
                    <motion.path
                        d="M78 28V178M62 45h16M62 161h16"
                        strokeWidth="1"
                        strokeOpacity="0.7"
                        {...draw(3)}
                    />

                    {/* Stitching */}
                    <motion.rect
                        x="87"
                        y="40"
                        width="75"
                        height="126"
                        rx="3"
                        strokeWidth="0.9"
                        strokeOpacity="0.55"
                        strokeDasharray="2.5 3.5"
                        {...fill(0.3)}
                    />

                    {/* Ribbon bookmark */}
                    <motion.path
                        d="M109 177.5V205l4-4.6 4 4.6V177.5"
                        stroke="none"
                        fill="color-mix(in srgb, var(--bd-ember) 70%, #5a2f1a)"
                        style={{ transformBox: "fill-box", originX: 0.5, originY: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, rotate: [-2.5, 2.5, -2.5] }}
                        transition={{
                            opacity: { duration: 1.2, delay: delay + 2 },
                            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                        }}
                    />
                </g>

                {/* Pen resting across the corner */}
                <g
                    transform="translate(206 150) rotate(-48)"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <motion.rect
                        x="-4.5"
                        y="-62"
                        width="9"
                        height="100"
                        rx="4.5"
                        stroke="none"
                        fill={`url(#${penBody})`}
                        {...fill(0.6)}
                    />
                    <motion.rect
                        x="-4.5"
                        y="-62"
                        width="9"
                        height="100"
                        rx="4.5"
                        strokeWidth="1.1"
                        {...draw(7)}
                    />
                    <motion.path d="M-4.5-28h9M3.2-57v27" strokeWidth="0.9" {...draw(8, 1.2)} />
                    <motion.path
                        d="M-4.5 38L0 57l4.5-19Z"
                        strokeWidth="1"
                        fill="color-mix(in srgb, var(--bd-light) 35%, transparent)"
                        {...draw(9, 1.2)}
                    />
                    <motion.path d="M0 44v8" strokeWidth="0.7" {...draw(10, 0.8)} />
                </g>
            </motion.svg>
        </div>
    )
}
