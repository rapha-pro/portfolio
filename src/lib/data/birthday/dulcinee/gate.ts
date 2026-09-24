import type { GateConfig } from "../types"
import { PROFILE } from "./profile"

/**
 * The entrance screen and the two screens that follow the right code.
 *
 * pin is the only place the code lives. It can be any length of digits;
 * the number of boxes follows it.
 *
 * unlocked: after the spark, its lines fade in one after another. Each
 * line is a list of pieces so a few words can be colored ("green" and
 * "yellow" come from theme.ts). null goes straight to the briefing.
 *
 * briefing: the short "headphones and landscape" screen before the
 * tunnel. Phones see `message`, wider screens see `desktopMessage`.
 *
 * Hints are revealed one after another once the matching number of wrong
 * attempts has been reached. Leave the array empty for no hints.
 */
export const GATE: GateConfig = {
    pin: "9032",
    title: "Enter PIN",
    subtitle: "Between two worlds",
    cornerLabel: `23rd September ${PROFILE.year}`,
    inputLabel: "Enter the four digit code",
    unlocked: {
        lines: [
            [
                { text: "Correcte, ta " },
                { text: "date d'anniversaire à l'envers !", color: "green" },
                { text: " 😏" },
            ],
            [
                { text: "Félicitations", color: "yellow" },
                { text: " 🎉 La quête était dure, mais t'as trouvé le code secret." },
            ],
        ],
    },
    briefing: {
        message:
            "Pour une meilleure expérience, veuillez bien mettre votre téléphone en mode paysage et mettre des écouteurs.",
        desktopMessage: "Pour une meilleure expérience, veuillez bien mettre des écouteurs.",
    },
    wrongMessages: ["Not quite...", "Close, maybe. Try again.", "Take your time..."],
    hints: [
        { afterAttempts: 10, text: "anniversaire" },
        { afterAttempts: 15, text: "date" },
    ],
    tunnelWhisper: "Come, let's go back for a moment.",
}
