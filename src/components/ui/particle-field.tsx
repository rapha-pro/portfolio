"use client"

import { useEffect, useRef } from "react"

type ParticleFieldProps = {
  /** Particle count. Default 55. */
  count?: number
  /** Max pixel distance before two particles get linked by a line. Default 110. */
  linkDistance?: number
  /**
   * Particles + links color as an [r, g, b] triple (0–255).
   * Defaults to the accent color read from the `--accent` CSS variable.
   */
  rgb?: [number, number, number]
  className?: string
}

type Dot = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
}

/**
 * Purpose:
 *   Parse a CSS hex string like "#8b5cf6" (or shorthand "#8bf") into its
 *   [r, g, b] components.
 *
 * Args:
 *   hex — any 3- or 6-digit hex with or without leading "#".
 *
 * Returns:
 *   An RGB triple; falls back to [139, 92, 246] on any parse failure.
 */
function hexToRgb(hex: string): [number, number, number] {
  const fallback: [number, number, number] = [139, 92, 246]
  const clean = hex.trim().replace("#", "")
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean
  if (full.length !== 6 || /[^0-9a-fA-F]/.test(full)) return fallback
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/**
 * Purpose:
 *   Decorative particle field rendered to a canvas. Particles drift,
 *   wrap at edges, and draw faint links to nearby particles. Cheap and
 *   accent-aware (reads --accent on mount).
 *
 * Args:
 *   count        — number of particles.
 *   linkDistance — px threshold for link drawing.
 *   rgb          — override color; defaults to --accent from CSS.
 *   className    — extra classes on the root <canvas>.
 *
 * Returns:
 *   A pointer-events-none absolute <canvas> covering its parent.
 */
export function ParticleField({
  count = 55,
  linkDistance = 110,
  rgb,
  className = "",
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Resolve color once at mount
    const resolved: [number, number, number] =
      rgb ??
      hexToRgb(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim(),
      )
    const [R, G, B] = resolved

    /** Handle HiDPI + element resize without re-creating particles. */
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const dots: Dot[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.5 + 0.15,
    }))

    let rafId = 0
    const draw = () => {
      rafId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // particles
      for (const d of dots) {
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0) d.x = canvas.width
        if (d.x > canvas.width) d.x = 0
        if (d.y < 0) d.y = canvas.height
        if (d.y > canvas.height) d.y = 0

        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${R},${G},${B},${d.a})`
        ctx.fill()
      }

      // links (O(n²) but n is small)
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < linkDistance) {
            const alpha = 0.12 * (1 - dist / linkDistance)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${R},${G},${B},${alpha})`
            ctx.lineWidth = 0.6
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
    }
  }, [count, linkDistance, rgb])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
