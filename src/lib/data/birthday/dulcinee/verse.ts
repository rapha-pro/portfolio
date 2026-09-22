import type { VerseConfig } from "../types"

/**
 * The verse and the prayer that follows it. Each entry in `lines` fades in
 * on its own, so split the verse where a pause feels natural.
 * Placeholder: Numbers 6:24-26 (KJV).
 */
export const VERSE: VerseConfig = {
    kicker: "A blessing",
    lines: [
        "The Lord bless thee, and keep thee:",
        "The Lord make his face shine upon thee,",
        "and be gracious unto thee:",
        "The Lord lift up his countenance upon thee,",
        "and give thee peace.",
    ],
    reference: "Numbers 6:24-26",
    prayerIntro: "My prayer for you this year is simple:",
    prayer: "May God continue to guide your steps, protect you, strengthen you, and lead you exactly where He wants you to be.",
}
