"use client"

import { FLOATING_SKILLS, type Skill } from "@/lib/data/skills"

type SkillMarqueeProps = {
  /** Override items. Defaults to the non-cube skills catalog. */
  items?: readonly Skill[]
  /** Seconds per full cycle. Default 24. */
  durationSec?: number
  className?: string
}

/**
 * Purpose:
 *   Horizontal auto-scrolling marquee of skill chips. Duplicates its list
 *   so the `translateX(-50%)` loop is seamless. Edges fade via background
 *   gradients picked from the current surface color.
 *
 * Args:
 *   items       — skill list; falls back to shared SKILLS.
 *   durationSec — duration of one full cycle.
 *   className   — extra classes on the root.
 *
 * Returns:
 *   A horizontally scrolling list of pill-shaped skill chips.
 */
export function SkillMarquee({
  items = FLOATING_SKILLS,
  durationSec = 60,
  className = "",
}: SkillMarqueeProps) {
  return (
    <div className={`relative w-full overflow-hidden py-1 ${className}`}>
      {/* Edge fades (use --bg so they blend regardless of theme) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8"
        style={{ background: "linear-gradient(to right, var(--bg), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8"
        style={{ background: "linear-gradient(to left, var(--bg), transparent)" }}
      />

      <div
        className="flex w-max gap-3"
        style={{ animation: `marquee ${durationSec}s linear infinite` }}
      >
        {[...items, ...items].map((s, i) => (
          <span
            key={`${s.label}-${i}`}
            className="flex items-center gap-2 rounded-full border border-app bg-[var(--glass)] px-4 py-1.5 text-xs font-medium text-muted backdrop-blur-md"
          >
            {/* Decorative icons from external CDN — plain <img> is fine here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" className="h-4 w-4" />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}