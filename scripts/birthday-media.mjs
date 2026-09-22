#!/usr/bin/env node
/**
 * Prepares a birthday person's photos and videos for the web.
 *
 *   pnpm birthday:media <name> [--max-seconds 20]
 *
 * Reads the originals from media-originals/birthday/<name>/ (git ignored,
 * so full-size phone files never reach the repository) and writes light
 * web versions to public/images/birthday/<name>/:
 *
 *   photos (jpg, jpeg, png, webp, heic*) -> JPEG, 1600 px on the long edge,
 *                                           orientation fixed
 *   videos (mp4, mov, m4v, webm)         -> silent H.264 MP4, 480 px on the
 *                                           short side, first N seconds,
 *                                           plus <file>.poster.jpg
 *
 * Files starting with "_" and subfolders are skipped (park anything you do
 * not want published in a "_unused" folder). Outputs newer than their
 * original are left alone, so re-running only processes new files.
 *
 * Photos use the sharp build that ships with Next.js; videos need ffmpeg on
 * the PATH. (*HEIC only if that sharp build supports it.)
 */
import { createRequire } from "node:module"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

const PHOTO = /\.(jpe?g|png|webp|heic|heif)$/i
const VIDEO = /\.(mp4|mov|m4v|webm)$/i
const LONG_EDGE = 1600
const VIDEO_SHORT_SIDE = 480

const args = process.argv.slice(2)
const name = args.find((a) => !a.startsWith("--"))
const maxIndex = args.indexOf("--max-seconds")
const maxSeconds = maxIndex >= 0 ? Number(args[maxIndex + 1]) : 20

if (!name) {
    console.error("Usage: pnpm birthday:media <name> [--max-seconds 20]")
    process.exit(1)
}

const root = process.cwd()
const source = path.join(root, "media-originals", "birthday", name)
const target = path.join(root, "public", "images", "birthday", name)

if (!fs.existsSync(source)) {
    console.error(`No originals folder: ${path.relative(root, source)}`)
    process.exit(1)
}
fs.mkdirSync(target, { recursive: true })

const require = createRequire(path.join(root, "package.json"))
const sharp = createRequire(require.resolve("next/package.json"))("sharp")
const hasFfmpeg = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0

const files = fs
    .readdirSync(source, { withFileTypes: true })
    .filter((d) => d.isFile() && !d.name.startsWith("_"))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

let made = 0
let skipped = 0

for (const file of files) {
    const input = path.join(source, file)
    const base = path.parse(file).name

    if (PHOTO.test(file)) {
        const output = path.join(target, `${base}.jpg`)
        if (isFresh(output, input)) {
            skipped++
            continue
        }
        await sharp(input)
            .rotate()
            .resize({
                width: LONG_EDGE,
                height: LONG_EDGE,
                fit: "inside",
                withoutEnlargement: true,
            })
            .jpeg({ quality: 78, mozjpeg: true })
            .toFile(output)
        report(file, output)
        made++
    } else if (VIDEO.test(file)) {
        if (!hasFfmpeg) {
            console.warn(`skip ${file}: ffmpeg is not installed`)
            continue
        }
        const output = path.join(target, `${base}.mp4`)
        const poster = path.join(target, `${base}.poster.jpg`)
        if (isFresh(output, input) && isFresh(poster, input)) {
            skipped++
            continue
        }
        const short = VIDEO_SHORT_SIDE
        run("ffmpeg", [
            "-y",
            "-v",
            "error",
            "-i",
            input,
            "-t",
            String(maxSeconds),
            "-an",
            "-vf",
            `scale='if(gt(iw,ih),-2,${short})':'if(gt(iw,ih),${short},-2)',fps=30`,
            "-c:v",
            "libx264",
            "-profile:v",
            "main",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            "28",
            "-preset",
            "slow",
            "-movflags",
            "+faststart",
            output,
        ])
        run("ffmpeg", [
            "-y",
            "-v",
            "error",
            "-ss",
            "0.4",
            "-i",
            output,
            "-frames:v",
            "1",
            "-q:v",
            "4",
            poster,
        ])
        report(file, output)
        made++
    }
}

console.log(`\n${made} processed, ${skipped} already up to date -> ${path.relative(root, target)}`)

/** True when `output` exists and is newer than `input`. */
function isFresh(output, input) {
    return fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(input).mtimeMs
}

/** Runs a command and stops the script if it fails. */
function run(cmd, cmdArgs) {
    const result = spawnSync(cmd, cmdArgs, { stdio: "inherit" })
    if (result.status !== 0) {
        console.error(`${cmd} failed on ${cmdArgs[cmdArgs.indexOf("-i") + 1]}`)
        process.exit(1)
    }
}

/** Prints before and after sizes. */
function report(file, output) {
    const before = fs.statSync(path.join(source, file)).size
    const after = fs.statSync(output).size
    console.log(`${file}  ${mb(before)} -> ${mb(after)}`)
}

function mb(bytes) {
    return `${(bytes / 1048576).toFixed(1)} MB`
}
