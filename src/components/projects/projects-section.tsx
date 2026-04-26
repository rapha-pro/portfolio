"use client"

import { motion } from "framer-motion"
import { getSortedProjects } from "@/lib/data/projects"
import { PROJECTS_COPY } from "@/lib/data/projects-copy"
import { ProjectCard } from "@/components/projects/project-card"
import { DraggableCardBody } from "@/components/ui/draggable-card"

/**
 * Purpose:
 *   Distributes items into n columns round-robin (row-first order).
 *   Item 0 goes to col 0, item 1 to col 1, ..., item n back to col 0.
 *   This ensures the highest-priority projects land in the first row
 *   rather than stacking at the top of column 0.
 *
 * Args:
 *   - items: readonly array to distribute.
 *   - n:     number of columns.
 *
 * Returns:
 *   Array of n sub-arrays, each containing the items for that column.
 */
/** Subtle per-card tilt angles (degrees). Cycles through for any number of cards. */
const TILTS = [-1.4, 0.8, -0.6, 1.2, -1.0, 0.5, -1.3, 0.9, -0.7]

function toColumns<T>(items: readonly T[], n: number): T[][] {
  const cols: T[][] = Array.from({ length: n }, () => [])
  items.forEach((item, i) => cols[i % n].push(item))
  return cols
}

/**
 * Purpose:
 *   Projects section with a responsive masonry grid. Each card is wrapped
 *   in DraggableCardBody so it can be freely dragged via CSS transforms
 *   without leaving the grid flow. A secret text is revealed behind the
 *   cards as users drag them away.
 *   Layouts: 1 col (mobile) | 2 cols (tablet) | 3 cols (desktop).
 *
 * Returns:
 *   A <section id="projects"> with a draggable card grid and a hidden
 *   message behind the cards.
 */
export function ProjectsSection() {
  const projects = getSortedProjects()

  return (
    <section id="projects" className="mx-auto w-full max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14 text-center"
      >
        <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-accent">
          What I&apos;ve built
        </p>
        <h2 className="text-4xl font-bold text-brand md:text-5xl">
          {PROJECTS_COPY.heading}
        </h2>
        <div
          aria-hidden
          className="mx-auto mt-4 h-px w-24"
          style={{
            background: "linear-gradient(to right, transparent, var(--accent), transparent)",
          }}
        />
        <p className="mt-4 text-sm text-muted">{PROJECTS_COPY.subheading}</p>
      </motion.div>

      {/* Relative wrapper so the secret text can be absolutely centered */}
      <div className="relative">

        {/* Secret text -- sits at z-0, revealed as cards are dragged away */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-8"
        >
          <p className="max-w-sm text-center text-3xl font-black leading-snug text-neutral-300 dark:text-neutral-700 md:text-4xl">
            {PROJECTS_COPY.secretText}
          </p>
        </div>

        {/* Card grids -- z-10 so they sit above the secret text */}
        <div className="relative z-10">

          {/* 1 column -- mobile */}
          <div className="flex flex-col sm:hidden">
            {projects.map((p, i) => (
              <DraggableCardBody key={p.slug} style={{ rotate: TILTS[i % TILTS.length] }}>
                <ProjectCard project={p} index={i} />
              </DraggableCardBody>
            ))}
          </div>

          {/* 2 columns -- tablet */}
          <div className="hidden gap-6 sm:flex lg:hidden">
            {toColumns(projects, 2).map((col, ci) => (
              <div key={ci} className="flex flex-1 flex-col">
                {col.map((p, i) => {
                  const idx = ci + i * 2
                  return (
                    <DraggableCardBody key={p.slug} style={{ rotate: TILTS[idx % TILTS.length] }}>
                      <ProjectCard project={p} index={idx} />
                    </DraggableCardBody>
                  )
                })}
              </div>
            ))}
          </div>

          {/* 3 columns -- desktop */}
          <div className="hidden gap-6 lg:flex">
            {toColumns(projects, 3).map((col, ci) => (
              <div key={ci} className="flex flex-1 flex-col">
                {col.map((p, i) => {
                  const idx = ci + i * 3
                  return (
                    <DraggableCardBody key={p.slug} style={{ rotate: TILTS[idx % TILTS.length] }}>
                      <ProjectCard project={p} index={idx} />
                    </DraggableCardBody>
                  )
                })}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
