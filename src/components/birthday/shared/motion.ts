/** Shared easing curves so every phase moves with the same character. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const

/**
 * Purpose:
 *   Converts milliseconds from the timing config into the seconds Framer
 *   Motion expects.
 *
 * Args:
 *   - value : duration in milliseconds.
 *
 * Returns:
 *   The same duration in seconds.
 */
export function sec(value: number): number {
    return value / 1000
}
