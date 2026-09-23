"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import type { BirthdayTiming, VerseConfig } from "@/lib/data/birthday/types"
import { ContinueButton } from "../shared/continue-button"
import { EASE_OUT, sec } from "../shared/motion"
import { useAutoAdvance } from "../shared/useAutoAdvance"
import { useFollowReveal } from "../shared/useFollowReveal"

type VerseSectionProps = {
    verse: VerseConfig
    timing: BirthdayTiming["verse"]
    continueLabel: string
    onComplete: () => void
}

/** Fade, lift and unblur: the one entrance every calm line shares. */
function reveal(delay: number, duration = 1.6) {
    return {
        initial: { opacity: 0, y: 8, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration, delay, ease: EASE_OUT },
    }
}

/**
 * Purpose:
 *   The quiet center of the story: the verse surfaces line by line under
 *   the dimmed bulb, then its reference, a thin line of light, and the
 *   personal prayer. Continues on a tap or by itself after a hold.
 *
 * Args:
 *   - verse         : lines, reference and prayer.
 *   - timing        : stagger and hold.
 *   - continueLabel : text of the continue control.
 *   - onComplete    : moves on to the birthday wishes.
 *
 * Returns:
 *   The verse section.
 */
export function VerseSection({ verse, timing, continueLabel, onComplete }: VerseSectionProps) {
    const stagger = sec(timing.lineStaggerMs)
    const lineDelay = (i: number) => 1.2 + i * stagger
    const referenceDelay = lineDelay(verse.lines.length) + 0.2
    const dividerDelay = referenceDelay + 1.3
    const introDelay = dividerDelay + 0.7
    const prayerDelay = introDelay + 1.5
    const closingDelay = prayerDelay + 2.2
    const lastDelay = verse.closing ? closingDelay : prayerDelay
    const scrollRef = useRef<HTMLDivElement>(null)
    useFollowReveal(scrollRef, [referenceDelay, prayerDelay, closingDelay])
    const { canContinue, advance } = useAutoAdvance(
        (lastDelay + 2.4) * 1000,
        timing.holdMs,
        onComplete
    )

    return (
        <motion.section
            aria-label={verse.reference}
            className="absolute inset-0 z-10 flex flex-col"
            exit={{ opacity: 0, filter: "blur(6px)", transition: { duration: 1.4 } }}
        >
            <div
                ref={scrollRef}
                className="bd-scroll flex min-h-0 flex-1 flex-col px-6"
                style={{
                    paddingTop: "calc(var(--bd-top) * 0.75)",
                    paddingBottom: "var(--bd-bottom)",
                }}
            >
                <div className="m-auto flex w-full max-w-[36rem] flex-col items-center text-center">
                    {verse.kicker && (
                        <motion.p className="bd-label mb-6" {...reveal(0.3, 1.4)}>
                            {verse.kicker}
                        </motion.p>
                    )}

                    <blockquote className="bd-serif bd-glow text-[clamp(1.4rem,min(3.9vw,4.4dvh),2.15rem)] font-normal italic leading-[1.42]">
                        {verse.lines.map((line, i) => (
                            <motion.span
                                key={i}
                                className="block text-balance"
                                {...reveal(lineDelay(i), 1.9)}
                            >
                                {line}
                            </motion.span>
                        ))}
                    </blockquote>

                    <motion.p
                        data-follow={0}
                        className="bd-label mt-7 tracking-[0.34em] text-[var(--bd-ink-muted)]"
                        {...reveal(referenceDelay, 1.4)}
                    >
                        {verse.reference}
                    </motion.p>

                    <motion.span
                        aria-hidden
                        className="my-7 block h-px w-16 sm:my-9"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent, color-mix(in srgb, var(--bd-light) 75%, transparent), transparent)",
                        }}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 1.4, delay: dividerDelay, ease: EASE_OUT }}
                    />

                    <motion.p
                        className="text-[0.95rem] tracking-[0.02em] text-[var(--bd-ink-muted)]"
                        {...reveal(introDelay, 1.4)}
                    >
                        {verse.prayerIntro}
                    </motion.p>
                    <motion.p
                        data-follow={1}
                        className="bd-serif bd-glow mt-3 max-w-[32rem] text-pretty text-[clamp(1.2rem,min(3vw,3.4dvh),1.6rem)] font-medium leading-[1.45]"
                        {...reveal(prayerDelay, 2)}
                    >
                        {verse.prayer}
                    </motion.p>

                    {verse.closing && (
                        <motion.p
                            data-follow={2}
                            className="bd-serif bd-hl-yellow mt-7 text-balance text-[clamp(1.15rem,min(2.9vw,3.2dvh),1.5rem)] font-medium italic leading-[1.4]"
                            {...reveal(closingDelay, 1.8)}
                        >
                            {verse.closing}
                        </motion.p>
                    )}
                </div>
            </div>

            <div aria-hidden className="bd-bottom-fade" />
            <ContinueButton visible={canContinue} label={continueLabel} onClick={advance} />
        </motion.section>
    )
}
