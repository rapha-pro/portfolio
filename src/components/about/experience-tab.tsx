"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

import { GlassCard } from "@/components/ui/glass-card"
import { EXPERIENCE, type ExperienceEntry } from "@/lib/data/experience"
import { CompanyLogo } from "./company-logo"

/**
 * Purpose:
 *   Vertical timeline of employment history with a zig-zag layout on desktop.
 *   Even-indexed entries sit LEFT of the center rail; odd-indexed sit RIGHT —
 *   creating the alternating visual from the design reference. On smaller
 *   screens the layout collapses to a single-column stack with the rail on
 *   the left, matching the mobile convention used across the site.
 *
 * Returns:
 *   A <section> containing the ordered timeline of jobs.
 */
export function ExperienceTab() {
  return (
    <section aria-label="Experience" className="relative mx-auto w-full max-w-4xl">
      {/* Desktop: center rail */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 md:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--border-app) 8%, var(--border-app) 92%, transparent)",
        }}
      />
      {/* Mobile: left rail */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-4 top-0 bottom-0 w-px md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--border-app) 8%, var(--border-app) 92%, transparent)",
        }}
      />

      <ol className="relative flex flex-col gap-10 md:gap-14">
        {EXPERIENCE.map((job, i) => (
          <ExperienceRow key={`${job.company}-${i}`} job={job} index={i} />
        ))}
      </ol>
    </section>
  )
}

type ExperienceRowProps = {
  job: ExperienceEntry
  index: number
}

/**
 * Purpose:
 *   One job entry rendered in the correct column of the zig-zag.
 *   On desktop: uses a 3-column grid [card | node | card] where only one
 *   card slot is filled per row. On mobile: a simple left-padded single column.
 *
 * Args:
 *   job   — the experience entry to render.
 *   index — position in the list; determines left (even) vs right (odd).
 *
 * Returns:
 *   A positioned <li> row.
 */
function ExperienceRow({ job, index }: ExperienceRowProps) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" })
  const isLeft = index % 2 === 0

  const card = <ExperienceCard job={job} inView={inView} slideFrom={isLeft ? -40 : 40} />

  return (
    <li ref={ref} className="relative">
      {/* ── Mobile: single column, left rail ─────────────────────────────── */}
      <div className="pl-10 md:hidden">
        {/* Mobile rail node */}
        <span
          aria-hidden
          className="absolute left-[9px] top-4 flex h-4 w-4 items-center justify-center rounded-full border border-app bg-[var(--bg)]"
        >
          <span
            className="h-2 w-2 rounded-full transition-shadow duration-500"
            style={{
              background: job.accent,
              boxShadow: inView ? `0 0 12px ${job.accent}` : "none",
            }}
          />
        </span>
        {card}
      </div>

      {/* ── Desktop: zig-zag, center rail ────────────────────────────────── */}
      {/*   grid-cols: [card-area | node-column | card-area]                 */}
      <div className="hidden md:grid md:grid-cols-[1fr_64px_1fr] md:items-start">
        {/* Left card slot */}
        <div className="pr-4">
          {isLeft && card}
        </div>

        {/* Center node — always rendered, contains company initial + period */}
        <CenterNode job={job} inView={inView} />

        {/* Right card slot */}
        <div className="pl-4">
          {!isLeft && card}
        </div>
      </div>
    </li>
  )
}

type CardProps = {
  job: ExperienceEntry
  inView: boolean
  slideFrom: number
}

/**
 * Purpose:
 *   The glass card content for a single job entry. Shared between mobile and
 *   desktop layouts. Slides in from `slideFrom` px on first viewport entry.
 *
 * Args:
 *   job       — the experience entry.
 *   inView    — whether the row has entered the viewport.
 *   slideFrom — horizontal offset to animate from (negative = left).
 *
 * Returns:
 *   An animated GlassCard with company logo, role info, and bullet points.
 */
function ExperienceCard({ job, inView, slideFrom }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: slideFrom }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard className="p-5 md:p-6">
        <header className="flex flex-wrap items-start gap-4">
          <CompanyLogo
            name={job.company}
            localSrc={job.logo}
            simpleIconSlug={companySlug(job.company)}
            lightBg={job.lightLogoBg}
            bgOverride={job.bgOverride}
            accent={job.accent}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-semibold text-brand md:text-xl">
                {job.company}
              </h3>
              <span
                className="rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest"
                style={{
                  color: job.accent,
                  borderColor: `${job.accent}55`,
                  background: `${job.accent}10`,
                }}
              >
                {job.kind}
              </span>
            </div>
            <p className="mt-0.5 text-sm font-medium text-muted">{job.role}</p>
            <p className="mt-0.5 text-xs text-subtle">
              {job.location} · {job.period}
            </p>
          </div>
        </header>

        <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted">
          {job.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span
                aria-hidden
                className="mt-[9px] h-1 w-1 flex-none rounded-full"
                style={{ background: job.accent }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  )
}

type CenterNodeProps = {
  job: ExperienceEntry
  inView: boolean
}

/**
 * Purpose:
 *   The center rail node on desktop. Displays the company's first letter in
 *   an accent-tinted circle positioned on the rail line, with the job period
 *   shown below. Glows when the row enters the viewport.
 *
 * Args:
 *   job    — the experience entry (provides accent color, company name, period).
 *   inView — whether the row has entered the viewport (drives the glow).
 *
 * Returns:
 *   A flex column centering the glowing circle + period label on the rail.
 */
function CenterNode({ job, inView }: CenterNodeProps) {
  return (
    <div className="flex flex-col items-center pt-5">
      <div
        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2"
        style={{
          borderColor: `${job.accent}88`,
          background: `${job.accent}18`,
          boxShadow: inView ? `0 0 18px ${job.accent}55` : "none",
          transition: "box-shadow 450ms ease-out",
        }}
      >
        <span className="text-sm font-bold" style={{ color: job.accent }}>
          {job.company.trim().charAt(0).toUpperCase()}
        </span>
      </div>
      <time
        className="mt-2 max-w-[56px] text-center text-[10px] font-mono leading-tight text-subtle"
      >
        {job.period}
      </time>
    </div>
  )
}

/**
 * Purpose:
 *   Maps a human company name to its Simple Icons CDN slug. Returns undefined
 *   when no public mark exists, skipping the CDN step and going straight to
 *   the monogram fallback.
 *
 * Args:
 *   company — company display name.
 *
 * Returns:
 *   Simple Icons slug string, or undefined.
 */
function companySlug(company: string): string | undefined {
  const map: Record<string, string> = {
    ford: "ford",
    caterpillar: "caterpillar",
    "mcdonald's": "mcdonalds",
    mcdonalds: "mcdonalds",
    "td bank": "tdbank",
    td: "tdbank",
    // Elections Canada has no Simple Icons entry; local logo is preferred
  }
  return map[company.trim().toLowerCase()]
}
