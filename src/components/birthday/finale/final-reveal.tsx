"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { BirthdayTiming, FinaleConfig } from "@/lib/data/birthday/types"
import { EASE_IN_OUT, EASE_OUT, sec } from "../shared/motion"
import { useDocumentVisible } from "../shared/useDocumentVisible"
import { useFollowReveal } from "../shared/useFollowReveal"
import { NotebookIllustration } from "./notebook-illustration"

type FinalRevealProps = {
    finale: FinaleConfig
    timing: BirthdayTiming["finale"]
    credit: { label: string; url: string } | null // the song, linked on YouTube
    onCreditClick: () => void // pause the page music before leaving for YouTube
    onReplay: () => void
}

/** Silence before the first line, so it lands on a held breath. */
const FIRST_BREATH_MS = 1400

/**
 * Purpose:
 *   The turn at the end: the closing lines appear one at a time, then the
 *   notebook draws itself and the last words settle around it, with a
 *   small credit linking the song. The last screen stays; a quiet "begin
 *   again" link appears only after a long while.
 *
 * Args:
 *   - finale        : lines, instruction, optional closing title, blessing.
 *   - timing        : fades, holds and replay delay.
 *   - credit        : song credit and its YouTube link, or null.
 *   - onCreditClick : called when the credit is opened.
 *   - onReplay      : restarts from the tunnel.
 *
 * Returns:
 *   The final section.
 */
export function FinalReveal({ finale, timing, credit, onCreditClick, onReplay }: FinalRevealProps) {
    const [step, setStep] = useState(0)
    const [showReplay, setShowReplay] = useState(false)
    const pageVisible = useDocumentVisible()
    const lines = finale.lines
    const done = step >= lines.length
    const fadeIn = sec(timing.lineFadeMs)
    const fadeOut = sec(timing.lineFadeMs * 0.8)
    const scrollRef = useRef<HTMLDivElement>(null)
    const hasTitle = finale.closingTitle.trim().length > 0
    const blessingAt = hasTitle ? 6.8 : 5.4
    const creditAt = blessingAt + 2.2
    useFollowReveal(scrollRef, done ? [3, 5.4, blessingAt, creditAt] : [])

    useEffect(() => {
        if (!pageVisible) return
        if (done) {
            const t = window.setTimeout(() => setShowReplay(true), timing.replayAfterMs)
            return () => window.clearTimeout(t)
        }
        const hold = lines[step].holdMs ?? timing.defaultHoldMs
        const lead = step === 0 ? FIRST_BREATH_MS : timing.lineFadeMs * 0.8
        const t = window.setTimeout(() => setStep((s) => s + 1), lead + timing.lineFadeMs + hold)
        return () => window.clearTimeout(t)
    }, [
        step,
        done,
        lines,
        pageVisible,
        timing.defaultHoldMs,
        timing.lineFadeMs,
        timing.replayAfterMs,
    ])

    const settle = (delay: number, duration = 1.8) => ({
        initial: { opacity: 0, y: 8, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration, delay, ease: EASE_OUT },
    })

    return (
        <motion.section
            aria-label={finale.closingTitle || finale.instruction}
            className="absolute inset-0 z-10 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            transition={{ duration: 1.2 }}
        >
            <div
                ref={scrollRef}
                className="bd-scroll flex min-h-0 flex-1 flex-col px-6"
                style={{
                    paddingTop: "calc(var(--bd-top) * 0.8)",
                    paddingBottom: "var(--bd-bottom)",
                }}
            >
                <div className="m-auto flex w-full max-w-[36rem] flex-col items-center text-center">
                    <AnimatePresence mode="wait">
                        {!done ? (
                            <motion.p
                                key={step}
                                aria-live="polite"
                                className="bd-serif bd-glow text-balance text-[clamp(1.7rem,min(5.2vw,5.8dvh),2.8rem)] font-medium italic leading-[1.25]"
                                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                    transition: {
                                        duration: fadeIn,
                                        delay: step === 0 ? sec(FIRST_BREATH_MS) : 0,
                                        ease: EASE_OUT,
                                    },
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -6,
                                    filter: "blur(10px)",
                                    transition: { duration: fadeOut, ease: EASE_IN_OUT },
                                }}
                            >
                                {lines[step].text}
                            </motion.p>
                        ) : (
                            <motion.div
                                key="final"
                                className="flex flex-col items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                <NotebookIllustration delay={0.4} />

                                <motion.p
                                    data-follow={0}
                                    className="bd-serif bd-glow mt-9 text-balance text-[clamp(1.55rem,min(4.8vw,5.2dvh),2.4rem)] font-medium leading-[1.25]"
                                    {...settle(3)}
                                >
                                    {finale.instruction}
                                </motion.p>

                                <motion.span
                                    aria-hidden
                                    className="my-8 block h-px w-12"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--bd-light) 70%, transparent), transparent)",
                                    }}
                                    initial={{ scaleX: 0, opacity: 0 }}
                                    animate={{ scaleX: 1, opacity: 1 }}
                                    transition={{ duration: 1.4, delay: 4.6, ease: EASE_OUT }}
                                />

                                {hasTitle && (
                                    <motion.h2
                                        data-follow={1}
                                        className="bd-serif bd-glow-warm mb-3 text-[clamp(1.6rem,min(4.8vw,5.4dvh),2.5rem)] font-light italic leading-[1.2]"
                                        {...settle(5.4, 2)}
                                    >
                                        {finale.closingTitle}
                                    </motion.h2>
                                )}
                                <motion.p
                                    data-follow={2}
                                    className={
                                        hasTitle
                                            ? "bd-serif text-balance text-[clamp(1.05rem,min(2.6vw,3dvh),1.3rem)] font-medium text-[var(--bd-ink-muted)]"
                                            : "bd-serif bd-glow-warm text-balance text-[clamp(1.35rem,min(4vw,4.4dvh),1.9rem)] italic leading-[1.3]"
                                    }
                                    {...settle(blessingAt, 2)}
                                >
                                    {finale.blessing}
                                </motion.p>

                                {credit && (
                                    <motion.a
                                        data-follow={3}
                                        href={credit.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={onCreditClick}
                                        aria-label={`${credit.label}, open on YouTube`}
                                        className="bd-label mt-10 inline-flex min-h-11 items-center gap-2 normal-case tracking-[0.16em] underline-offset-4 transition-colors duration-300 hover:text-[var(--bd-ink-muted)] hover:underline"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 1.6, delay: creditAt }}
                                    >
                                        <span aria-hidden>♪</span>
                                        {credit.label}
                                        <svg
                                            aria-hidden
                                            viewBox="0 0 12 12"
                                            className="h-2.5 w-2.5"
                                        >
                                            <path
                                                d="M4 2h6v6M10 2 3 9"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </motion.a>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div aria-hidden className="bd-bottom-fade" />
            <AnimatePresence>
                {showReplay && (
                    <motion.button
                        type="button"
                        onClick={onReplay}
                        className="bd-link absolute bottom-[calc(env(safe-area-inset-bottom,0px)+18px)] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                    >
                        <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3">
                            <path
                                d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="bd-label">{finale.replayLabel}</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.section>
    )
}
