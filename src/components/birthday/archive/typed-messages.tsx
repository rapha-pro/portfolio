"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { BirthdayTiming, MessageTone, TypedMessage } from "@/lib/data/birthday/types"
import { EASE_IN_OUT, EASE_OUT, sec } from "../shared/motion"
import { useDocumentVisible } from "../shared/useDocumentVisible"
import { useMediaQuery } from "../shared/useMediaQuery"

type Stage = "entering" | "typing" | "holding" | "done"

type TypedMessagesProps = {
    messages: TypedMessage[]
    timing: BirthdayTiming["messages"]
    reduceMotion: boolean
    skipHint: string
    paused: boolean // hold everything (a photo is enlarged)
    onMessageStart: (index: number) => void // a message begins to appear
    onComplete: () => void // the last message has been read
}

/** Characters that keep their "ink" fade while the next ones are typed. */
const INK_TRAIL = 5

/**
 * Purpose:
 *   The heart of the page: messages typed one paragraph at a time. Each
 *   paragraph fades in, types with a human rhythm (longer pauses after
 *   punctuation), rests, fades out, and hands over to the next. The full
 *   text is laid out from the start in transparent ink, so centered lines
 *   never jump while typing. Tap or press space to finish a line or skip
 *   a pause. With reduced motion, paragraphs simply fade in whole.
 *
 * Args:
 *   - messages      : paragraphs and per paragraph overrides.
 *   - timing        : default speeds and pauses.
 *   - reduceMotion  : show whole paragraphs instead of typing.
 *   - skipHint       : screen reader hint about skipping.
 *   - paused         : freezes the clock (a photo is enlarged).
 *   - onMessageStart : called with each message index as it appears.
 *   - onComplete     : called once, after the last paragraph's pause.
 *
 * Returns:
 *   The message block.
 */
