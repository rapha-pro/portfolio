import Link from "next/link"
import { AlertTriangle, ArrowLeft, Globe } from "lucide-react"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"
import { notFound } from "next/navigation"

const project = PROJECTS.find((p) => p.slug === "flotunes")!

/**
 * Purpose:
 *   Custom detail page for FloTunes. Describes what the app does, how the
 *   transfer pipeline works, and the key features, in plain language.
 *
 * Returns:
 *   Full project detail page with hero image, structured sections, and tech stack.
 */
export default function FloTunesPage() {
    if (!project) notFound()

    return (
        <main className="min-h-screen">
            {/* Hero image */}
            <div className="relative h-[55vh] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover object-top"
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
                <div className="mb-8 flex flex-wrap gap-3">
                    <ExtLink
                        href="https://flotunes.com"
                        icon={<Globe size={16} />}
                        label="flotunes.com"
                    />
                </div>

                {/* Standby notice */}
                <div className="mb-10 flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-400/10 px-5 py-4 text-[14px] text-muted">
                    <AlertTriangle
                        size={18}
                        className="mt-0.5 shrink-0 text-amber-500"
                        aria-hidden
                    />
                    <p>
                        <span className="mr-2 font-semibold text-brand">Note:</span>
                        FloTunes is currently on standby. The site is live but the transfer feature
                        may not be available at this time.
                    </p>
                </div>

                {/* Write-up sections */}
                <div className="flex flex-col gap-10">
                    <Section title="What It Does">
                        <p>
                            FloTunes solves a common frustration for music lovers: rebuilding a
                            curated YouTube playlist on Spotify from scratch, song by song. You
                            paste a YouTube playlist link, and FloTunes takes it from there,
                            fetching every video, identifying the songs, finding them on Spotify,
                            and creating a new playlist in your account, all in one automated flow.
                        </p>
                        <p>
                            The result comes with a full transfer report: how many songs matched,
                            which ones could not be found, and a confidence breakdown for each
                            match.
                        </p>
                    </Section>

                    <Section title="How the Transfer Works">
                        <p>
                            The process runs through a backend pipeline with several stages. First,
                            the app reads the YouTube playlist and extracts the title and metadata
                            for every video. Each title is then cleaned and parsed to strip out
                            channel names, tags, and other noise that would confuse a music search.
                        </p>
                        <p>
                            For each cleaned title, the backend queries the Spotify search API and
                            runs a confidence-scoring algorithm across the results. If the best
                            match clears the confidence threshold, the song is added to the transfer
                            queue. Tracks that fall below the threshold are logged separately so you
                            can see exactly what was missed and why.
                        </p>
                        <p>
                            Once all songs are evaluated, a new Spotify playlist is created and the
                            matched tracks are added in one batch operation. The full results,
                            including success rate, timing, and individual song status, are returned
                            to the frontend.
                        </p>
                    </Section>

                    <Section title="Key Features">
                        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
                            {[
                                "Intelligent song matching across multiple search strategies, handling remixes, covers, and multi-artist tracks",
                                "Confidence scoring per track so the app only commits to matches it is fairly certain about",
                                "Real-time progress tracking while the transfer runs",
                                "Detailed results report: matched tracks, failed tracks, and overall success rate",
                                "Responsive dark-theme interface with GSAP-powered animations",
                                "Form validation and descriptive error messages throughout the flow",
                            ].map((item) => (
                                <li key={item} className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>

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
            </div>
        </main>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="mb-3 text-lg font-semibold text-brand">{title}</h2>
            <div className="flex flex-col gap-4">{children}</div>
        </div>
    )
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
