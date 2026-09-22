"use client"

import { useEffect, type RefObject } from "react"
import { useDocumentVisible } from "./useDocumentVisible"

/**
 * Purpose:
 *   On small screens a chapter can be taller than the phone. As each line
 *   appears, gently scroll just enough to bring it above the bottom
 *   controls, like credits drifting up, so nothing is revealed off screen.
 *   Does nothing when everything already fits.
 *
 *   Mark the revealed elements with data-follow="0", data-follow="1"...
 *   in the same order as `delaysSec`.
 *
 * Args:
 *   - containerRef : the scrolling element.
 *   - delaysSec    : when each marked element starts to appear, in seconds.
 *
 * Returns:
 *   Nothing.
 */
export function useFollowReveal(
    containerRef: RefObject<HTMLElement | null>,
    delaysSec: number[]
): void {
    const pageVisible = useDocumentVisible()
    const key = delaysSec.join(",")

    useEffect(() => {
        if (!pageVisible || !key) return
        const timers = key.split(",").map((delay, i) =>
            window.setTimeout(
                () => {
                    const box = containerRef.current
                    const el = box?.querySelector(`[data-follow="${i}"]`)
                    if (!box || !el) return
                    const padding = parseFloat(getComputedStyle(box).paddingBottom) || 0
                    const overflow =
                        el.getBoundingClientRect().bottom -
                        (box.getBoundingClientRect().bottom - padding)
                    if (overflow > 0) box.scrollBy({ top: overflow + 8, behavior: "smooth" })
                },
                Number(delay) * 1000 + 150
            )
        )
        return () => timers.forEach((t) => window.clearTimeout(t))
    }, [containerRef, key, pageVisible])
}
