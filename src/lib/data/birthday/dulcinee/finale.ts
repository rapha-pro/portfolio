import type { FinaleConfig } from "../types"
import { PROFILE } from "./profile"

/**
 * The ending, pointing her to the notebook. `lines` play one at a time;
 * then the notebook appears with the three closing lines, and stays.
 */
export const FINALE: FinaleConfig = {
    lines: [
        { text: "But...", holdMs: 1600 },
        { text: "And one more last surprise for you.", holdMs: 2400 },
        { text: "This was just the beginning.", holdMs: 2200 },
        { text: "There's something waiting for you.", holdMs: 2600 },
    ],
    instruction: "Go open the little book I left you.",
    closingTitle: `Happy Birthday, ${PROFILE.name}.`,
    blessing: "May God bless this new chapter of your life.",
    replayLabel: "Begin again",
}