export function TypedMessages({
    messages,
    timing,
    reduceMotion,
    skipHint,
    paused,
    onMessageStart,
    onComplete,
}: TypedMessagesProps) {
    const [index, setIndex] = useState(0)
    const [count, setCount] = useState(0)
    const [stage, setStage] = useState<Stage>("entering")
    const completeRef = useRef(onComplete)
    const startRef = useRef(onMessageStart)
    const pageVisible = useDocumentVisible()
    // Smaller screen, smaller bites: give her more time to take each line in.
    const onPhone = useMediaQuery("(max-width: 640px)")
    const pace = onPhone ? Math.max(1, timing.phoneScale) : 1

    useEffect(() => {
        completeRef.current = onComplete
        startRef.current = onMessageStart
    }, [onComplete, onMessageStart])

    useEffect(() => {
        startRef.current(index)
    }, [index])

    const message = messages[index]
    const lines = useMemo(
        () => (message ? (Array.isArray(message.text) ? message.text : [message.text]) : []),
        [message]
    )
    const starts = useMemo(() => lineStarts(lines), [lines])
    const joined = lines.join("")
    const total = joined.length

    const fadeIn = message?.fadeInMs ?? timing.fadeInMs
    const fadeOut = message?.fadeOutMs ?? timing.fadeOutMs
    const speed = (message?.typeSpeedMs ?? timing.typeSpeedMs) * pace
    const pauseAfter = (message?.pauseAfterMs ?? timing.pauseAfterMs) * pace
    const previousFadeOut = index > 0 ? (messages[index - 1].fadeOutMs ?? timing.fadeOutMs) : 0
    const shown = reduceMotion ? total : Math.min(count, total)

    const advance = useCallback(() => {
        if (index >= messages.length - 1) {
            setStage("done")
            completeRef.current()
            return
        }
        setIndex((i) => i + 1)
        setCount(0)
        setStage("entering")
    }, [index, messages.length])

    // The typing clock. Paused while the page is hidden or a photo is open.
    useEffect(() => {
        if (!message || !pageVisible || paused) return
        let timer = 0
        if (stage === "entering") {
            timer = window.setTimeout(() => setStage("typing"), previousFadeOut + fadeIn * 0.7)
        } else if (stage === "typing") {
            if (shown >= total) {
                timer = window.setTimeout(() => setStage("holding"), 0)
            } else {
                timer = window.setTimeout(
                    () => setCount((c) => c + 1),
                    charDelay(joined, starts, shown, speed, timing.lineGapMs)
                )
            }
        } else if (stage === "holding") {
            // Without typing there is no reading time built in, so add some.
            const reading = reduceMotion ? total * 45 : 0
            timer = window.setTimeout(advance, pauseAfter + reading)
        }
        return () => window.clearTimeout(timer)
    }, [
        message,
        pageVisible,
        paused,
        stage,
        shown,
        total,
        joined,
        starts,
        speed,
        fadeIn,
        previousFadeOut,
        pauseAfter,
        reduceMotion,
        advance,
        timing.lineGapMs,
    ])

    const skip = useCallback(() => {
        if (stage === "entering" || stage === "typing") {
            setCount(total)
            setStage("typing")
        } else if (stage === "holding") {
            advance()
        }
    }, [stage, total, advance])

    const skipRef = useRef(skip)
    useEffect(() => {
        skipRef.current = skip
    }, [skip])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== " " && e.key !== "Enter" && e.key !== "ArrowRight") return
            const tag = (e.target as HTMLElement | null)?.tagName
            if (tag === "BUTTON" || tag === "INPUT" || tag === "A") return
            e.preventDefault()
            skipRef.current()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    let currentLine = lines.length - 1
    for (let i = 0; i < lines.length; i++) {
        if (shown < starts[i] + lines[i].length) {
            currentLine = i
            break
        }
    }
    const typing = !reduceMotion && (stage === "entering" || stage === "typing") && shown < total

    return (
        <div className="relative flex w-full max-w-[min(92vw,42rem)] flex-col items-center text-center">
            <p className="sr-only">{skipHint}</p>
            <p className="sr-only" aria-live="polite">
                {message ? lines.join(" ") : ""}
            </p>

            <div className="w-full cursor-default" onClick={skip}>
                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center gap-[0.28em]"
                            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                                transition: { duration: sec(fadeIn), ease: EASE_OUT },
                            }}
                            exit={{
                                opacity: 0,
                                y: -8,
                                filter: "blur(8px)",
                                transition: { duration: sec(fadeOut), ease: EASE_IN_OUT },
                            }}
                        >
                            {lines.map((line, i) => (
                                <TypedLine
                                    key={i}
                                    text={line}
                                    visible={Math.max(0, Math.min(line.length, shown - starts[i]))}
                                    caret={typing && i === currentLine}
                                    tone={message.tone ?? "normal"}
                                    animateInk={!reduceMotion}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

type TypedLineProps = {
    text: string
    visible: number
    caret: boolean
    tone: MessageTone
    animateInk: boolean
}

/** One line: settled text, a few freshly inked characters, the caret, and the invisible rest. */
function TypedLine({ text, visible, caret, tone, animateInk }: TypedLineProps) {
    const settled = animateInk ? Math.max(0, visible - INK_TRAIL) : visible
    const recent = text.slice(settled, visible)

    return (
        <p
            aria-hidden
            data-tone={tone}
            className={`bd-serif bd-message ${tone === "emphasis" ? "bd-glow-warm" : "bd-glow"}`}
        >
            {text.slice(0, settled)}
            {recent.split("").map((ch, k) => (
                <span key={settled + k} className="bd-ink">
                    {ch}
                </span>
            ))}
            {caret && <span className="bd-caret" />}
            <span className="bd-ghost">{text.slice(visible)}</span>
        </p>
    )
}

/** Index where each line begins once all lines are joined. */
function lineStarts(lines: string[]): number[] {
    const starts: number[] = []
    let offset = 0
    for (const line of lines) {
        starts.push(offset)
        offset += line.length
    }
    return starts
}

/**
 * Purpose:
 *   Delay before the next character, with a little human irregularity and
 *   longer breaths after punctuation and between lines.
 *
 * Args:
 *   - text      : all lines of the paragraph joined.
 *   - lineStarts: index where each line begins in `text`.
 *   - i         : index of the character about to appear.
 *   - base      : average delay per character.
 *   - lineGap   : pause before a new line starts.
 *
 * Returns:
 *   Milliseconds to wait.
 */
function charDelay(
    text: string,
    lineStarts: number[],
    i: number,
    base: number,
    lineGap: number
): number {
    if (i > 0 && lineStarts.includes(i)) return lineGap
    const prev = text[i - 1]
    let delay = base * (0.6 + Math.random() * 0.8)
    if (prev === "." || prev === "!" || prev === "?" || prev === "…") delay += base * 6
    else if (prev === "," || prev === ";" || prev === ":") delay += base * 3
    return delay
}
