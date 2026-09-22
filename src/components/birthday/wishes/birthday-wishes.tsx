"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import type { BirthdayTiming, WishesConfig } from "@/lib/data/birthday/types"
import { ContinueButton } from "../shared/continue-button"
import { EASE_OUT } from "../shared/motion"
import { useAutoAdvance } from "../shared/useAutoAdvance"
import { useFollowReveal } from "../shared/useFollowReveal"
import { RisingEmbers } from "./rising-embers"

type BirthdayWishesProps = {
    wishes: WishesConfig
    timing: BirthdayTiming["wishes"]
    continueLabel: string
    onComplete: () => void
}

const TITLE_START = 1.3
const CHAR_STAGGER = 0.05

/**
 * Purpose:
 *   The birthday chapter. The room warms (handled by the light rig), a few
 *   embers rise, and "Happy Birthday" condenses letter by letter out of a
 *   blur, followed by the blessing paragraphs. Still the same dark room,
 *   only warmer.
 *
 * Args:
 *   - wishes        : kicker, title lines and paragraphs.
 *   - timing        : hold before continuing automatically.
 *   - continueLabel : text of the continue control.
 *   - onComplete    : moves on to the final reveal.
 *
 * Returns:
 *   The birthday section.
 */
export function BirthdayWishes({ wishes, timing, continueLabel, onComplete }: BirthdayWishesProps) {
    const titleText = wishes.title.join(" ")
    const titleChars = wishes.title.join("").length
    const paragraphsStart = TITLE_START + titleChars * CHAR_STAGGER + 1.2
    const paragraphDelay = (i: number) => paragraphsStart + i * 1.7
    const { canContinue, advance } = useAutoAdvance(
        (paragraphDelay(Math.max(0, wishes.paragraphs.length - 1)) + 2.2) * 1000,
        timing.holdMs,
        onComplete
    )

    const titleLines = layoutTitle(wishes.title)
    const scrollRef = useRef<HTMLDivElement>(null)
    useFollowReveal(
        scrollRef,
        wishes.paragraphs.map((_, i) => paragraphDelay(i))
    )

    return (
        <motion.section
            aria-label={titleText}
            className="absolute inset-0 z-10 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            transition={{ duration: 1.5 }}
        >
            <RisingEmbers />

            <div
                ref={scrollRef}
                className="bd-scroll relative flex min-h-0 flex-1 flex-col px-6"
                style={{
                    paddingTop: "calc(var(--bd-top) * 0.85)",
                    paddingBottom: "var(--bd-bottom)",
                }}
            >
                <div className="m-auto flex w-full max-w-[38rem] flex-col items-center text-center">
                    {wishes.kicker && (
                        <motion.p
                            className="bd-label mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.6, delay: 0.5 }}
                        >
                            {wishes.kicker}
                        </motion.p>
                    )}

                    <h1
                        aria-label={titleText}
                        className="bd-serif bd-glow-warm text-[clamp(2.8rem,min(10.5vw,11dvh),6.2rem)] font-light leading-[1.02] tracking-[-0.005em]"
                    >
                        {titleLines.map((words, li) => (
                            <span key={li} aria-hidden className="block">
                                {words.map(({ word, start }, wi) => (
                                    <span key={wi} className="inline-block whitespace-nowrap">
                                        {word.split("").map((ch, ci) => {
                                            const delay = TITLE_START + (start + ci) * CHAR_STAGGER
                                            return (
                                                <motion.span
                                                    key={delay}
                                                    className="inline-block"
                                                    initial={{
                                                        opacity: 0,
                                                        y: "0.3em",
                                                        filter: "blur(12px)",
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: "0em",
                                                        filter: "blur(0px)",
                                                    }}
                                                    transition={{
                                                        duration: 1.2,
                                                        delay,
                                                        ease: EASE_OUT,
                                                    }}
                                                >
                                                    {ch}
                                                </motion.span>
                                            )
                                        })}
                                        {wi < words.length - 1 && "\u00a0"}
                                    </span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <div className="mt-10 flex flex-col gap-5">
                        {wishes.paragraphs.map((paragraph, i) => (
                            <motion.p
                                key={i}
                                data-follow={i}
                                className="bd-serif text-pretty text-[clamp(1.15rem,min(2.9vw,3.3dvh),1.5rem)] font-medium leading-[1.55] text-[var(--bd-ink-muted)]"
                                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{
                                    duration: 1.8,
                                    delay: paragraphDelay(i),
                                    ease: EASE_OUT,
                                }}
                            >
                                {paragraph}
                            </motion.p>
                        ))}
                    </div>
                </div>
            </div>

            <div aria-hidden className="bd-bottom-fade" />
            <ContinueButton visible={canContinue} label={continueLabel} onClick={advance} />
        </motion.section>
    )
}

/** Splits the title into words, remembering each word's first character index for the stagger. */
function layoutTitle(lines: string[]): { word: string; start: number }[][] {
    let offset = 0
    return lines.map((line) =>
        line.split(" ").map((word) => {
            const start = offset
            offset += word.length
            return { word, start }
        })
    )
}
