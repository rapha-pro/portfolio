"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import type { Course } from "@/lib/data/education"

type CourseCardProps = {
  course: Course
  /** When true, the grade reveal is suppressed (e.g. senior year in progress). */
  inProgress?: boolean
}

/**
 * Purpose:
 *   Compact course card. Header row has the optional banner/logo + course
 *   code + title. Body holds the short description. A subtle "Show grade"
 *   pill toggles a flip to reveal the grade chip — works on click for
 *   touch devices and on hover on pointers.
 *
 * Args:
 *   course     — course payload (code, title, description, banner, accent).
 *   inProgress — true when the course is currently being taken.
 *
 * Returns:
 *   A motion.div card with accent-colored header.
 */
export function CourseCard({ course, inProgress = false }: CourseCardProps) {
  const [revealed, setRevealed] = useState(false)

  const canReveal = !inProgress && !!course.grade

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => canReveal && setRevealed(true)}
      onHoverEnd={() => canReveal && setRevealed(false)}
      onClick={() => canReveal && setRevealed((v) => !v)}
      className="group relative flex h-full cursor-default flex-col overflow-hidden rounded-2xl border border-app bg-[var(--glass)] backdrop-blur-md transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Accent header bar */}
      <div
        className="h-1 w-full"
        style={{ background: course.accent }}
      />

      {/* Title row */}
      <div className="flex items-center gap-3 px-4 pt-4">
        {course.banner ? (
          /* Course banner/logo — tiny thumbnail */
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={course.banner}
            alt=""
            className="h-10 w-10 flex-none rounded-lg object-cover"
            style={{
              boxShadow: `0 0 0 1px ${course.accent}33`,
            }}
          />
        ) : (
          <span
            aria-hidden
            className="flex h-10 w-10 flex-none items-center justify-center rounded-lg text-[10px] font-bold"
            style={{
              color: course.accent,
              background: `${course.accent}18`,
              border: `1px solid ${course.accent}55`,
            }}
          >
            {course.code.split(" ")[0]}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-[11px] font-mono uppercase tracking-[0.14em]"
            style={{ color: course.accent }}
          >
            {course.code}
          </p>
          <h4 className="truncate text-sm font-semibold text-brand">
            {course.title}
          </h4>
        </div>
      </div>

      {/* Description / language row */}
      <div className="flex flex-col gap-2 px-4 pb-4 pt-3">
        {course.language && (
          <p className="text-[11px] uppercase tracking-wider text-subtle">
            {course.language}
          </p>
        )}
        {course.description ? (
          <p className="text-xs leading-relaxed text-muted">
            {course.description}
          </p>
        ) : (
          <p className="text-xs italic text-subtle">
            Description coming soon.
          </p>
        )}
      </div>

      {/* Grade reveal chip (bottom strip) */}
      {canReveal && (
        <div className="mt-auto flex items-center justify-between border-t border-app px-4 py-2 text-xs">
          <span className="text-subtle">
            {revealed ? "Grade" : "Tap to reveal"}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold transition-opacity duration-300 ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
            style={{
              color: course.accent,
              background: `${course.accent}18`,
              border: `1px solid ${course.accent}55`,
            }}
          >
            {course.grade}
          </span>
        </div>
      )}

      {inProgress && (
        <div className="mt-auto flex items-center justify-between border-t border-app px-4 py-2 text-xs">
          <span className="text-subtle">Status</span>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold"
            style={{
              color: course.accent,
              background: `${course.accent}18`,
              border: `1px solid ${course.accent}55`,
            }}
          >
            In progress
          </span>
        </div>
      )}
    </motion.div>
  )
}
