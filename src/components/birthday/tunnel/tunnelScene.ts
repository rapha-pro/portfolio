/**
 * Canvas engine for the tunnel transition: warm dust and ghostly
 * photographs drifting out of a point of light, slowly at first, then
 * rushing past as the camera is pulled forward. Motion blur comes from
 * fading the previous frame instead of clearing it.
 *
 * Plain TypeScript with no React so the render loop never touches state.
 */

type Rgb = [number, number, number]

export type TunnelSceneOptions = {
    durationMs: number // time from stillness to full speed
    background: string // hex
    light: string // hex
    ink: string // hex
    origin: { x: number; y: number } | null // where the point of light starts, in CSS px
    images: HTMLImageElement[] // ghost photographs, may still be loading
    compact: boolean // phones: fewer particles, lower resolution
}

export type TunnelScene = {
    stop: () => void
}

type Mote = { angle: number; radius: number; z: number; size: number; warmth: number }
type Ghost = {
    angle: number
    radius: number
    z: number
    tilt: number
    image: number
    alive: boolean
}

const Z_FAR = 6
const Z_NEAR = 0.1
const GHOST_W = 0.34
const GHOST_H = 0.42
const TEXTURE_W = 200
const TEXTURE_H = 250

/**
 * Purpose:
 *   Starts the tunnel animation on a canvas and keeps it running until
 *   stopped. Progress is time based, so it finishes on schedule even on a
 *   slow phone (it simply draws fewer frames).
 *
 * Args:
 *   - canvas : the canvas element, sized by CSS to fill the screen.
 *   - opts   : colors, duration, starting point and ghost images.
 *
 * Returns:
 *   A handle whose stop() cancels the loop and releases listeners.
 */
export function startTunnelScene(canvas: HTMLCanvasElement, opts: TunnelSceneOptions): TunnelScene {
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return { stop: () => undefined }

    const bg = hexToRgb(opts.background)
    const light = hexToRgb(opts.light)
    const ink = hexToRgb(opts.ink)
    const core: Rgb = mix(light, [255, 250, 240], 0.7)
    const dpr = Math.min(window.devicePixelRatio || 1, opts.compact ? 1.75 : 2)

    let width = 0
    let height = 0
    const resize = () => {
        width = canvas.clientWidth
        height = canvas.clientHeight
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.fillStyle = rgba(bg, 1)
        ctx.fillRect(0, 0, width, height)
    }
    resize()
    window.addEventListener("resize", resize)

    const spawnMote = (anywhere: boolean): Mote => ({
        angle: Math.random() * Math.PI * 2,
        // Keep the axis clear so the light at the end stays visible.
        radius: 0.16 + Math.pow(Math.random(), 0.7) * 1.3,
        z: anywhere ? 0.4 + Math.random() * (Z_FAR - 0.4) : Z_FAR * (0.82 + Math.random() * 0.18),
        size: 0.6 + Math.random() * 1.7,
        warmth: Math.random(),
    })
    const motes = Array.from({ length: opts.compact ? 100 : 170 }, () => spawnMote(true))

    const ghostCount = Math.max(8, Math.min(14, opts.images.length || 10))
    const ghosts: Ghost[] = Array.from({ length: ghostCount }, (_, i) => ({
        angle: (i / ghostCount) * Math.PI * 2 + Math.random() * 0.5,
        radius: 0.72 + Math.random() * 0.6,
        z: Z_FAR * (0.3 + (i / ghostCount) * 0.7) + Math.random() * 0.3,
        tilt: (Math.random() - 0.5) * 0.35,
        image: opts.images.length ? i % opts.images.length : -1,
        alive: true,
    }))

    const textures = new Map<HTMLImageElement, HTMLCanvasElement>()
    const textureFor = (img: HTMLImageElement): HTMLCanvasElement | null => {
        const cached = textures.get(img)
        if (cached) return cached
        if (!img.complete || img.naturalWidth === 0) return null
        const tex = prepareGhost(img)
        textures.set(img, tex)
        return tex
    }

    const start = performance.now()
    let last = start
    let raf = 0

    const frame = (now: number) => {
        const elapsed = now - start
        const p = clamp01(elapsed / opts.durationMs)
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now

        const accel = p * p * p
        const speed = 0.28 + accel * 7.5
        const focal = Math.min(width, height) * 0.62
        const trail = lerp(0.5, 0.2, accel)

        // Camera: start at the point of light left by the code boxes, ease
        // to the center, then drift and roll a little as speed builds.
        const settle = 1 - easeOutCubic(clamp01(p / 0.4))
        const ox = opts.origin?.x ?? width / 2
        const oy = opts.origin?.y ?? height / 2
        const vx = lerp(width / 2, ox, settle) + Math.sin(elapsed * 0.0011) * width * 0.012 * accel
        const vy =
            lerp(height / 2, oy, settle) + Math.cos(elapsed * 0.0008) * height * 0.012 * accel
        const roll = Math.sin(elapsed * 0.0006) * 0.05 * (0.3 + accel) + accel * accel * 0.18

        ctx.globalCompositeOperation = "source-over"
        ctx.globalAlpha = 1
        ctx.fillStyle = rgba(bg, trail)
        ctx.fillRect(0, 0, width, height)

        ctx.save()
        ctx.translate(vx, vy)
        ctx.rotate(roll)

        // The light we are being pulled towards. Scaled by `trail` because
        // it accumulates over frames that are only partially cleared.
        const reach =
            focal * (0.07 + accel * 0.55) + smoothstep(0.7, 1, p) * Math.hypot(width, height)
        const intensity = (0.3 + accel * 0.6) * trail
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(1, reach))
        glow.addColorStop(0, rgba(core, Math.min(1, intensity * 2.2)))
        glow.addColorStop(0.22, rgba(light, intensity * 0.7))
        glow.addColorStop(1, rgba(light, 0))
        ctx.globalCompositeOperation = "lighter"
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(0, 0, Math.max(1, reach), 0, Math.PI * 2)
        ctx.fill()

        // Ghost photographs on the tunnel walls.
        ctx.globalCompositeOperation = "source-over"
        for (const g of ghosts) {
            if (!g.alive) continue
            g.z -= speed * dt * 0.9
            if (g.z <= Z_NEAR * 2) {
                if (p < 0.72) {
                    g.z = Z_FAR
                    g.angle = Math.random() * Math.PI * 2
                } else {
                    g.alive = false
                }
                continue
            }
            const scale = focal / g.z
            const x = Math.cos(g.angle) * g.radius * scale
            const y = Math.sin(g.angle) * g.radius * scale
            const w = GHOST_W * scale
            const h = GHOST_H * scale
            if (Math.abs(x) - w > width || Math.abs(y) - h > height) continue

            const depth = 1 - g.z / Z_FAR
            const alpha = smoothstep(0, 0.35, depth) * (1 - smoothstep(0.92, 1, depth)) * 0.5
            if (alpha <= 0.005) continue

            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(g.tilt)
            ctx.globalAlpha = alpha
            const tex = g.image >= 0 ? textureFor(opts.images[g.image]) : null
            if (tex) {
                ctx.drawImage(tex, -w / 2, -h / 2, w, h)
            } else {
                ctx.fillStyle = rgba(light, 0.05)
                ctx.fillRect(-w / 2, -h / 2, w, h)
            }
            ctx.strokeStyle = rgba(core, 0.5)
            ctx.lineWidth = 1
            ctx.strokeRect(-w / 2, -h / 2, w, h)
            ctx.restore()
        }
        ctx.globalAlpha = 1

        // Dust streaks: the tail sits slightly deeper, so faster means longer.
        ctx.globalCompositeOperation = "lighter"
        ctx.lineCap = "round"
        for (let i = 0; i < motes.length; i++) {
            const m = motes[i]
            m.z -= speed * dt * (0.85 + m.warmth * 0.3)
            if (m.z <= Z_NEAR) {
                motes[i] = spawnMote(false)
                continue
            }
            const cos = Math.cos(m.angle)
            const sin = Math.sin(m.angle)
            const headScale = focal / m.z
            const tailScale = focal / Math.min(Z_FAR, m.z + speed * 0.032 + 0.012)
            const hx = cos * m.radius * headScale
            const hy = sin * m.radius * headScale
            if (Math.abs(hx) > width * 1.2 || Math.abs(hy) > height * 1.2) {
                motes[i] = spawnMote(false)
                continue
            }
            const depth = 1 - m.z / Z_FAR
            const alpha = smoothstep(0, 0.25, depth) * (0.2 + depth * 0.8) * (0.4 + accel * 0.35)
            ctx.strokeStyle = rgba(mix(ink, light, 0.35 + m.warmth * 0.65), alpha)
            ctx.lineWidth = clamp(m.size * headScale * 0.005, 0.6, 2.6)
            ctx.beginPath()
            ctx.moveTo(cos * m.radius * tailScale, sin * m.radius * tailScale)
            ctx.lineTo(hx, hy)
            ctx.stroke()
        }

        ctx.restore()
        raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)

    return {
        stop: () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("resize", resize)
            textures.clear()
        },
    }
}

