import type { BirthdayTheme } from "../types"

/**
 * The palette. Every color in the experience is derived from these values
 * (glows and transparencies are mixed from them), so a new mood is a
 * one-file change. Hex values only. `festive` colors the balloons and
 * confetti of the birthday chapter.
 */
export const THEME: BirthdayTheme = {
    background: "#080706",
    surface: "#14110e",
    ink: "#f3ece1",
    inkMuted: "#b8ae9f",
    inkSubtle: "#80776b",
    light: "#ffcf8f",
    ember: "#d9924f",
    festive: ["#e9c27a", "#f5e3c3", "#d8927f", "#b86b45", "#fff4df", "#a9bfa8"],
}
