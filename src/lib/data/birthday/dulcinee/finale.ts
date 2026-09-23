import type { FinaleConfig } from "../types"

/**
 * The ending, pointing her to the notebook. `lines` play one at a time;
 * then the notebook appears with the closing lines, and stays.
 * closingTitle is optional: "" hides it.
 */
export const FINALE: FinaleConfig = {
    lines: [
        { text: "We're not over yet", holdMs: 1800 },
        { text: "One more surprise for you...", holdMs: 2400 },
        // { text: "This was just the beginning.", holdMs: 2200 },
        { text: "There's something waiting for you!", holdMs: 2600 },
    ],
    instruction: "I left a little something for you.",
    closingTitle: "",
    blessing: "May God bless this new chapter of your life.",
    replayLabel: "Begin again",
}
