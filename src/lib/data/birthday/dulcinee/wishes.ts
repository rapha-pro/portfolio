import type { WishesConfig } from "../types"
import { PROFILE } from "./profile"

/** The birthday message. Placeholder paragraphs: rewrite in your own words. */
export const WISHES: WishesConfig = {
    kicker: "September 23",
    title: ["Happy Birthday,", `${PROFILE.name}.`],
    celebration: {
        number: "20",
        rays: 16,
        balloons: 9,
        confetti: 56,
    },
    paragraphs: [
        "Today is about you, and about the One who made you with so much care.",
        "I pray this new year of your life is full of His guidance, His peace, and blessings you did not even think to ask for.",
        "May you grow in wisdom and in joy, and may you walk confidently in the purpose He has for you.",
        "Thank you for being who you are. Knowing you has been a gift, and I am grateful for it.",
    ],
}
