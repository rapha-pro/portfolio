"use client"

import { useEffect } from "react"

/**
 * Purpose:
 *   Keeps the phone screen awake while the experience plays, so a long
 *   typed passage is not interrupted by auto lock. Re-acquires the lock
 *   when the tab becomes visible again. Silently does nothing where the
 *   Screen Wake Lock API is unavailable.
 *
 * Args:
 *   - active : request the lock while true, release it when false.
 *
 * Returns:
 *   Nothing.
 */
export function useWakeLock(active: boolean): void {
    useEffect(() => {
        if (!active || typeof navigator === "undefined" || !("wakeLock" in navigator)) return

        let sentinel: WakeLockSentinel | null = null
        let released = false

        const request = async () => {
            try {
                const next = await navigator.wakeLock.request("screen")
                if (released) {
                    void next.release()
                    return
                }
                sentinel = next
            } catch {
                // Denied (battery saver, no user activation yet). Harmless.
            }
        }

        const onVisibility = () => {
            if (document.visibilityState === "visible") void request()
        }

        void request()
        document.addEventListener("visibilitychange", onVisibility)

        return () => {
            released = true
            document.removeEventListener("visibilitychange", onVisibility)
            void sentinel?.release().catch(() => undefined)
        }
    }, [active])
}
