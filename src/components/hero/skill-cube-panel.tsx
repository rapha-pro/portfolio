"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { SkillCube } from "@/components/three/skill-cube"
import { SKILLS } from "@/lib/data/skills"

type SkillCubePanelProps = {
  className?: string
}

/**
 * Purpose:
 *   Hero-only wrapper that frames the <SkillCube /> inside a GlassCard,
 *   with a caption and a row of skill chips underneath. Keeps the cube
 *   component itself pure/reusable; this file owns the hero styling.
 *
 * Args:
 *   className — extra classes on the wrapping GlassCard.
 *
 * Returns:
 *   A GlassCard hosting the 3D cube + a small skill chip summary.
 */
export function SkillCubePanel({ className = "" }: SkillCubePanelProps) {
  return (
    <GlassCard
      className={`flex w-full max-w-xs flex-col items-center gap-3 p-5 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-subtle">
        Best skills in
      </p>

      <SkillCube skills={SKILLS} size={220} />

      <div className="flex flex-wrap justify-center gap-1.5">
        {SKILLS.map((s) => (
          <span
            key={s.label}
            className="rounded-full border border-app px-2.5 py-0.5 text-[10px] font-medium text-muted"
          >
            {s.label}
          </span>
        ))}
      </div>
    </GlassCard>
  )
}
