import type { TypedMessage } from "../types"

/**
 * The typed messages under the photos, shown one paragraph at a time.
 *
 * - text as a string types one paragraph.
 * - text as an array types each line in turn and keeps them together.
 * - tone: "quiet" is smaller and softer, "emphasis" is italic and warmer.
 * - typeSpeedMs, pauseAfterMs, fadeInMs, fadeOutMs override the defaults
 *   in timing.ts for that paragraph only.
 *
 * The music starts on its own (see music.ts, startAtMessage).
 */
export const MESSAGES: TypedMessage[] = [
    { text: "Some memories deserve to be remembered" },
    { text: "Un mois, ça peut sembler long.." },
    {
        text: "Jusqu'à ce que tu réalises à quelle vitesse les moments deviennent des souvenirs",
    },
    {
        text: ["Les sorties", "La musique", "Les conversations", "Les rires..."],
        typeSpeedMs: 60,
        pauseAfterMs: 2600,
    },
    {
        text: "Les moments qu'on ne prévoit pas sont toujours les meilleurs",
        tone: "quiet",
        pauseAfterMs: 3000,
    },
    { text: "Et les personnes qui ont rendu tout ça spécial.." },
    { text: "I'm just grateful.", pauseAfterMs: 2000 },
    // { text: "I'm grateful for you.", tone: "emphasis", typeSpeedMs: 85, pauseAfterMs: 3600 },
]
