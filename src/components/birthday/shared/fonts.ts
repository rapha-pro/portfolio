import { Cormorant_Garamond, Pinyon_Script } from "next/font/google"

/**
 * The serif used for every emotional line of the birthday pages. Exposed
 * as the --font-bd-serif variable and consumed by the .bd-serif class.
 */
export const birthdaySerif = Cormorant_Garamond({
    variable: "--font-bd-serif",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600"],
    style: ["normal", "italic"],
    display: "swap",
})

/**
 * The calligraphy face used for lines marked font: "script" (the birthday
 * title). Swap Pinyon_Script for another next/font/google script here and
 * the whole page follows.
 */
export const birthdayScript = Pinyon_Script({
    variable: "--font-bd-script",
    subsets: ["latin"],
    weight: "400",
    display: "swap",
})
