"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

import { GlassCard } from "@/components/ui/glass-card"
import {
  SCHOOLS,
  YEARS,
  type School,
  type YearKey,
} from "@/lib/data/education"
import { CompanyLogo } from "./company-logo"
import { CourseCard } from "./course-card"

/**
 * Purpose:
 *   The Education tab. Renders the Schools stack at the top and a
 *   Year-selector + Courses grid below. Year switching uses a shared
 *   `layoutId` pill to slide under the active year, and AnimatePresence
 *   to crossfade the grid.
 *
 * Returns:
 *   A section with two subsections: Schools and Courses-by-Year.
 */
export function EducationTab() {
  const [activeYear, setActiveYear] = useState<YearKey>(YEARS[0]?.key ?? "freshman")
  const active = YEARS.find((y) => y.key === activeYear) ?? YEARS[0]

  return (
    <section aria-label="Education" className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      {/* Schools */}
      <div className="flex flex-col gap-4">
        {SCHOOLS.map((s) => (
          <SchoolCard key={s.name} school={s} />
        ))}
      </div>

      {/* Year selector */}
      <div className="flex flex-col gap-6">
        <header className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-xl font-semibold text-brand">
            Courses — year by year
          </h3>
          <p className="text-xs text-subtle">
            Hover a card (or tap, on mobile) to reveal the grade.
          </p>
        </header>

        <div className="flex w-full justify-start overflow-x-auto">
          <div
            role="tablist"
            aria-label="Academic year"
            className="flex items-center gap-1 rounded-xl border border-app bg-[var(--glass)] p-1 backdrop-blur-md"
          >
            {YEARS.map((y) => {
              const isActive = y.key === active?.key
              return (
                <button
                  key={y.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveYear(y.key)}
                  className={`
                    relative inline-flex flex-col items-start rounded-lg px-3 py-1.5 text-left
                    transition-colors duration-200
                    ${isActive ? "text-white" : "text-muted hover:text-brand"}
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                  `}
                >
                  {isActive && (
                    <motion.span
                      layoutId="about-year-active"
                      className="absolute inset-0 -z-10 rounded-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent), #6d28d9)",
                      }}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="text-[13px] font-semibold leading-tight">
                    {y.label}
                  </span>
                  <span
                    className={`text-[10px] font-mono tracking-wider ${
                      isActive ? "text-white/75" : "text-subtle"
                    }`}
                  >
                    {y.period}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Course grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {active?.courses.map((c) => (
              <CourseCard key={c.code} course={c} inProgress={active.inProgress} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

/**
 * Purpose:
 *   A single school card in the top stack. Uses CompanyLogo for consistent
 *   logo fallback behaviour.
 *
 * Args:
 *   school — the school record.
 *
 * Returns:
 *   A GlassCard row with logo + school details.
 */
function SchoolCard({ school }: { school: School }) {
  return (
    <GlassCard className="p-5 md:p-6">
      <div className="flex flex-wrap items-start gap-4">
        <CompanyLogo
          name={school.name}
          localSrc={school.logo}
          lightBg={school.lightLogoBg}
          sizeClass="h-16 w-16"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-lg font-semibold text-brand md:text-xl">
              {school.name}
            </h3>
            {school.result && (
              <span
                className="rounded-full border px-3 py-0.5 text-[11px] font-mono uppercase tracking-widest text-accent"
                style={{
                  borderColor: "var(--accent)",
                  background: "var(--accent-soft)",
                }}
              >
                {school.result}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm font-medium text-muted">
            {school.degree}
          </p>
          <p className="mt-0.5 text-xs text-subtle">
            {school.location} · {school.period}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {school.description}
          </p>
        </div>
      </div>
    </GlassCard>
  )
}
