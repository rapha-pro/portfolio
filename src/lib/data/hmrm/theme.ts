import type { HqTheme } from "./types"

/**
 * The palette, mapped to the --hq-* variables by the layout. Every glow
 * and transparency is mixed from these values, so a new mood is a one-file
 * change. Hex values only.
 */
export const THEME: HqTheme = {
    background: "#0a0908",
    surface: "#15120f",
    ink: "#f3ece1",
    inkMuted: "#b8ae9f",
    inkSubtle: "#81786c",
    light: "#e8c07a",
}
