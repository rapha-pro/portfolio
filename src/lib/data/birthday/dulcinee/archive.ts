import type { ArchiveConfig } from "../types"
import { PROFILE } from "./profile"

/** Small labels printed around the memory room, like an archive index card. */
export const ARCHIVE: ArchiveConfig = {
    title: "Memory Archive",
    reference: "Ref. 23 / 09",
    subject: `${PROFILE.name} / ${PROFILE.year}`,
    counter: "{count} frames",
    streamLabel: "Photographs from our time together, drifting slowly across the room.",
}
