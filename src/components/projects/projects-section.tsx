"use client"

import { getSortedProjects } from "@/lib/data/projects"
import { ProjectCard } from "@/components/projects/project-card"
import { DraggableCardBody } from "@/components/ui/draggable-card"

/**
 * Purpose:
 *   Distributes items into n columns round-robin (row-first order).
 *   Item 0 -> col 0, item 1 -> col 1, ..., item n -> col 0, etc.
 *   This ensures the highest-priority projects land in the first row,
 *   not stacked at the top of column 0.
 *
 * Args:
 *   items: readonly array to distribute.
 *   n:     number of columns.
 *
 * Returns:
 *   Array of n arrays, each containing the items for that column.
 */
function toColumns<T>(items: readonly T[], n: number): T[][] {
  const cols: T[][] = Array.from({ length: n }, () => [])
  items.forEach((item, i) => cols[i % n].push(item))
  return cols
}

/**
 * Purpose:
 *   Projects section with a responsive masonry grid.
 *   Each card is wrapped in DraggableCardBody so it can be freely dragged
 *   via CSS transforms without leaving the grid flow.
 *   Layouts: 1 col (mobile) | 2 cols (tablet) | 3 cols (desktop).
 *
 * Returns:
 *   A <section id="projects"> with the sorted, draggable project grid.
 */
export function ProjectsSection() {
  const projects = getSortedProjects()

  return (
    <section id="projects" className="mx-auto w-full max-w-6xl px-6 py-24">
      <h2 className="mb-10 text-3xl font-bold text-brand md:text-4xl">Projects</h2>

      {/* 1 column -- mobile */}
      <div className="flex flex-col sm:hidden">
        {projects.map((p, i) => (
          <DraggableCardBody key={p.slug}>
            <ProjectCard project={p} index={i} />
          </DraggableCardBody>
        ))}
      </div>

      {/* 2 columns -- tablet */}
      <div className="hidden gap-6 sm:flex lg:hidden">
        {toColumns(projects, 2).map((col, ci) => (
          <div key={ci} className="flex flex-1 flex-col">
            {col.map((p, i) => (
              <DraggableCardBody key={p.slug}>
                <ProjectCard project={p} index={ci + i * 2} />
              </DraggableCardBody>
            ))}
          </div>
        ))}
      </div>

      {/* 3 columns -- desktop */}
      <div className="hidden gap-6 lg:flex">
        {toColumns(projects, 3).map((col, ci) => (
          <div key={ci} className="flex flex-1 flex-col">
            {col.map((p, i) => (
              <DraggableCardBody key={p.slug}>
                <ProjectCard project={p} index={ci + i * 3} />
              </DraggableCardBody>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
