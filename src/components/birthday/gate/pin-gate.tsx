"use client"

import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { AnimatePresence, motion, useAnimationControls } from "framer-motion"
import type { BirthdayTiming, GateConfig } from "@/lib/data/birthday/types"
import { EASE_OUT, sec } from "../shared/motion"

type PinState = "idle" | "wrong" | "success"

type PinGateProps = {
    gate: GateConfig
    timing: BirthdayTiming["gate"]
    onUnlock: (origin: { x: number; y: number }) => void // fired after the success animation
}

/**
 * Purpose:
 *   The entrance: a nearly black screen, her name, and a code. One hidden
 *   numeric input drives the visible boxes, which keeps paste, backspace,
 *   screen readers and the phone number pad working naturally. A wrong
 *   code shakes softly and may reveal hints; the right one glows, folds
 *   into a single point of light, and hands that point to the tunnel.
 *
 * Args:
 *   - gate      : copy, code and hints.
 *   - timing    : intro delay and success hold.
 *   - onUnlock  : called with the point of light's screen position.
 *
 * Returns:
 *   The gate section.
 */
export function PinGate({ gate, timing, onUnlock }: PinGateProps) {
    const length = gate.pin.length
    const introDelay = sec(timing.introDelayMs)

    const inputRef = useRef<HTMLInputElement>(null)
    const rowRef = useRef<HTMLDivElement>(null)
    const boxRefs = useRef<(HTMLDivElement | null)[]>([])
    const timers = useRef<number[]>([])
    const shake = useAnimationControls()

    const [value, setValue] = useState("")
    const [attempts, setAttempts] = useState(0)
    const [state, setState] = useState<PinState>("idle")
    const [focused, setFocused] = useState(false)
    const [converge, setConverge] = useState<number[] | null>(null)
    const [spark, setSpark] = useState<{ x: number; y: number } | null>(null)

    useEffect(() => {
        const pending = timers.current
        return () => pending.forEach((t) => window.clearTimeout(t))
    }, [])

    // Desktop only: focus the code once the boxes have appeared. On phones
    // the keyboard should open when she taps, not by surprise.
    useEffect(() => {
        if (!window.matchMedia("(pointer: fine)").matches) return
        const t = window.setTimeout(
            () => inputRef.current?.focus({ preventScroll: true }),
            timing.introDelayMs + 2800
        )
        return () => window.clearTimeout(t)
    }, [timing.introDelayMs])

    const later = (fn: () => void, ms: number) => {
        timers.current.push(window.setTimeout(fn, ms))
    }

    const succeed = () => {
        setState("success")
        inputRef.current?.blur()

        const row = rowRef.current?.getBoundingClientRect()
        const cx = row ? row.left + row.width / 2 : window.innerWidth / 2
        const cy = row ? row.top + row.height / 2 : window.innerHeight / 2
        const offsets = boxRefs.current.map((box) => {
            const r = box?.getBoundingClientRect()
            return r ? cx - (r.left + r.width / 2) : 0
        })

        later(() => setConverge(offsets), 520)
        later(() => setSpark({ x: cx, y: cy }), 820)
        later(() => onUnlock({ x: cx, y: cy }), timing.successHoldMs)
    }

    const fail = () => {
        setAttempts((n) => n + 1)
        setState("wrong")
        void shake.start({
            x: [0, -12, 10, -7, 5, -2, 0],
            transition: { duration: 0.55, ease: "easeInOut" },
        })
        later(() => {
            setValue("")
            setState("idle")
        }, 760)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (state !== "idle") return
        const digits = e.target.value.replace(/\D/g, "").slice(0, length)
        setValue(digits)
        if (digits.length < length) return
        if (digits === gate.pin) succeed()
        else fail()
    }

    const message =
        attempts > 0 && gate.wrongMessages.length > 0
            ? gate.wrongMessages[(attempts - 1) % gate.wrongMessages.length]
            : null
    const hint =
        gate.hints
            .filter((h) => attempts >= h.afterAttempts)
            .sort((a, b) => b.afterAttempts - a.afterAttempts)[0]?.text ?? null
    const activeIndex = Math.min(value.length, length - 1)
    const leaving = state === "success"

    return (
        <motion.section
            aria-labelledby="bd-gate-title"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-[6dvh] text-center"
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
        >
            {gate.cornerLabel && (
                <motion.p
                    className="bd-label absolute right-4 top-[max(18px,env(safe-area-inset-top))] normal-case tracking-[0.2em] sm:right-8 sm:top-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: leaving ? 0 : 1 }}
                    transition={{
                        duration: leaving ? 0.6 : 2,
                        delay: leaving ? 0 : introDelay + 0.6,
                    }}
                >
                    {gate.cornerLabel}
                </motion.p>
            )}

            <motion.div
                animate={leaving ? { opacity: 0, y: -16, filter: "blur(10px)" } : undefined}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT }}
            >
                <motion.h1
                    id="bd-gate-title"
                    className="bd-serif bd-glow text-[clamp(2.7rem,10vw,4.6rem)] font-light leading-none tracking-[0.005em]"
                    initial={{ opacity: 0, y: 10, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 2, delay: introDelay, ease: EASE_OUT }}
                >
                    {gate.title}
                </motion.h1>
                <motion.p
                    className="bd-serif mt-4 text-[clamp(1.2rem,4.4vw,1.5rem)] italic tracking-[0.01em] text-[var(--bd-ink-muted)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.8, delay: introDelay + 1.2 }}
                >
                    {gate.subtitle}
                </motion.p>
            </motion.div>

            <motion.div
                className="mt-14"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: introDelay + 2.2, ease: EASE_OUT }}
            >
                <motion.div ref={rowRef} animate={shake} className="relative flex gap-3 sm:gap-4">
                    {Array.from({ length }, (_, i) => {
                        const char = value[i]
                        const active = focused && !leaving && i === activeIndex && !char
                        return (
                            <motion.div
                                key={i}
                                ref={(el) => {
                                    boxRefs.current[i] = el
                                }}
                                className="bd-pin-box"
                                data-active={focused && !leaving && i === activeIndex}
                                data-state={state}
                                animate={
                                    converge
                                        ? { x: converge[i], scale: 0.2, opacity: 0 }
                                        : { x: 0, scale: 1, opacity: 1 }
                                }
                                transition={
                                    converge
                                        ? { duration: 0.55, ease: [0.7, 0, 0.84, 0] }
                                        : { duration: 0.3 }
                                }
                            >
                                <AnimatePresence>
                                    {char ? (
                                        <motion.span
                                            key="digit"
                                            className="bd-serif text-[1.95rem] font-medium leading-none"
                                            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                            transition={{ duration: 0.35, ease: EASE_OUT }}
                                        >
                                            {char}
                                        </motion.span>
                                    ) : active ? (
                                        <span className="bd-pin-caret" />
                                    ) : null}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}

                    <input
                        ref={inputRef}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        disabled={leaving}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        enterKeyHint="done"
                        maxLength={length}
                        aria-label={gate.inputLabel}
                        aria-describedby="bd-pin-status"
                        aria-invalid={state === "wrong"}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        style={{ fontSize: 16, caretColor: "transparent" }}
                    />
                </motion.div>
            </motion.div>

            <motion.div
                id="bd-pin-status"
                aria-live="polite"
                className="mt-8 flex min-h-20 flex-col items-center"
                animate={{ opacity: leaving ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            >
                <AnimatePresence mode="wait">
                    {message && (
                        <motion.p
                            key={attempts}
                            className="bd-serif text-[1.3rem] italic text-[var(--bd-ink-muted)]"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.5, ease: EASE_OUT }}
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {hint && (
                        <motion.p
                            key={hint}
                            className="bd-label mt-3 max-w-[30ch] normal-case tracking-[0.12em]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                        >
                            {hint}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>

            {spark && (
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute z-20 h-2 w-2 rounded-full"
                    style={{
                        left: spark.x,
                        top: spark.y,
                        x: "-50%",
                        y: "-50%",
                        background: "#fffaf0",
                        boxShadow:
                            "0 0 18px 6px color-mix(in srgb, var(--bd-light) 70%, transparent), 0 0 70px 24px color-mix(in srgb, var(--bd-light) 26%, transparent)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.7, 1], opacity: 1 }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                />
            )}
        </motion.section>
    )
}
