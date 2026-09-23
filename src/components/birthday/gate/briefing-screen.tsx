"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { BirthdayTiming, BriefingConfig } from "@/lib/data/birthday/types"
import { EASE_OUT } from "../shared/motion"
import { useDocumentVisible } from "../shared/useDocumentVisible"
import { useMediaQuery } from "../shared/useMediaQuery"

type BriefingScreenProps = {
    briefing: BriefingConfig
    timing: BirthdayTiming["gate"]
    onDone: () => void
}

/**
 * Purpose:
 *   A short breath before the tunnel: headphones on, and on a phone, turn
 *   it sideways. A little phone tips from upright to landscape over and
 *   over to show what to do. It moves on by itself, or on a tap.
 *
 * Args:
 *   - briefing : the message for phones and for wider screens.
 *   - timing   : gate timings (how long this screen stays).
 *   - onDone   : called once, when the screen is over.
 *
 * Returns:
 *   The briefing screen.
 */
export function BriefingScreen({ briefing, timing, onDone }: BriefingScreenProps) {
    const doneRef = useRef(onDone)
    const pageVisible = useDocumentVisible()
    const wide = useMediaQuery("(min-width: 900px)")

    useEffect(() => {
        doneRef.current = onDone
    }, [onDone])

    useEffect(() => {
        if (!pageVisible) return
        const t = window.setTimeout(() => doneRef.current(), timing.briefingMs)
        return () => window.clearTimeout(t)
    }, [pageVisible, timing.briefingMs])

    const message = wide ? briefing.desktopMessage : briefing.message

    return (
        <motion.section
            aria-label={message}
            className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-9 px-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.9 } }}
            transition={{ duration: 1 }}
            onClick={() => doneRef.current()}
        >
            <div aria-hidden className="flex items-end gap-8 text-[var(--bd-light)]">
                {!wide && (
                    <motion.svg
                        viewBox="0 0 44 72"
                        className="h-[clamp(64px,16vw,84px)] w-auto"
                        style={{ transformOrigin: "50% 50%" }}
                        animate={{ rotate: [0, 0, -90, -90, 0] }}
                        transition={{
                            duration: 3.6,
                            times: [0, 0.18, 0.45, 0.85, 1],
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <rect
                            x="2"
                            y="2"
                            width="40"
                            height="68"
                            rx="7"
                            fill="color-mix(in srgb, var(--bd-light) 8%, transparent)"
                            stroke="currentColor"
                            strokeWidth="2.4"
                        />
                        <rect
                            x="17"
                            y="6.5"
                            width="10"
                            height="2.6"
                            rx="1.3"
                            fill="currentColor"
                            opacity="0.7"
                        />
                        <rect
                            x="16"
                            y="63"
                            width="12"
                            height="2.6"
                            rx="1.3"
                            fill="currentColor"
                            opacity="0.5"
                        />
                    </motion.svg>
                )}

                <svg viewBox="0 0 64 56" className="h-[clamp(56px,14vw,72px)] w-auto">
                    <path
                        d="M8 40V30a24 24 0 0 1 48 0v10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                    />
                    <rect
                        x="2"
                        y="34"
                        width="14"
                        height="20"
                        rx="6"
                        fill="color-mix(in srgb, var(--bd-light) 16%, transparent)"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <rect
                        x="48"
                        y="34"
                        width="14"
                        height="20"
                        rx="6"
                        fill="color-mix(in srgb, var(--bd-light) 16%, transparent)"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                </svg>
            </div>

            <motion.p
                className="bd-serif bd-glow max-w-[30rem] text-balance text-[clamp(1.15rem,min(4.2vw,4.6dvh),1.6rem)] font-medium leading-[1.45]"
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT }}
            >
                {message}
            </motion.p>
        </motion.section>
    )
}
