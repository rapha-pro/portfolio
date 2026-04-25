"use client"

import { motion } from "framer-motion"
import { PROJECTS } from "@/lib/data/projects"
import { ProjectCard } from "./project-card"

/**
 * Purpose:
 *   The full Projects section. Renders a section header then a responsive
 *   masonry-columns gallery of ProjectCards. Three columns on desktop,
 *   two on tablet, one on mobile.
 *
 * Returns:
 *   A <section id="projects"> ready to drop into the page layout.
 */
export function ProjectsSection() {
  return (
    <section id="projects" className="relative mx-auto w-full max-w-7xl px-6 py-24">
      {/* Section header */}
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
        <h2 className="text-4xl font-bold text-brand md:text-5xl">Projects</h2>
        <div
          aria-hidden
          className="mx-auto mt-4 h-px w-24"
          style={{
            background: "linear-gradient(to right, transparent, var(--accent), transparent)",
          }}
        />
      </motion.div>

      {/* Masonry gallery */}
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
