"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

import { GlassCard } from "@/components/ui/glass-card"
import { TiltCard } from "@/components/ui/tilt-card"
import {
  NARRATIVE,
  type NarrativeBlock,
  type NarrativePhotoBlock,
  type NarrativeProseBlock,
} from "@/lib/data/narrative"

type NarrativeTimelineProps = {
  /** Override the default story (defaults to shared NARRATIVE). */
  blocks?: readonly NarrativeBlock[]
  className?: string
}

/**
 * Purpose:
 *   DeepMind-style alternating-side story timeline. Each block (prose or
 *   photo) occupies a full row; consecutive blocks flip to the opposite
 *   side so the eye zig-zags down a soft vertical rail. Rail nodes glow
 *   when their block enters the viewport.
 *
 * Args:
 *   blocks    — ordered story blocks. Defaults to NARRATIVE.
 *   className — extra classes on the root wrapper.
 *
 * Returns:
 *   A vertical sequence of alternating-side rows with a center rail.
 */
export function NarrativeTimeline({
  blocks = NARRATIVE,
  className = "",
}: NarrativeTimelineProps) {
  return (
    <div className={`relative mx-auto w-full max-w-5xl ${className}`}>
      {/* Center rail (hidden on mobile, where blocks stack single-column) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 md:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--border-app) 10%, var(--border-app) 90%, transparent)",
        }}
      />

      <ol className="relative flex flex-col gap-10 md:gap-16">
        {blocks.map((block, i) => (
          <NarrativeRow key={i} block={block} side={i % 2 === 0 ? "left" : "right"} />
        ))}
      </ol>
    </div>
  )
}

type RowProps = {
  block: NarrativeBlock
  side: "left" | "right"
}

/**
 * Purpose:
 *   A single row of the narrative timeline. Places its content on the
 *   given side on medium+ screens, fades/slides in from that side on first
 *   viewport entry, and renders the rail node on the center axis.
 *
 * Args:
 *   block — prose or photo payload.
 *   side  — which half of the rail the card sits on.
 *
 * Returns:
 *   A two-column <li> row (stacks on mobile).
 */
function NarrativeRow({ block, side }: RowProps) {
  const rowRef = useRef<HTMLLIElement>(null)
  const inView = useInView(rowRef, { once: true, margin: "-20% 0px -20% 0px" })

  const slideFrom = side === "left" ? -60 : 60

  return (
    <li
      ref={rowRef}
      className="relative grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-10"
    >
      {/* Rail node */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 hidden h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-app bg-[var(--bg)] md:flex"
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: "var(--accent)",
            boxShadow: inView ? "0 0 12px var(--accent-glow)" : "none",
            transition: "box-shadow 450ms ease-out",
          }}
        />
      </span>

      {/* The card — placed on the correct side at md+ */}
      <div
        className={
          side === "left"
            ? "md:col-start-1 md:pr-8"
            : "md:col-start-2 md:pl-8"
        }
      >
        <motion.div
          initial={{ opacity: 0, x: slideFrom, y: 24 }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {block.kind === "prose" ? (
            <ProseBlock block={block} />
          ) : (
            <PhotoBlock block={block} />
          )}
        </motion.div>
      </div>
    </li>
  )
}

/** Renders the text-only narrative block. */
function ProseBlock({ block }: { block: NarrativeProseBlock }) {
  return (
    <GlassCard className="p-5 md:p-6">
      {block.kicker && (
        <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.18em] text-accent">
          {block.kicker}
        </p>
      )}
      {block.heading && (
        <h3 className="mb-3 text-lg font-semibold text-brand md:text-xl">
          {block.heading}
        </h3>
      )}
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted md:text-[15px]">
        {block.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </GlassCard>
  )
}

/** Renders the photo + caption narrative block, with a gentle tilt. */
function PhotoBlock({ block }: { block: NarrativePhotoBlock }) {
  return (
    <TiltCard max={6}>
      <GlassCard hover={false} className="p-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
            }}
          />
        </div>
        <p className="px-3 pb-1 pt-3 text-center text-xs italic text-muted">
          {block.caption}
        </p>
      </GlassCard>
    </TiltCard>
  )
}
