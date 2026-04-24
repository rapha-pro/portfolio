"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { HERO_COPY } from "@/lib/data/hero-copy"

type PhotoCardProps = {
  /** Photo URL. Defaults to the bundled profile photo. */
  src?: string
  /** Alt text. */
  alt?: string
  /** Caption shown in a floating glass chip near the bottom. */
  caption?: string
  className?: string
}

/**
 * Purpose:
 *   Portrait card with a 3D cursor tilt. The provided photo is rendered
 *   full-bleed inside the tilt/glass frame; a soft accent wash sits above
 *   the image as ambient lighting, and a glass chip carries the caption.
 *
 * Args:
 *   src       — image URL (default: bundled profile photo).
 *   alt       — alt text for the image.
 *   caption   — caption string rendered in the bottom chip.
 *   className — extra classes on the outer wrapper.
 *
 * Returns:
 *   A TiltCard > GlassCard composition containing the full-bleed portrait.
 */
export function PhotoCard({
  src = "/images/myprofile-3.jpg",
  alt = `${HERO_COPY.firstName} ${HERO_COPY.lastName}`,
  caption = HERO_COPY.photoCaption,
  className = "",
}: PhotoCardProps) {
  return (
    <TiltCard className={`w-full max-w-sm ${className}`}>
      <GlassCard hover={false} className="p-2">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
          {/* The photo, full-bleed */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          {/* Ambient accent lighting — blends with the portrait */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, var(--accent-soft), transparent 55%), radial-gradient(ellipse at 75% 90%, rgba(139,92,246,0.25), transparent 60%)",
            }}
          />

          {/* Subtle vignette for readability of the caption chip */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
            }}
          />

          {/* Floating caption chip */}
          <div className="absolute bottom-3 left-3 right-3">
            <GlassCard hover={false} className="px-3 py-2">
              <p className="text-center text-xs italic text-muted">{caption}</p>
            </GlassCard>
          </div>
        </div>
      </GlassCard>
    </TiltCard>
  )
}
