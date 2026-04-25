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
 *   Groups an ordered list of narrative blocks into pairs — two blocks share
 *   each row. The first block of a pair occupies the left column, the second
 *   occupies the right. This eliminates whitespace: a photo always sits beside
 *   its matching prose instead of each block claiming a row alone.
 *
 * Args:
 *   blocks — the ordered block list to pair.
 *
 * Returns:
 *   Array of [left, right | null] tuples. The last pair has null on the right
 *   when the total block count is odd.
 */
function pairBlocks(
  blocks: readonly NarrativeBlock[]
): Array<[NarrativeBlock, NarrativeBlock | null]> {
  const pairs: Array<[NarrativeBlock, NarrativeBlock | null]> = []
  for (let i = 0; i < blocks.length; i += 2) {
    pairs.push([blocks[i], blocks[i + 1] ?? null])
  }
  return pairs
}

/**
 * Purpose:
 *   DeepMind-style paired story timeline. Consecutive blocks share a row —
 *   left column / right column — so photos always sit beside their matching
 *   prose and no half-empty rows appear. A center rail connects all rows;
 *   rail nodes glow when their pair enters the viewport.
 *
 *   On mobile, the two-column layout collapses and blocks stack vertically.
 *
 * Args:
 *   blocks    — ordered story blocks. Defaults to NARRATIVE.
 *   className — extra classes on the root wrapper.
 *
 * Returns:
 *   A vertical sequence of paired rows with a center rail.
 */
export function NarrativeTimeline({
  blocks = NARRATIVE,
  className = "",
}: NarrativeTimelineProps) {
  const pairs = pairBlocks(blocks)

  return (
    <div className={`relative mx-auto w-full max-w-5xl ${className}`}>
      {/* Center rail (md+) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 md:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--border-app) 10%, var(--border-app) 90%, transparent)",
        }}
      />

      <ol className="relative flex flex-col gap-12 md:gap-20">
        {pairs.map((pair, i) => (
          <NarrativeRow key={i} left={pair[0]} right={pair[1]} />
        ))}
      </ol>
    </div>
  )
}

type RowProps = {
  left: NarrativeBlock
  right: NarrativeBlock | null
}

/**
 * Purpose:
 *   A single paired row. Both blocks animate in from their respective sides
 *   when the row enters the viewport. The rail node glows on entry.
 *
 * Args:
 *   left  — block occupying the left column.
 *   right — block occupying the right column, or null (left-only row).
 *
 * Returns:
 *   A two-column <li> row (stacks on mobile).
 */
function NarrativeRow({ left, right }: RowProps) {
  const rowRef = useRef<HTMLLIElement>(null)
  const inView = useInView(rowRef, { once: true, margin: "-15% 0px -15% 0px" })

  return (
    <li
      ref={rowRef}
      className="relative grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12"
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

      {/* Left block */}
      <div className="md:pr-10">
        <BlockItem block={left} inView={inView} slideFrom={-60} />
      </div>

      {/* Right block — omitted gracefully on odd-count endings */}
      {right && (
        <div className="md:pl-10">
          <BlockItem block={right} inView={inView} slideFrom={60} />
        </div>
      )}
    </li>
  )
}

type BlockItemProps = {
  block: NarrativeBlock
  inView: boolean
  slideFrom: number
}

/**
 * Purpose:
 *   Wraps a prose or photo block in a shared slide-in animation. Delegates
 *   actual rendering to the typed sub-components below.
 *
 * Args:
 *   block     — the block to render.
 *   inView    — whether the parent row has entered the viewport.
 *   slideFrom — horizontal offset (px) to animate in from.
 *
 * Returns:
 *   An animated wrapper around the block content.
 */
function BlockItem({ block, inView, slideFrom }: BlockItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: slideFrom, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {block.kind === "prose" ? (
        <ProseBlock block={block} />
      ) : (
        <PhotoBlock block={block} />
      )}
    </motion.div>
  )
}

/**
 * Purpose:
 *   Renders the text-only narrative block. No card background — the text
 *   floats directly against the page so it visually pairs with its adjacent
 *   photo without competing surfaces.
 *
 * Args:
 *   block — the prose narrative block.
 *
 * Returns:
 *   Kicker + heading + paragraph stack.
 */
function ProseBlock({ block }: { block: NarrativeProseBlock }) {
  return (
    <div className="py-2">
      {block.kicker && (
        <p className="mb-2 text-[11px] font-mono uppercase tracking-[0.18em] text-accent">
          {block.kicker}
        </p>
      )}
      {block.heading && (
        <h3 className="mb-4 text-xl font-semibold text-brand md:text-2xl">
          {block.heading}
        </h3>
      )}
      <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted md:text-[15px]">
        {block.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  )
}

/**
 * Purpose:
 *   Renders the photo + caption narrative block inside a gentle tilt frame.
 *
 * Args:
 *   block — the photo narrative block.
 *
 * Returns:
 *   A TiltCard-wrapped image with caption.
 */
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
