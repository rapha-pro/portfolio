"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

import { GlassCard } from "@/components/ui/glass-card"
import { EXPERIENCE, type ExperienceEntry } from "@/lib/data/experience"
import { CompanyLogo } from "./company-logo"

/**
 * Purpose:
 *   Vertical timeline of employment history. Each entry is a glass card
 *   on the right of a center rail, with the company logo and a dot on the
 *   rail itself. Cards slide in as they enter the viewport.
 *
 * Returns:
 *   A <section> containing the ordered timeline of jobs.
 */
export function ExperienceTab() {
  return (
    <section aria-label="Experience" className="mx-auto w-full max-w-4xl">
      <ol className="relative flex flex-col gap-8 pl-4 md:pl-10">
        {/* Rail */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-4 top-0 bottom-0 w-px md:left-10"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--border-app) 8%, var(--border-app) 92%, transparent)",
          }}
        />
        {EXPERIENCE.map((job, i) => (
          <ExperienceRow key={`${job.company}-${i}`} job={job} />
        ))}
      </ol>
    </section>
  )
}

/**
 * Purpose:
 *   One job entry. Renders the rail node, the company logo tile, and the
 *   role/period/bullets inside a GlassCard. Entry animates in on scroll.
 *
 * Args:
 *   job — the experience entry to render.
 *
 * Returns:
 *   A positioned <li> row.
 */
function ExperienceRow({ job }: { job: ExperienceEntry }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" })

  return (
    <li ref={ref} className="relative pl-10 md:pl-14">
      {/* Rail node */}
      <span
        aria-hidden
        className="absolute left-[9px] top-4 flex h-4 w-4 items-center justify-center rounded-full border border-app bg-[var(--bg)] md:left-[33px]"
      >
        <span
          className="h-2 w-2 rounded-full transition-shadow duration-500"
          style={{
            background: job.accent,
            boxShadow: inView ? `0 0 12px ${job.accent}` : "none",
          }}
        />
      </span>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
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
    </li>
  )
}

/**
 * Purpose:
 *   Map a human company name to a Simple Icons CDN slug, used only as the
 *   fallback when a local logo image is missing or 404s. Returning
 *   undefined means "skip the CDN step and go straight to the monogram."
 *
 * Args:
 *   company — company display name.
 *
 * Returns:
 *   The Simple Icons slug, or undefined when no public mark exists.
 */
function companySlug(company: string): string | undefined {
  const map: Record<string, string> = {
    ford: "ford",
    caterpillar: "caterpillar",
    "mcdonald's": "mcdonalds",
    mcdonalds: "mcdonalds",
    "td bank": "tdbank",
    td: "tdbank",
  }
  return map[company.trim().toLowerCase()]
}
