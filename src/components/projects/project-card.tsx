"use client"

import { motion } from "framer-motion"
import { Globe, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { AnimatedGithub } from "@/components/ui/icons/animated-github"
import { AnimatedYoutube } from "@/components/ui/icons/animated-youtube"
import { type Project } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"

type ProjectCardProps = {
  project: Project
  index: number
}

/**
 * Purpose:
 *   Individual project card for the masonry gallery. The card itself is a
 *   <div role="link"> (not an <a>) so that the icon links inside it can be
 *   real <a> tags without triggering the "nested <a>" invalid-HTML error.
 *   Clicking anywhere on the card except an icon link triggers navigation.
 *
 * Args:
 *   project -- the project data entry.
 *   index   -- stagger offset for the scroll-in animation.
 *
 * Returns:
 *   An animated glass card.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const router = useRouter()

  const href = project.hasDetailPage
    ? `/projects/${project.slug}`
    : (project.liveUrl ?? project.githubUrl ?? project.videoUrl ?? "#")

  const isInternal = project.hasDetailPage

  function handleCardClick(e: React.MouseEvent<HTMLDivElement>) {
    // If the click landed on or inside a real anchor, let that anchor handle it
    if ((e.target as HTMLElement).closest("a")) return
    if (isInternal) {
      router.push(href)
    } else {
      window.open(href, "_blank", "noopener,noreferrer")
    }
  }

  function handleCardKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (isInternal) router.push(href)
      else window.open(href, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
      className="mb-6"
    >
      <div
        role="link"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleCardKey}
        className="group block cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        aria-label={project.title}
      >
        <div className="relative overflow-hidden rounded-2xl border border-app bg-[var(--glass)] backdrop-blur-sm transition-all duration-500 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_0_1px_var(--accent),0_8px_40px_var(--accent-glow)]">

          {/* Image area */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: project.featured ? "16/9" : "4/3" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              draggable={false}
            />
            {/* Bottom vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }}
            />
            {/* Period badge -- top right */}
            <div className="absolute right-3 top-3">
              <span
                className="rounded-full border px-2.5 py-0.5 text-[10px] font-mono backdrop-blur-md"
                style={{
                  borderColor: "var(--glass-border)",
                  background: "var(--glass-strong)",
                  color: "var(--fg-muted)",
                }}
              >
                {project.period} &bull; {project.context}
              </span>
            </div>
            {/* Glass ExternalLink badge -- bottom right, appears on hover */}
            <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md border backdrop-blur-md"
                style={{
                  borderColor: "rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.15)",
                }}
              >
                <ExternalLink size={13} className="text-white" />
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="flex flex-col gap-3 p-4 md:p-5">
            {/* Title + link icons -- icons are real <a> tags, safe here since card is a <div> */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold leading-snug text-brand transition-colors duration-300 group-hover:text-[color:var(--accent)] md:text-lg">
                {project.title}
              </h3>
              <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                {project.liveUrl && (
                  <IconLink href={project.liveUrl} label="Live site">
                    <Globe size={14} />
                  </IconLink>
                )}
                {project.githubUrl && (
                  <IconLink href={project.githubUrl} label="GitHub">
                    <AnimatedGithub size={14} />
                  </IconLink>
                )}
                {project.videoUrl && (
                  <IconLink href={project.videoUrl} label="Video demo">
                    <AnimatedYoutube size={14} />
                  </IconLink>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="line-clamp-3 text-sm leading-relaxed text-muted">
              {project.description}
            </p>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <TechBadge key={t} name={t} showLogo={false} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/** Small icon link -- a real <a> tag; safe because the card wrapper is a <div>. */
function IconLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-6 w-6 items-center justify-center rounded-md border border-app bg-[var(--glass)] text-muted transition-colors duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
    >
      {children}
    </a>
  )
}
