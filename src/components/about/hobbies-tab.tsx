"use client"

import { motion } from "framer-motion"

import { TiltCard } from "@/components/ui/tilt-card"
import { GlassCard } from "@/components/ui/glass-card"
import { HOBBIES, type Hobby } from "@/lib/data/hobbies"

/**
 * Purpose:
 *   The Hobbies tab. A responsive card grid — each hobby is an optional image
 *   plus a short personal story with a subtle tilt and accent header. When a
 *   `videoSrc` is added to a hobby, the card renders a muted autoplay loop in
 *   place of the image. Omitting both `imageSrc` and `videoSrc` hides the
 *   media block entirely (graceful no-image state).
 *
 * Returns:
 *   A grid of hobby cards.
 */
export function HobbiesTab() {
  return (
    <section
      aria-label="Hobbies"
      className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2"
    >
      {HOBBIES.map((h, i) => (
        <HobbyCard key={h.title} hobby={h} delay={i * 0.06} />
      ))}
    </section>
  )
}

/**
 * Purpose:
 *   One hobby card. Uses a gentle tilt, a glass frame, a header strip tinted
 *   with the hobby's accent, an optional image or looping video, and a short
 *   story paragraph. The media block is omitted gracefully when neither
 *   `imageSrc` nor `videoSrc` is supplied.
 *
 * Args:
 *   hobby — hobby payload from HOBBIES.
 *   delay — stagger delay in seconds for the entry animation.
 *
 * Returns:
 *   A motion-wrapped tilt + glass card.
 */
function HobbyCard({ hobby, delay }: { hobby: Hobby; delay: number }) {
  const hasMedia = Boolean(hobby.videoSrc ?? hobby.imageSrc)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard max={6}>
        <GlassCard hover={false} className="overflow-hidden p-0">
          {/* Accent header strip */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: `linear-gradient(135deg, ${hobby.accent}18, transparent 70%)`,
              borderBottom: `1px solid ${hobby.accent}33`,
            }}
          >
            <span
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
              style={{
                background: `${hobby.accent}22`,
                border: `1px solid ${hobby.accent}55`,
              }}
            >
              {hobby.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-base font-semibold text-brand">
                {hobby.title}
              </h4>
              <p className="truncate text-[11px] font-mono uppercase tracking-wider text-subtle">
                {hobby.meta}
              </p>
            </div>
          </div>

          {/* Media — only rendered when imageSrc or videoSrc is provided */}
          {hasMedia && (
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {hobby.videoSrc ? (
                <video
                  src={hobby.videoSrc}
                  poster={hobby.imageSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={hobby.imageSrc}
                  alt={hobby.imageAlt ?? hobby.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                  draggable={false}
                />
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 40%)",
                }}
              />
            </div>
          )}

          {/* Story */}
          <p className="px-4 py-4 text-sm leading-relaxed text-muted">
            {hobby.story}
          </p>
        </GlassCard>
      </TiltCard>
    </motion.div>
  )
}
