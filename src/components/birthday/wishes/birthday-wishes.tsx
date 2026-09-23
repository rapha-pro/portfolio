"use client"

import { useEffect, useRef } from "react"
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion"
import type { BirthdayTiming, TitleLine, WishesConfig } from "@/lib/data/birthday/types"
import { ContinueButton } from "../shared/continue-button"
import { EASE_OUT } from "../shared/motion"
import { useAutoAdvance } from "../shared/useAutoAdvance"
import { useFollowReveal } from "../shared/useFollowReveal"
import { Balloons } from "./balloons"
import { Confetti } from "./confetti"
import { SunNumber } from "./sun-number"

type BirthdayWishesProps = {
    wishes: WishesConfig
    festive: string[] // balloon and confetti colors
    timing: BirthdayTiming["wishes"]
    continueLabel: string
    onComplete: () => void
}

const TITLE_START = 1.3
const CHAR_STAGGER = 0.05
const SCRIPT_REVEAL = 2.2 // seconds for a calligraphy line to be written

/**
 * Purpose:
 *   The birthday chapter. The room warms (handled by the light rig),
 *   "Happy Birthday" is written across one line in calligraphy and her
 *   name condenses letter by letter out of a blur. Then her number lights
 *   up like a little sun, balloons rise and confetti falls, and the
 *   blessing paragraphs follow.
 *
 * Args:
 *   - wishes        : kicker, title lines, celebration and paragraphs.
 *   - festive       : palette for balloons and confetti.
 *   - timing        : hold before continuing automatically.
 *   - continueLabel : text of the continue control.
 *   - onComplete    : moves on to the final reveal.
 *
 * Returns:
 *   The birthday section.
 */
export function BirthdayWishes({
    wishes,
    festive,
    timing,
    continueLabel,
    onComplete,
}: BirthdayWishesProps) {
    const reduceMotion = useReducedMotion() ?? false
    const titleText = wishes.title.map((line) => line.text).join(" ")
    const { items, end: titleEnd } = layoutTitle(wishes.title)
    const celebration = wishes.celebration
    const showNumber = Boolean(celebration?.number)
    const paragraphsStart = celebration ? titleEnd + 2.8 : titleEnd + 0.2
    const paragraphDelay = (i: number) => paragraphsStart + i * 1.7
    const { canContinue, advance } = useAutoAdvance(
        (paragraphDelay(Math.max(0, wishes.paragraphs.length - 1)) + 2.2) * 1000,
        timing.holdMs,
        onComplete
    )

    const scrollRef = useRef<HTMLDivElement>(null)
    useFollowReveal(scrollRef, [titleEnd, ...wishes.paragraphs.map((_, i) => paragraphDelay(i))])

    return (
        <motion.section
            aria-label={titleText}
            className="absolute inset-0 z-10 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            transition={{ duration: 1.5 }}
        >
            {celebration && celebration.balloons > 0 && (
                <Balloons count={celebration.balloons} colors={festive} delay={titleEnd + 0.4} />
            )}

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

                    <h1 aria-label={titleText} className="bd-glow-warm">
                        {items.map((line, li) =>
                            line.font === "script" ? (
                                <ScriptLine
                                    key={li}
                                    text={line.text}
                                    delay={line.delay}
                                    reduceMotion={reduceMotion}
                                />
                            ) : (
                                <span
                                    key={li}
                                    aria-hidden
                                    className="bd-serif block text-[clamp(2.7rem,min(11.5vw,10dvh),5.8rem)] font-light leading-[1.05] tracking-[-0.005em]"
                                >
                                    {line.words.map(({ word, start }, wi) => (
                                        <span key={wi} className="inline-block whitespace-nowrap">
                                            {word.split("").map((ch, ci) => {
                                                const delay =
                                                    line.delay + (start + ci) * CHAR_STAGGER
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
                                            {wi < line.words.length - 1 && " "}
                                        </span>
                                    ))}
                                </span>
                            )
                        )}
                    </h1>

                    {showNumber && celebration && (
                        <div data-follow={0}>
                            <SunNumber
                                value={celebration.number}
                                rays={celebration.rays}
                                delay={titleEnd}
                            />
                        </div>
                    )}

                    <div className={`${showNumber ? "mt-2" : "mt-10"} flex flex-col gap-5`}>
                        {wishes.paragraphs.map((paragraph, i) => (
                            <motion.p
                                key={i}
                                data-follow={i + 1}
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

            {celebration && celebration.confetti > 0 && (
                <Confetti count={celebration.confetti} colors={festive} delay={titleEnd} />
            )}
            <div aria-hidden className="bd-bottom-fade" />
            <ContinueButton visible={canContinue} label={continueLabel} onClick={advance} />
        </motion.section>
    )
}

type ScriptLineProps = {
    text: string
    delay: number
    reduceMotion: boolean
}

/** A calligraphy line, written from left to right as if by hand. */
function ScriptLine({ text, delay, reduceMotion }: ScriptLineProps) {
    const progress = useMotionValue(reduceMotion ? 100 : 0)

    useEffect(() => {
        if (reduceMotion) {
            progress.set(100)
            return
        }
        const controls = animate(progress, 100, {
            duration: SCRIPT_REVEAL,
            delay,
            ease: [0.4, 0, 0.2, 1],
        })
        return () => controls.stop()
    }, [delay, reduceMotion, progress])

    const mask = useMotionTemplate`linear-gradient(90deg, #000 ${progress}%, rgba(0,0,0,0.4) calc(${progress}% + 4%), transparent calc(${progress}% + 13%))`

    return (
        <motion.span
            aria-hidden
            className="bd-script block whitespace-nowrap text-[clamp(2.4rem,min(12.5vw,8.5dvh),5.2rem)] leading-[1.25]"
            style={{ maskImage: mask, WebkitMaskImage: mask }}
        >
            {text}
        </motion.span>
    )
}

type LaidLine =
    | { font: "script"; text: string; delay: number }
    | { font: "serif"; text: string; delay: number; words: { word: string; start: number }[] }

/**
 * Purpose:
 *   Works out when each title line starts, so the calligraphy is written
 *   first and the name follows, and reports when the whole title is done.
 *
 * Args:
 *   - lines : the configured title lines.
 *
 * Returns:
 *   The lines with their delays, plus `end` in seconds.
 */
function layoutTitle(lines: TitleLine[]): { items: LaidLine[]; end: number } {
    let at = TITLE_START
    const items = lines.map((line): LaidLine => {
        if ((line.font ?? "serif") === "script") {
            const item: LaidLine = { font: "script", text: line.text, delay: at }
            at += SCRIPT_REVEAL * 0.8
            return item
        }
        let offset = 0
        const words = line.text.split(" ").map((word) => {
            const start = offset
            offset += word.length
            return { word, start }
        })
        const item: LaidLine = { font: "serif", text: line.text, delay: at, words }
        at += offset * CHAR_STAGGER + 1
        return item
    })
    return { items, end: at }
}
