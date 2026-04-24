"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { HERO_COPY } from "@/lib/data/hero-copy"

type BioCardProps = {
  className?: string
}

/**
 * Purpose:
 *   Short paragraph block summarizing who I am and what I do. Wrapped in
 *   a GlassCard to lift it above the background.
 *
 * Args:
 *   className — extra classes on the card wrapper.
 *
 * Returns:
 *   A GlassCard with 4 paragraphs + a small call-out line.
 */
export function BioCard({ className = "" }: BioCardProps) {
  const [p1, p2, p3, p4] = HERO_COPY.bio

  return (
    <GlassCard className={`p-5 ${className}`}>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted">
        <p>
          {p1}{" "}
          <strong className="font-semibold italic text-brand">
            {HERO_COPY.firstName}.
          </strong>
        </p>
        <p>{p2}</p>
        <p>{p3}</p>
        <p>{p4}</p>
        <p className="pt-1">
          Feel free to reach out in the{" "}
          <a
            href="#contact"
            className="text-accent underline underline-offset-2 hover:opacity-80"
          >
            Contact section
          </a>{" "}
          if you&apos;d like to collaborate or hire.
        </p>
      </div>
    </GlassCard>
  )
}
