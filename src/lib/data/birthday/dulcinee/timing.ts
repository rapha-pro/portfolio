import type { BirthdayTiming } from "../types"

/**
 * Pacing of the whole experience, in milliseconds unless noted.
 * Slower feels more cinematic; faster suits a second viewing.
 */
export const TIMING: BirthdayTiming = {
    gate: {
        introDelayMs: 600,
        successHoldMs: 1800,
        unlockedLineMs: 2200,
        unlockedHoldMs: 7200,
        briefingRevealMs: 2600,
    },
    tunnel: {
        durationMs: 4800,
        flashMs: 1800,
    },
    archive: {
        messagesDelayMs: 7000,
        photosFadeMs: 3000,
        photoSpeed: 30, // lower is slower
        photoSpeedMobile: 22,
        focusMs: 7000,
    },
    messages: {
        typeSpeedMs: 52,
        pauseAfterMs: 2400,
        fadeInMs: 1000,
        fadeOutMs: 900,
        lineGapMs: 750,
        phoneScale: 1.3,
    },
    verse: {
        lineStaggerMs: 1500,
        holdMs: 22000,
    },
    siblings: {
        holdMs: null, // their letters are long: she moves on when she is ready
    },
    wishes: {
        holdMs: 28000,
    },
    finale: {
        lineFadeMs: 1200,
        defaultHoldMs: 2000,
        replayAfterMs: 30000,
    },
    flicker: {
        enabled: true,
        minGapMs: 7000,
        maxGapMs: 16000,
    },
}
