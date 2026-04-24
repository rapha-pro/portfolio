"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import { HERO_COPY } from "@/lib/data/hero-copy"

type PhotoCardProps = {
  /** Optional photo URL. If omitted, a themed placeholder is rendered. */
  src?: string
  /** Alt text if a photo is supplied. */
  alt?: string
  /** Caption shown in a floating glass chip near the bottom. */
  caption?: string
  className?: string
}

/**
 * Purpose:
 *   Portrait card with a 3D cursor tilt and a glass chip caption. Accepts
 *   an optional `src` — without one, renders a subtle placeholder so the
 *   layout reads correctly even before the real photo is wired up.
 *
 * Args:
 *   src       — optional image URL.
 *   alt       — alt text for the image.
 *   caption   — caption string.
 *   className — extra classes on the outer wrapper.
 *
 * Returns:
 *   A TiltCard > GlassCard composition containing the portrait.
 */
export function PhotoCard({
  src,
  alt = "Portrait",
  caption = HERO_COPY.photoCaption,
  className = "",
}: PhotoCardProps) {
  return (
    <TiltCard className={`w-full max-w-xs ${className}`}>
      <GlassCard hover={false} className="p-3">
        <div
          className="relative aspect-[3/4] w-full overflow-hidden rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg) 100%)",
          }}
        >
          {/* Soft inner accent wash */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, var(--accent-soft), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.12), transparent 60%)",
            }}
          />

          {src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-subtle">
              <div className="h-20 w-20 rounded-full border border-app bg-[var(--glass)]" />
              <span className="text-xs">your photo here</span>
            </div>
          )}

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
