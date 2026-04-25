"use client"

import { CometCard } from "@/components/ui/comet-card"
import { HERO_COPY } from "@/lib/data/hero-copy"

type PhotoCardProps = {
  src?: string
  alt?: string
  caption?: string
  className?: string
}

/**
 * Purpose: Portrait card using CometCard -- 3D perspective with a cursor-tracked
 *   accent glow. Dark footer strip carries the caption in mono type.
 * Args: src, alt, caption, className
 * Returns: CometCard-wrapped portrait with dark caption footer.
 */
export function PhotoCard({
  src = "/images/myprofile-3.jpg",
  alt = HERO_COPY.firstName + " " + HERO_COPY.lastName,
  caption = HERO_COPY.photoCaption,
  className = "",
}: PhotoCardProps) {
  return (
    <CometCard maxTilt={10} className={`w-full max-w-sm ${className}`}>
      <div
        className="overflow-hidden rounded-2xl border border-app"
        style={{ background: "#111114" }}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              background: "radial-gradient(ellipse at 30% 20%, var(--accent-soft), transparent 55%), radial-gradient(ellipse at 75% 90%, rgba(139,92,246,0.25), transparent 60%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
          />
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <span className="font-mono text-xs text-white/70 italic">{caption}</span>
          <span className="font-mono text-xs opacity-40" style={{ color: "var(--accent)" }}>
            #{HERO_COPY.firstName.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
    </CometCard>
  )
}
