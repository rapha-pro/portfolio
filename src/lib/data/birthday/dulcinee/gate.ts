import type { GateConfig } from "../types"
import { PROFILE } from "./profile"

/**
 * The entrance screen.
 *
 * pin is the only place the code lives. It can be any length of digits;
 * the number of boxes follows it.
 *
 * successMessage is shown, with its own little animation, right after the
 * right code and before the tunnel starts. Its time on screen is
 * timing.gate.successHoldMs. Leave it "" to go straight to the tunnel.
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
    successMessage: "Correct ! Ta date d'anniversaire à l'envers 😏",
    wrongMessages: ["Not quite...", "Close, maybe. Try again.", "Take your time..."],
    hints: [
        { afterAttempts: 6, text: "C'est une date." },
        { afterAttempts: 9, text: "Ta date d'anniversaire, à l'envers." },
    ],
    tunnelWhisper: "Come, let's go back for a moment.",
}
