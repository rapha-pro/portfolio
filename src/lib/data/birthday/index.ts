import type { BirthdayConfig } from "./types"
import { DULCINEE } from "./dulcinee"

/**
 * Every birthday page on the site. Each entry is served at
 * raphaelonana.dev/<profile.slug>; any other slug is a 404.
 *
 * To add someone: copy the dulcinee/ folder, edit it, and add it here.
 */
export const BIRTHDAYS: readonly BirthdayConfig[] = [DULCINEE]

/**
 * Purpose:
 *   Finds the birthday config served at a given URL segment.
 *
 * Args:
 *   - slug : the URL segment, e.g. "mystery".
 *
 * Returns:
 *   The matching config, or undefined when no page uses that slug.
 */
export function getBirthday(slug: string): BirthdayConfig | undefined {
    return BIRTHDAYS.find((b) => b.profile.slug === slug)
}
