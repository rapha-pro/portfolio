import { Cormorant_Garamond } from "next/font/google"

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
