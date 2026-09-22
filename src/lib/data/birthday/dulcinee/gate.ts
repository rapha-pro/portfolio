import type { GateConfig } from "../types"
import { PROFILE } from "./profile"

/**
 * The entrance screen.
 *
 * pin is the only place the code lives. It can be any length of digits;
 * the number of boxes follows it.
 *
 * Hints are revealed one after another once the matching number of wrong
 * attempts has been reached. Leave the array empty for no hints.
 */
export const GATE: GateConfig = {
    pin: "2309",
    title: "Enter PIN",
    subtitle: "“Between two worlds”",
    cornerLabel: `23rd September ${PROFILE.year}`,
    inputLabel: "Enter the four digit code",
    wrongMessages: ["Not quite...", "Close, maybe. Try again.", "Take your time..."],
    hints: [
        { afterAttempts: 2, text: "It's a date." },
        { afterAttempts: 4, text: "Today's date. Day first, then the month." },
    ],
    tunnelWhisper: "Come, let's go back for a moment.",
}
