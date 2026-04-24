"use client"

import { motion } from "framer-motion"

import { GlassCard } from "@/components/ui/glass-card"
import {
  ACTIVITIES,
  AWARDS,
  type Activity,
  type Award,
} from "@/lib/data/achievements"
import { IconSparkles, IconTrophy } from "./tab-switcher"

/**
 * Purpose:
 *   The Achievements tab. Two vertical rails — awards on the left, activities
 *   on the right — each item fading up as it enters the viewport.
 *
 * Returns:
 *   A two-column <section>.
 */
export function AchievementsTab() {
  return (
    <section
      aria-label="Achievements and activities"
      className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2"
    >
      <RailColumn
        title="Awards"
        icon={<IconTrophy />}
        tint="#F59E0B"
      >
        {AWARDS.map((a, i) => (
          <AwardRow key={`${a.title}-${i}`} award={a} tint="#F59E0B" delay={i * 0.08} />
        ))}
      </RailColumn>

      <RailColumn
        title="Activities"
        icon={<IconSparkles />}
        tint="#22D3EE"
      >
        {ACTIVITIES.map((a, i) => (
          <ActivityRow key={`${a.title}-${i}`} activity={a} tint="#22D3EE" delay={i * 0.08} />
        ))}
      </RailColumn>
    </section>
  )
}

/** Column heading + vertical rail wrapper. */
function RailColumn({
  title,
  icon,
  tint,
  children,
}: {
  title: string
  icon: React.ReactNode
  tint: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{
            color: tint,
            background: `${tint}18`,
            border: `1px solid ${tint}55`,
          }}
        >
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-brand">{title}</h3>
      </header>

      <ol className="relative flex flex-col gap-5 pl-6">
        <span
          aria-hidden
          className="pointer-events-none absolute left-[11px] top-0 bottom-0 w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--border-app) 8%, var(--border-app) 92%, transparent)",
          }}
        />
        {children}
      </ol>
    </div>
  )
}

function AwardRow({
  award,
  tint,
  delay,
}: {
  award: Award
  tint: string
  delay: number
}) {
  return (
    <RailRow tint={tint} delay={delay}>
      <GlassCard className="p-4 md:p-5">
        <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h4 className="text-base font-semibold text-brand">{award.title}</h4>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest"
            style={{
              color: tint,
              background: `${tint}18`,
              border: `1px solid ${tint}55`,
            }}
          >
            {award.period}
          </span>
        </header>
        <p className="mt-0.5 text-xs text-subtle">{award.organization}</p>
        {award.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {award.description}
          </p>
        )}
      </GlassCard>
    </RailRow>
  )
}

function ActivityRow({
  activity,
  tint,
  delay,
}: {
  activity: Activity
  tint: string
  delay: number
}) {
  return (
    <RailRow tint={tint} delay={delay}>
      <GlassCard className="p-4 md:p-5">
        <header className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h4 className="text-base font-semibold text-brand">
            {activity.title}
          </h4>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest"
            style={{
              color: tint,
              background: `${tint}18`,
              border: `1px solid ${tint}55`,
            }}
          >
            {activity.period}
          </span>
        </header>
        <p className="mt-0.5 text-xs text-subtle">{activity.organization}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {activity.description}
        </p>
      </GlassCard>
    </RailRow>
  )
}

/** Shared rail-node + motion wrapper for both lists. */
function RailRow({
  tint,
  delay,
  children,
}: {
  tint: string
  delay: number
  children: React.ReactNode
}) {
  return (
    <li className="relative">
      <span
        aria-hidden
        className="absolute left-[-18px] top-4 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-app bg-[var(--bg)]"
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: tint, boxShadow: `0 0 10px ${tint}` }}
        />
      </span>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </li>
  )
}
