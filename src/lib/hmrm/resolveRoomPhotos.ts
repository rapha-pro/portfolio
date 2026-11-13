import { readdirSync, statSync } from "fs"
import { join } from "path"
import type { HqPhoto, HqRoom } from "@/lib/data/hmrm/types"

const IMAGE_FILE = /\.(jpe?g|png|webp|avif)$/i

/**
 * Purpose:
 *   Server only. Turns a room's `photos` list (folders and single files,
 *   relative to the photo folder) into the images to show, read at build
 *   time in production. A folder contributes every image inside it, in
 *   natural file name order; missing entries are skipped.
 *
 * Args:
 *   - folder : photo folder under public/, e.g. "images/hmrm_headquarter_design".
 *   - room   : the room.
 *
 * Returns:
 *   The room's photos with URL encoded paths, possibly none.
 */
export function resolveRoomPhotos(folder: string, room: HqRoom): HqPhoto[] {
    const root = folder.replace(/^\/+|\/+$/g, "")
    const disk = (path: string) => join(process.cwd(), "public", root, path)
    const url = (path: string) =>
        `/${[...root.split("/"), ...path.split("/")].map(encodeURIComponent).join("/")}`

    const files = room.photos.flatMap((entry) => {
        try {
            if (!statSync(disk(entry)).isDirectory()) return IMAGE_FILE.test(entry) ? [entry] : []
            return readdirSync(disk(entry))
                .filter((file) => IMAGE_FILE.test(file))
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                .map((file) => `${entry}/${file}`)
        } catch {
            return []
        }
    })

    return files.map((path, i) => ({ src: url(path), alt: `${room.name}, photo ${i + 1}` }))
}
