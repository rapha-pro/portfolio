import type { PhotoConfig } from "../types"

/**
 * Where the photos and videos come from.
 *
 * Easiest: put the full-size originals in media-originals/birthday/dulcinee/
 * and run `pnpm birthday:media dulcinee`. It writes light web versions
 * (and a poster frame for each video) into public/images/birthday/dulcinee/.
 *
 * With `files` empty, every photo (jpg, jpeg, png, webp, avif, gif) and
 * video (mp4, webm, m4v) in that public folder is used, sorted by file name;
 * `order: "shuffle"` gives a stable mixed order instead. Videos play muted
 * on their card; `<name>.poster.jpg` next to a video is used as its poster.
 *
 * To hand pick the order or crop a photo, list them instead:
 *   files: ["beach.jpg", { file: "concert.jpg", position: "50% 20%" }, "clip.mp4"]
 */
export const PHOTOS: PhotoConfig = {
    folder: "images/birthday/dulcinee",
    files: [],
    order: "name",
}
