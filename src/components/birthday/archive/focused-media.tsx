"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { EASE_IN_OUT } from "../shared/motion"
import { FOCUS_SIZES } from "../shared/preload"
import type { CardOpening } from "./photo-card"

export type FocusedCard = CardOpening & {
    target: { left: number; top: number; width: number; height: number } // enlarged frame
}

type FocusedMediaProps = {
    card: FocusedCard | null
    durationMs: number // how long it stays enlarged
    closeLabel: string
    onClose: () => void // start flying back
    onClosed: () => void // back in its place: show the original card again
}

/**
 * Purpose:
 *   Computes where a tapped card should settle: centered, at its natural
 *   proportions, as large as the screen comfortably allows.
 *
 * Args:
 *   - ratio : natural width / height of the photo or video.
 *
 * Returns:
 *   The enlarged frame in viewport pixels.
 */
export function focusTarget(ratio: number): FocusedCard["target"] {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const maxW = Math.min(vw * 0.9, 620)
    const maxH = vh * 0.7
    let width = maxW
    let height = width / ratio
    if (height > maxH) {
        height = maxH
        width = height * ratio
    }
    return { left: (vw - width) / 2, top: (vh - height) / 2 - vh * 0.015, width, height }
}

/**
 * Purpose:
 *   The lifted card. It flies from its place in the stream to the center,
 *   grows to its natural proportions, stays for `durationMs` (a thin line
 *   counts down underneath), then flies back into its slot. A tap or
 *   Escape sends it back early. Photos show the card's already loaded
 *   image instantly and sharpen when the larger file arrives; videos keep
 *   playing from where the card was.
 *
 * Args:
 *   - card       : the opened card and its target frame, or null.
 *   - durationMs : display time.
 *   - closeLabel : accessible label for dismissing it.
 *   - onClose    : request to fly back.
 *   - onClosed   : the return animation has finished.
 *
 * Returns:
 *   The overlay, above the room.
 */
export function FocusedMedia({
    card,
    durationMs,
    closeLabel,
    onClose,
    onClosed,
}: FocusedMediaProps) {
    return (
        <AnimatePresence onExitComplete={onClosed}>
            {card && (
                <FocusView
                    key={card.index}
                    card={card}
                    durationMs={durationMs}
                    closeLabel={closeLabel}
                    onClose={onClose}
                />
            )}
        </AnimatePresence>
    )
}

type FocusViewProps = {
    card: FocusedCard
    durationMs: number
    closeLabel: string
    onClose: () => void
}

function FocusView({ card, durationMs, closeLabel, onClose }: FocusViewProps) {
    const { rect, target, media } = card
    const [sharp, setSharp] = useState(false)
    const closeRef = useRef(onClose)

    useEffect(() => {
        closeRef.current = onClose
    }, [onClose])

    useEffect(() => {
        const timer = window.setTimeout(() => closeRef.current(), durationMs)
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeRef.current()
        }
        window.addEventListener("keydown", onKey)
        return () => {
            window.clearTimeout(timer)
            window.removeEventListener("keydown", onKey)
        }
    }, [durationMs])

    const from = { ...rect, rotate: card.tilt }
    const to = { ...target, rotate: 0 }

    return (
        <motion.div
            className="absolute inset-0 z-30 cursor-zoom-out"
            role="dialog"
            aria-modal="true"
            aria-label={closeLabel}
            onClick={onClose}
        >
            <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{ background: "color-mix(in srgb, var(--bd-bg) 80%, transparent)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
            />

            <motion.div
                className="bd-focus-frame absolute overflow-hidden"
                initial={from}
                animate={to}
                exit={from}
                transition={{ duration: 0.8, ease: EASE_IN_OUT }}
            >
                {media.kind === "video" ? (
                    <video
                        ref={(el) => {
                            if (!el) return
                            el.muted = true
                            el.play().catch(() => undefined)
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                        src={media.src}
                        poster={media.poster}
                        muted
                        loop
                        playsInline
                        onLoadedMetadata={(e) => {
                            e.currentTarget.currentTime = card.time
                        }}
                    />
                ) : (
                    <>
                        {card.still && (
                            // The card's own, already decoded image: no flash while the big one loads.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={card.still}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        )}
                        <Image
                            src={media.src}
                            alt=""
                            fill
                            sizes={FOCUS_SIZES}
                            onLoad={() => setSharp(true)}
                            className="object-cover transition-opacity duration-700"
                            style={{ opacity: sharp ? 1 : 0 }}
                        />
                    </>
                )}
                <span aria-hidden className="bd-card-sheen" />
            </motion.div>

            <motion.span
                aria-hidden
                className="absolute block h-px"
                style={{
                    left: target.left,
                    top: target.top + target.height + 16,
                    width: target.width,
                    originX: 0,
                    background:
                        "linear-gradient(90deg, color-mix(in srgb, var(--bd-light) 80%, transparent), color-mix(in srgb, var(--bd-light) 25%, transparent))",
                }}
                initial={{ scaleX: 1, opacity: 0 }}
                animate={{ scaleX: 0, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{
                    scaleX: { duration: durationMs / 1000, ease: "linear" },
                    opacity: { duration: 0.6, delay: 0.5 },
                }}
            />
        </motion.div>
    )
}
