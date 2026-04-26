"use client"

import { getTechLogo } from "@/lib/tech-logo"

type TechBadgeProps = {
  /** Technology display name, e.g. "React" or "PyTorch". */
  name: string
  /**
   * When true, a 16x16 logo image is prepended to the name.
   * Defaults to true. Pass false for compact card chips where logos would be cluttered.
   */
  showLogo?: boolean
}

/**
 * Purpose:
 *   A technology chip with an optional logo image on the left.
 *   Logo is looked up via getTechLogo(); when none is found the chip renders
 *   text-only so it always looks intentional rather than broken.
 *
 * Args:
 *   name:     technology display name (e.g. "React", "PyTorch").
 *   showLogo: whether to prepend a logo image (default true).
 *
 * Returns:
 *   A pill-shaped badge with optional logo and name.
 */
export function TechBadge({ name, showLogo = true }: TechBadgeProps) {
  const logoSrc = showLogo ? getTechLogo(name) : undefined

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-mono"
      style={{
        borderColor: "var(--glass-border, rgba(255,255,255,0.08))",
        background: "var(--glass)",
        color: "var(--fg-muted)",
      }}
    >
      {logoSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt=""
          aria-hidden
          width={16}
          height={16}
          className="h-4 w-4 object-contain"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.display = "none"
          }}
        />
      )}
      {name}
    </span>
  )
}
