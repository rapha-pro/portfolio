"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * Purpose:
 *   Tracks a CSS media query from React (false on the server).
 *
 * Args:
 *   - query : e.g. "(min-width: 640px)".
 *
 * Returns:
 *   Whether the query currently matches.
 */
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const list = window.matchMedia(query)
            list.addEventListener("change", onChange)
            return () => list.removeEventListener("change", onChange)
        },
        [query]
    )
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false
    )
}
