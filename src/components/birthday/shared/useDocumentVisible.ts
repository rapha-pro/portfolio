"use client"

import { useSyncExternalStore } from "react"

function subscribe(onChange: () => void): () => void {
    document.addEventListener("visibilitychange", onChange)
    return () => document.removeEventListener("visibilitychange", onChange)
}

/**
 * Purpose:
 *   Tracks whether the page is visible. The story's clocks pause while it
 *   is hidden (she switched apps, locked the phone) because animations
 *   freeze in the background while timers keep running, which would let
 *   the text race ahead of what is on screen.
 *
 * Returns:
 *   true while the document is visible (always true on the server).
 */
export function useDocumentVisible(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => document.visibilityState !== "hidden",
        () => true
    )
}
