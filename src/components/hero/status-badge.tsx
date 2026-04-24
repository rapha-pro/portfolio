"use client"

import { Sparkles } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

type StatusBadgeProps = {
  /** Short status line. Default "Open to opportunities". */
  label?: string
  className?: string
}

/**
 * Purpose:
 *   Compact "availability" chip that sits at the top of the hero. Uses a
 *   small GlassCard shell with a pulsing accent-colored sparkle.
 *
 * Args:
 *   label     — status text (auto-uppercased via CSS).
 *   className — extra classes on the card.
 *
 * Returns:
 *   A GlassCard chip.
 */
export function StatusBadge({
  label = "Open to opportunities",
  className = "",
}: StatusBadgeProps) {
  return (
    <GlassCard
      hover={false}
      className={`inline-flex w-fit items-center gap-2 px-4 py-2 ${className}`}
    >
      <Sparkles size={14} className="text-accent" />
      <span className="text-xs font-medium uppercase tracking-widest text-muted">
        {label}
      </span>
    </GlassCard>
  )
}
