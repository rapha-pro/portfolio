import { Cormorant_Garamond } from "next/font/google"

/**
 * The serif of the tour's titles and room names, the same face as the
 * private birthday pages. Exposed as the --font-hq-serif variable and
 * consumed by the .hq-serif class.
 */
export const hqSerif = Cormorant_Garamond({
    variable: "--font-hq-serif",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    display: "swap",
})
