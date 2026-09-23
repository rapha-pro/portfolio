import type { WishesConfig } from "../types"
import { PROFILE } from "./profile"

/** The birthday message. Placeholder paragraphs: rewrite in your own words. */
export const WISHES: WishesConfig = {
    kicker: "September 23",
    title: [
        { text: "Happy Birthday", font: "script" },
        { text: `${PROFILE.name}`, font: "serif" },
    ],
    celebration: {
        number: "20",
        rays: 16,
        balloons: 9,
        confetti: 56,
    },
    paragraphs: [""],
}
