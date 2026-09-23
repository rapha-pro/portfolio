import type { VerseConfig } from "../types"

/**
 * The verse and the prayer that follows it. Each entry in `lines` fades in
 * on its own, so split the verse where a pause feels natural.
 * Placeholder: Numbers 6:24-26 (KJV).
 */
export const VERSE: VerseConfig = {
    kicker: "A blessing",
    lines: [
        "Que l'Éternel te bénisse, et qu'il te garde!",
        "Que l'Éternel fasse luire sa face sur toi, et qu'il t'accorde sa grâce!",
        "Que l'Éternel tourne sa face vers toi, et qu'il te donne la paix!",
    ],
    reference: "Numbers 6:24-26",
    prayerIntro: "My prayer for you this year:",
    prayer: "May God continue to guide your steps, protect you, strengthen you, and lead you exactly where He wants you to be.",
    closing: "We are Hebrews 11.40",
}
