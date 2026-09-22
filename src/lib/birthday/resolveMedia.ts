import { readdirSync } from "fs"
import { join } from "path"
import type { BirthdayMedia, PhotoConfig, PhotoFileEntry } from "@/lib/data/birthday/types"
import { seededShuffle } from "./random"

const IMAGE_FILE = /\.(jpe?g|png|webp|avif|gif)$/i
const VIDEO_FILE = /\.(mp4|webm|m4v)$/i
const POSTER_FILE = /\.poster\.(jpe?g|png|webp)$/i

type Entry = { file: string; position?: string; poster?: string }

/**
 * Purpose:
 *   Server only. Turns a PhotoConfig into the ordered list of photos and
 *   videos the experience renders. With an empty `files` list it reads the
 *   folder (at build time in production), so adding media is just a matter
 *   of dropping files into public/. A video's poster is `<name>.poster.jpg`
 *   next to it; posters are never listed as photos themselves.
 *
 * Args:
 *   - config : the person's photo settings.
 *   - seed   : stable seed for the "shuffle" order (the page slug).
 *
 * Returns:
 *   Ordered media with URL encoded paths.
 */
export function resolveMedia(config: PhotoConfig, seed: string): BirthdayMedia[] {
    const folder = config.folder.replace(/^\/+|\/+$/g, "")
    const listing = listFolder(folder)
    const entries = config.files.length > 0 ? config.files.map(toEntry) : defaultEntries(listing)
    const ordered = config.order === "shuffle" ? seededShuffle(entries, seed) : entries
    const base = folder.split("/").map(encodeURIComponent).join("/")
    const url = (file: string) => `/${base}/${encodeURIComponent(file)}`

    return ordered
        .filter((e) => IMAGE_FILE.test(e.file) || VIDEO_FILE.test(e.file))
        .map((entry): BirthdayMedia => {
            const kind = VIDEO_FILE.test(entry.file) ? "video" : "image"
            const poster =
                kind === "video" ? (entry.poster ?? findPoster(entry.file, listing)) : undefined
            return {
                kind,
                src: url(entry.file),
                ...(poster ? { poster: url(poster) } : {}),
                ...(entry.position ? { position: entry.position } : {}),
            }
        })
}

/** Normalizes a string or object file entry. */
function toEntry(entry: PhotoFileEntry): Entry {
    return typeof entry === "string" ? { file: entry } : entry
}

/** Every photo and video in the folder, posters excluded. */
function defaultEntries(listing: string[]): Entry[] {
    return listing
        .filter((name) => !POSTER_FILE.test(name))
        .filter((name) => IMAGE_FILE.test(name) || VIDEO_FILE.test(name))
        .map((file) => ({ file }))
}

/** The poster sitting next to a video, if any. */
function findPoster(video: string, listing: string[]): string | undefined {
    const stem = video.replace(/\.[^.]+$/, "")
    return listing.find((name) => POSTER_FILE.test(name) && name.startsWith(`${stem}.poster.`))
}

/** File names in public/<folder>, sorted naturally (2 before 10). */
function listFolder(folder: string): string[] {
    try {
        return readdirSync(join(process.cwd(), "public", folder)).sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
        )
    } catch {
        return []
    }
}
