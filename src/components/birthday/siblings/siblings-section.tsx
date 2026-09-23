"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { BirthdayTiming, SiblingEntry, SiblingsConfig } from "@/lib/data/birthday/types"
import { ContinueButton } from "../shared/continue-button"
import { EASE_OUT } from "../shared/motion"
import { useAutoAdvance } from "../shared/useAutoAdvance"
import { useFollowReveal } from "../shared/useFollowReveal"
import { PhotoFrame } from "./photo-frame"

type SiblingsSectionProps = {
    siblings: SiblingsConfig
    personName: string // for the photo descriptions
    timing: BirthdayTiming["siblings"]
    continueLabel: string
    onComplete: () => void
}

const FRAME_AT = 0.5
const NAME_AT = 1
const MESSAGE_AT = 1.7
const REVEAL_MS = (MESSAGE_AT + 2) * 1000

/** Fade, lift and unblur: the same entrance the calm chapters share. */
function reveal(delay: number, duration = 1.6) {
    return {
        initial: { opacity: 0, y: 8, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration, delay, ease: EASE_OUT },
    }
}

/**
 * Purpose:
 *   Her siblings' words, one at a time: the name on top, a framed photo of
 *   the two of them beside it, and the message underneath. Dots show how
 *   many are left. Each one continues on a tap, or by itself after a hold.
 *
 * Args:
 *   - siblings      : kicker and the list of siblings.
 *   - personName    : used in the photo descriptions.
 *   - timing        : hold per sibling.
 *   - continueLabel : text of the continue control.
 *   - onComplete    : the last sibling has been read.
 *
 * Returns:
 *   The family section.
 */
export function SiblingsSection({
    siblings,
    personName,
    timing,
    continueLabel,
    onComplete,
}: SiblingsSectionProps) {
    const [index, setIndex] = useState(0)
    const entries = siblings.entries
    const entry = entries[index]

    const next = useCallback(() => {
        if (index >= entries.length - 1) onComplete()
        else setIndex((i) => i + 1)
    }, [index, entries.length, onComplete])

    if (!entry) return null

    return (
        <motion.section
            aria-label={siblings.kicker ?? "Messages from her family"}
            className="absolute inset-0 z-10 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2 } }}
            transition={{ duration: 1.2 }}
        >
            <AnimatePresence mode="wait">
                <SiblingSlide
                    key={index}
                    entry={entry}
                    personName={personName}
                    kicker={siblings.kicker}
                    position={index}
                    total={entries.length}
                    holdMs={timing.holdMs}
                    continueLabel={continueLabel}
                    onNext={next}
                />
            </AnimatePresence>
        </motion.section>
    )
}

type SiblingSlideProps = {
    entry: SiblingEntry
    personName: string
    kicker: string | null
    position: number
    total: number
    holdMs: number | null
    continueLabel: string
    onNext: () => void
}

function SiblingSlide({
    entry,
    personName,
    kicker,
    position,
    total,
    holdMs,
    continueLabel,
    onNext,
}: SiblingSlideProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    useFollowReveal(scrollRef, [MESSAGE_AT])
    const { canContinue, advance } = useAutoAdvance(REVEAL_MS, holdMs, onNext)
    const tilt = position % 2 === 0 ? -1.6 : 1.6

    return (
        <motion.div
            className="flex min-h-0 flex-1 flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1 }}
        >
            <div
                ref={scrollRef}
                className="bd-scroll flex min-h-0 flex-1 flex-col px-6"
                style={{
                    paddingTop: "calc(var(--bd-top) * 0.8)",
                    paddingBottom: "var(--bd-bottom)",
                }}
            >
                <div className="m-auto flex w-full max-w-[46rem] flex-col items-center gap-7 text-center sm:flex-row sm:items-center sm:gap-12 sm:text-left">
                    <PhotoFrame
                        src={entry.photo}
                        alt={
                            entry.photo
                                ? `${entry.name} with ${personName}`
                                : `Frame waiting for a photo of ${entry.name} with ${personName}`
                        }
                        tilt={tilt}
                        delay={FRAME_AT}
                    />

                    <div className="flex flex-col items-center sm:items-start">
                        {kicker && (
                            <motion.p className="bd-label mb-3" {...reveal(0.3, 1.4)}>
                                {kicker}
                            </motion.p>
                        )}

                        <motion.h2
                            className="bd-serif bd-glow-warm text-[clamp(1.7rem,min(6.5vw,5.4dvh),2.6rem)] font-medium italic leading-[1.2]"
                            {...reveal(NAME_AT)}
                        >
                            {entry.name}
                        </motion.h2>

                        <motion.p
                            data-follow={0}
                            className="bd-serif mt-4 text-pretty text-[clamp(1.1rem,min(2.9vw,3.3dvh),1.5rem)] font-medium leading-[1.55] text-[var(--bd-ink-muted)]"
                            {...reveal(MESSAGE_AT, 1.9)}
                        >
                            {entry.message}
                        </motion.p>

                        {total > 1 && (
                            <motion.div
                                className="mt-7 flex items-center gap-2"
                                aria-label={`Message ${position + 1} of ${total}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1.2, delay: MESSAGE_AT + 0.6 }}
                            >
                                {Array.from({ length: total }, (_, i) => (
                                    <span
                                        key={i}
                                        aria-hidden
                                        className="block h-1.5 w-1.5 rounded-full"
                                        style={{
                                            background:
                                                i === position
                                                    ? "var(--bd-light)"
                                                    : "color-mix(in srgb, var(--bd-ink) 22%, transparent)",
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <div aria-hidden className="bd-bottom-fade" />
            <ContinueButton visible={canContinue} label={continueLabel} onClick={advance} />
        </motion.div>
    )
}
