import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Globe } from "lucide-react"
import { AnimatedGithub } from "@/components/ui/icons/animated-github"
import { AnimatedYoutube } from "@/components/ui/icons/animated-youtube"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"

type PageProps = {
  params: Promise<{ slug: string }>
}

/**
 * Purpose:
 *   Standard detail page for a project. Reads long-form copy from
 *   content/projects/{slug}.txt (paragraphs separated by blank lines).
 *   Falls back to project.description if the file doesn't exist.
 *
 *   Projects with customPage: true should have their own route at
 *   src/app/projects/{slug}/page.tsx -- Next.js will prefer the specific
 *   route over this dynamic one automatically. No code change needed here.
 *
 * Returns:
 *   Full-page layout or 404 if the slug is unknown / has no detail page.
 */
export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug && p.hasDetailPage)
  if (!project) notFound()

  const paragraphs = readDescriptionFile(slug) ?? [project.description]

  return (
    <main className="min-h-screen">
      {/* Hero image */}
      <div className="relative h-[55vh] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, var(--bg) 100%)",
          }}
        />
        <div className="absolute left-6 top-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/50"
          >
            <ArrowLeft size={15} />
            Back
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 pb-32 pt-10">
        <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-accent">
          {project.period} &bull; {project.context}
        </p>

        <h1 className="mb-6 text-4xl font-bold text-brand md:text-5xl">{project.title}</h1>

        {/* Link buttons */}
        {(project.githubUrl ?? project.liveUrl ?? project.videoUrl) && (
          <div className="mb-10 flex flex-wrap gap-3">
            {project.liveUrl && (
              <ExtLink href={project.liveUrl} icon={<Globe size={16} />} label="Live site" />
            )}
            {project.githubUrl && (
              <ExtLink href={project.githubUrl} icon={<AnimatedGithub size={16} />} label="GitHub" />
            )}
            {project.videoUrl && (
              <ExtLink href={project.videoUrl} icon={<AnimatedYoutube size={16} />} label="Watch demo" />
            )}
          </div>
        )}

        {/* Long description -- sourced from content/projects/{slug}.txt */}
        <div className="mb-12 flex flex-col gap-5">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-muted">
              {para}
            </p>
          ))}
        </div>

        {/* Tech stack */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-brand">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <TechBadge key={t} name={t} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 * Purpose:
 *   Reads content/projects/{slug}.txt and splits on blank lines into
 *   an array of paragraph strings. Returns null if the file doesn't exist.
 *
 * Args:
 *   slug -- project slug matching the .txt filename.
 *
 * Returns:
 *   Array of paragraph strings, or null.
 */
function readDescriptionFile(slug: string): string[] | null {
  try {
    const filePath = path.join(process.cwd(), "content", "projects", `${slug}.txt`)
    const raw = fs.readFileSync(filePath, "utf-8")
    return raw
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
  } catch {
    return null
  }
}

function ExtLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-app bg-[var(--glass)] px-4 py-2.5 text-sm font-medium text-brand backdrop-blur-sm transition-all duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
    >
      {icon}
      {label}
    </a>
  )
}

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.hasDetailPage && !p.customPage).map((p) => ({ slug: p.slug }))
}
