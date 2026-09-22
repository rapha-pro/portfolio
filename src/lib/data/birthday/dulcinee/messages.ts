import type { TypedMessage } from "../types"

/**
 * The typed messages under the photos, shown one paragraph at a time.
 * These are placeholders: rewrite freely.
 *
 * - text as a string types one paragraph.
 * - text as an array types each line in turn and keeps them together.
 * - tone: "quiet" is smaller and softer, "emphasis" is italic and warmer.
 * - typeSpeedMs, pauseAfterMs, fadeInMs, fadeOutMs override the defaults
 *   in timing.ts for that paragraph only.
 *
 * The music prompt appears with the paragraph at music.promptAtMessage
 * (see music.ts); typing waits there until she chooses.
 */
export const MESSAGES: TypedMessage[] = [
    { text: "Some memories deserve to be remembered." },
    { text: "A month can sound like a long time..." },
    { text: "Until you realize how quickly moments become memories." },
    {
        text: ["The outings.", "The music.", "The conversations.", "The laughter."],
        typeSpeedMs: 60,
        pauseAfterMs: 2600,
    },
    { text: "The moments that weren't planned.", tone: "quiet" },
    { text: "And the people who made the whole experience special." },
    { text: "I'm grateful for this month.", pauseAfterMs: 2000 },
    { text: "I'm grateful for you.", tone: "emphasis", typeSpeedMs: 85, pauseAfterMs: 3600 },
]
