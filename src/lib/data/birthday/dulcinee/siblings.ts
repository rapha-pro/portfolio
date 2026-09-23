import type { SiblingsConfig } from "../types"

/**
 * A word from her siblings, shown one at a time after the verse: the name
 * on top, their message under it, and a framed photo of the two of them.
 *
 * PLACEHOLDERS: replace the three names and messages below.
 *
 * Photos: put them in public/images/birthday/dulcinee/siblings/ (that
 * folder is ignored by the memory stream) and point `photo` at them, e.g.
 * "/images/birthday/dulcinee/siblings/grace.jpg". Leave photo as "" to
 * show an empty frame. To resize them like the rest, drop the originals in
 * media-originals/birthday/dulcinee/_unused/ first, or just use files that
 * are already small.
 *
 * Add or remove siblings by editing the list; set the whole export to null
 * to skip the chapter.
 */
export const SIBLINGS: SiblingsConfig = {
    kicker: "A word from her family",
    entries: [
        {
            name: "First sibling",
            message: "Their message goes here.",
            photo: "",
        },
        {
            name: "Second sibling",
            message: "Their message goes here.",
            photo: "",
        },
        {
            name: "Third sibling",
            message: "Their message goes here.",
            photo: "",
        },
    ],
}
