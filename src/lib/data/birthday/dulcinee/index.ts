import type { BirthdayConfig } from "../types"
import { PROFILE } from "./profile"
import { GATE } from "./gate"
import { ARCHIVE } from "./archive"
import { PHOTOS } from "./photos"
import { MESSAGES } from "./messages"
import { MUSIC } from "./music"
import { VERSE } from "./verse"
import { WISHES } from "./wishes"
import { FINALE } from "./finale"
import { UI } from "./ui"
import { THEME } from "./theme"
import { TIMING } from "./timing"

/** Dulcinée's birthday experience, assembled from the files in this folder. */
export const DULCINEE: BirthdayConfig = {
    profile: PROFILE,
    gate: GATE,
    archive: ARCHIVE,
    photos: PHOTOS,
    messages: MESSAGES,
    music: MUSIC,
    verse: VERSE,
    wishes: WISHES,
    finale: FINALE,
    ui: UI,
    theme: THEME,
    timing: TIMING,
}