/** Bakes a photo into a small, warm, softly vignetted texture once. */
function prepareGhost(img: HTMLImageElement): HTMLCanvasElement {
    const tex = document.createElement("canvas")
    tex.width = TEXTURE_W
    tex.height = TEXTURE_H
    const g = tex.getContext("2d")
    if (!g) return tex

    // Cover fit
    const ratio = Math.max(TEXTURE_W / img.naturalWidth, TEXTURE_H / img.naturalHeight)
    const w = img.naturalWidth * ratio
    const h = img.naturalHeight * ratio
    g.filter = "sepia(0.45) saturate(0.7) brightness(0.95)"
    g.drawImage(img, (TEXTURE_W - w) / 2, (TEXTURE_H - h) / 2, w, h)
    g.filter = "none"

    // Soft edges so it reads as a memory rather than a sharp print.
    g.globalCompositeOperation = "destination-in"
    const fade = g.createRadialGradient(
        TEXTURE_W / 2,
        TEXTURE_H / 2,
        TEXTURE_W * 0.3,
        TEXTURE_W / 2,
        TEXTURE_H / 2,
        TEXTURE_H * 0.72
    )
    fade.addColorStop(0, "rgba(0,0,0,1)")
    fade.addColorStop(1, "rgba(0,0,0,0.3)")
    g.fillStyle = fade
    g.fillRect(0, 0, TEXTURE_W, TEXTURE_H)
    return tex
}

function hexToRgb(hex: string): Rgb {
    const h = hex.replace("#", "")
    const full =
        h.length === 3
            ? h
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : h.slice(0, 6)
    const n = parseInt(full, 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgba(c: Rgb, a: number): string {
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
    return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
    ]
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
}

function clamp(v: number, lo: number, hi: number): number {
    return Math.min(hi, Math.max(lo, v))
}

function clamp01(v: number): number {
    return clamp(v, 0, 1)
}

function smoothstep(e0: number, e1: number, x: number): number {
    const t = clamp01((x - e0) / (e1 - e0))
    return t * t * (3 - 2 * t)
}

function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
}
