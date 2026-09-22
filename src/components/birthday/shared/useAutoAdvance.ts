"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useDocumentVisible } from "./useDocumentVisible"

type AutoAdvance = {
    canContinue: boolean // true once the section has fully revealed
    advance: () => void // move on now (safe to call more than once)
}

/**
 * Purpose:
 *   Pacing for the calm sections (verse, wishes). Shows a continue control
 *   once everything has appeared, then moves on by itself after a hold so
 *   the experience never stalls, unless holdMs is null.
 *
 * Args:
 *   - revealMs  : time until the section's content has fully appeared.
 *   - holdMs    : extra time before continuing automatically, or null.
 *   - onAdvance : called exactly once when the section should end.
 *
 * Returns:
 *   { canContinue, advance }.
 */
export function useAutoAdvance(
    revealMs: number,
    holdMs: number | null,
    onAdvance: () => void
): AutoAdvance {
    const [canContinue, setCanContinue] = useState(false)
    const doneRef = useRef(false)
    const callbackRef = useRef(onAdvance)
    const pageVisible = useDocumentVisible()

    useEffect(() => {
        callbackRef.current = onAdvance
    }, [onAdvance])

    const advance = useCallback(() => {
        if (doneRef.current) return
        doneRef.current = true
        callbackRef.current()
    }, [])

    // Restarts from the top when she comes back, so nothing moves on unseen.
    useEffect(() => {
        if (!pageVisible) return
        const revealTimer = window.setTimeout(() => setCanContinue(true), revealMs)
        const holdTimer =
            holdMs === null ? 0 : window.setTimeout(advance, revealMs + Math.max(0, holdMs))
        return () => {
            window.clearTimeout(revealTimer)
            window.clearTimeout(holdTimer)
        }
    }, [revealMs, holdMs, advance, pageVisible])

    return { canContinue, advance }
}
