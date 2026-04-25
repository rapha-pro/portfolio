"use client"

import { useState } from "react"

type CompanyLogoProps = {
  /** Company display name — used for alt text and the fallback monogram. */
  name: string
  /** Optional local logo under /public; preferred source when provided. */
  localSrc?: string | null
  /** Optional Simple Icons slug (e.g. "ford"). Tried before the monogram. */
  simpleIconSlug?: string
  /** Tailwind size tokens — defaults to h-14 w-14. */
  sizeClass?: string
  /** When true, logo renders on a white backdrop (for dark wordmarks). */
  lightBg?: boolean
  /**
   * Optional hex color to force as the tile background.
   * Takes priority over `lightBg`. Use for logos that need a specific brand
   * background (e.g. Caterpillar's yellow mark on dark).
   */
  bgOverride?: string
  /** Accent color for the monogram fallback (hex). */
  accent?: string
  className?: string
}

/**
 * Purpose:
 *   Smart logo tile. Prefers a local image, falls back to a Simple Icons
 *   CDN glyph, and finally shows a monogram (first letter of the company)
 *   on a glass chip. The chain is resilient to broken URLs — each failure
 *   advances the fallback via `onError`.
 *
 *   Precedence:
 *     localSrc → https://cdn.simpleicons.org/{slug} → monogram badge
 *
 *   Background priority:
 *     bgOverride → lightBg (#FFFFFF) → glass gradient (default)
 *
 * Args:
 *   name           — company name (alt + monogram source).
 *   localSrc       — preferred local image path.
 *   simpleIconSlug — Simple Icons slug for the CDN fallback.
 *   sizeClass      — tailwind height + width classes.
 *   lightBg        — use a white card for dark brand marks.
 *   bgOverride     — force an exact hex background (overrides lightBg).
 *   accent         — monogram tint.
 *   className      — extra classes on the tile.
 *
 * Returns:
 *   A square tile that renders whichever layer of the chain succeeded.
 */
export function CompanyLogo({
  name,
  localSrc,
  simpleIconSlug,
  sizeClass = "h-14 w-14",
  lightBg = false,
  bgOverride,
  accent = "var(--accent)",
  className = "",
}: CompanyLogoProps) {
  /**
   * Stages:
   *   0 — try localSrc
   *   1 — try Simple Icons CDN
   *   2 — monogram fallback
   */
  const initial = localSrc ? 0 : simpleIconSlug ? 1 : 2
  const [stage, setStage] = useState<0 | 1 | 2>(initial as 0 | 1 | 2)

  /** Advance to the next fallback stage on image load error. */
  const advance = () =>
    setStage((s) => {
      if (s === 0 && simpleIconSlug) return 1
      return 2
    })

  const tileBase = `relative flex items-center justify-center overflow-hidden rounded-xl border border-app ${sizeClass} ${className}`

  const tileBg = bgOverride
    ? bgOverride
    : lightBg
      ? "#FFFFFF"
      : "linear-gradient(135deg, var(--glass), var(--glass-strong))"

  if (stage === 2) {
    return (
      <div
        className={tileBase}
        style={{ background: "linear-gradient(135deg, var(--glass), var(--glass-strong))" }}
        aria-label={name}
        title={name}
      >
        <span className="text-lg font-bold" style={{ color: accent }}>
          {name.trim().charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  const src =
    stage === 0 && localSrc
      ? localSrc
      : simpleIconSlug
        ? `https://cdn.simpleicons.org/${simpleIconSlug}`
        : ""

  return (
    <div className={tileBase} style={{ background: tileBg }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} logo`}
        onError={advance}
        className="h-[70%] w-[70%] object-contain"
        draggable={false}
      />
    </div>
  )
}
