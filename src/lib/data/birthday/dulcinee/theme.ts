import type { BirthdayTheme } from "../types"

/**
 * The palette. Every color in the experience is derived from these seven
 * values (glows and transparencies are mixed from them), so a new mood is
 * a one-file change. Hex values only.
 */
export const THEME: BirthdayTheme = {
    background: "#080706",
    surface: "#14110e",
    ink: "#f3ece1",
    inkMuted: "#b8ae9f",
    inkSubtle: "#80776b",
    light: "#ffcf8f",
    ember: "#d9924f",
}
