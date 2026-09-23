"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { BirthdayTiming, UnlockedConfig } from "@/lib/data/birthday/types"
import { EASE_OUT, sec } from "../shared/motion"
import { useDocumentVisible } from "../shared/useDocumentVisible"

type UnlockedScreenProps = {
    unlocked: UnlockedConfig
    timing: BirthdayTiming["gate"]
    onDone: () => void
}

const SPARK_MS = 900 // the little burst before the first line

/**
 * Purpose:
 *   The moment right after the right code: a small spark opens the page,
 *   then each line fades in after the one before it, with a few words
 *   picked out in color. It fades away on its own and hands over to the
 *   briefing.
 *
 * Args:
 *   - unlocked : the lines and their colored pieces.
 *   - timing   : gate timings (line gap and total hold).
 *   - onDone   : called once, when the screen has faded out.
 *
 * Returns:
 *   The unlock screen.
 */
export function UnlockedScreen({ unlocked, timing, onDone }: UnlockedScreenProps) {
    const doneRef = useRef(onDone)
    const pageVisible = useDocumentVisible()

    useEffect(() => {
        doneRef.current = onDone
    }, [onDone])

    useEffect(() => {
        if (!pageVisible) return
        const t = window.setTimeout(() => doneRef.current(), timing.unlockedHoldMs)
        return () => window.clearTimeout(t)
    }, [pageVisible, timing.unlockedHoldMs])

    const lineAt = (i: number) => sec(SPARK_MS) + i * sec(timing.unlockedLineMs)

    return (
        <motion.section
            aria-label={unlocked.lines.map((line) => line.map((p) => p.text).join("")).join(" ")}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-7 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 1 } }}
            transition={{ duration: 0.4 }}
        >
            {/* The spark that opens the screen */}
            <motion.span
                aria-hidden
                className="absolute h-2 w-2 rounded-full"
                style={{
                    background: "#fffaf0",
                    boxShadow:
                        "0 0 24px 8px color-mix(in srgb, var(--bd-light) 70%, transparent), 0 0 80px 30px color-mix(in srgb, var(--bd-light) 28%, transparent)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2.4, 22], opacity: [0, 1, 0] }}
                transition={{ duration: sec(SPARK_MS) + 0.5, ease: EASE_OUT }}
            />

            <div className="flex max-w-[34rem] flex-col gap-7">
                {unlocked.lines.map((line, i) => (
                    <motion.p
                        key={i}
                        className="bd-serif bd-glow text-[clamp(1.3rem,min(5vw,5.2dvh),1.95rem)] font-medium leading-[1.4]"
                        initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1.1, delay: lineAt(i), ease: EASE_OUT }}
                    >
                        {line.map((part, j) => (
                            <span
                                key={j}
                                className={
                                    part.color === "green"
                                        ? "bd-hl-green"
                                        : part.color === "yellow"
                                          ? "bd-hl-yellow"
                                          : undefined
                                }
                            >
                                {part.text}
                            </span>
                        ))}
                    </motion.p>
                ))}
            </div>
        </motion.section>
    )
}
