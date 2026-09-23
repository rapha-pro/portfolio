import { readdirSync } from "fs"
import { join } from "path"
import type { SiblingsConfig } from "@/lib/data/birthday/types"

const IMAGE_FILE = /\.(jpe?g|png|webp|avif|gif)$/i

/**
 * Purpose:
 *   Server only. Turns each sibling's photo name into a public URL by
 *   looking it up, whatever the extension is ("samy" finds samy.jpg or
 *   samy.jpeg). It looks in <photos folder>/siblings/ first, then in the
 *   photos folder itself, so the files can sit in either place. A name
 *   that already looks like a path is kept as it is, and anything missing
 *   becomes "" so the frame simply stays empty.
 *
 * Args:
 *   - siblings    : the person's siblings config, or null.
 *   - photoFolder : the person's media folder, e.g. "images/birthday/dulcinee".
 *
 * Returns:
 *   The same config with resolved photo URLs, or null.
 */
export function resolveSiblings(
    siblings: SiblingsConfig | null,
    photoFolder: string
): SiblingsConfig | null {
    if (!siblings) return null

    const root = photoFolder.replace(/^\/+|\/+$/g, "")
    const places = [`${root}/siblings`, root].map((folder) => ({
        base: folder.split("/").map(encodeURIComponent).join("/"),
        files: listFolder(folder),
    }))

    return {
        ...siblings,
        entries: siblings.entries.map((entry) => {
            const name = entry.photo.trim()
            if (!name || name.startsWith("/")) return entry
            for (const place of places) {
                const match = place.files.find(
                    (file) => stem(file).toLowerCase() === name.toLowerCase()
                )
                if (match) {
                    return { ...entry, photo: `/${place.base}/${encodeURIComponent(match)}` }
                }
            }
            return { ...entry, photo: "" }
        }),
    }
}

/** File name without its extension. */
function stem(file: string): string {
    return file.replace(/\.[^.]+$/, "")
}

/** Image file names in public/<folder>. */
function listFolder(folder: string): string[] {
    try {
        return readdirSync(join(process.cwd(), "public", folder)).filter((name) =>
            IMAGE_FILE.test(name)
        )
    } catch {
        return []
    }
}
