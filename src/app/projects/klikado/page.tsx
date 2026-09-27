import Link from "next/link"
import { ArrowLeft, Globe } from "lucide-react"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"
import { notFound } from "next/navigation"

const project = PROJECTS.find((p) => p.slug === "klikado")!

/**
 * Purpose:
 *   Custom detail page for Klikado. Covers why the toolkit exists, the four
 *   tools, how the app is hosted, and screenshots of the live site.
 *
 * Returns:
 *   Full project detail page with hero image, structured sections,
 *   inline screenshots, and tech stack.
 */
export default function KlikadoPage() {
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
                <div className="mb-10 flex flex-wrap gap-3">
                    <ExtLink
                        href="https://klikado.app"
                        icon={<Globe size={16} />}
                        label="klikado.app"
                    />
                </div>

                {/* Write-up sections */}
                <div className="flex flex-col gap-10">
                    <Section title="Why It Exists">
                        <p>
                            It started as one tool. I wanted to post on LinkedIn with bold or italic
                            text, and every formatter site I found looked dated and did only one
                            thing. So I built my own, then kept going: I also wanted to save videos
                            without installing anything, hand out a short link instead of a long
                            one, and get a QR code to go with it.
                        </p>
                        <p>
                            Klikado puts all four under one roof. No accounts, free to use, and I
                            use it myself.
                        </p>
                    </Section>

                    <Section title="Where the Name Comes From">
                        <p>
                            The project began as UnicodeKit, then became Clikit once the other tools
                            arrived. That name turned out to be taken almost everywhere, so I went
                            looking for something more unique. Klikado comes from Esperanto: kliki
                            means to click, and the suffix ado marks an ongoing action. Put
                            together, it roughly means the act of clicking, which fits a toolkit
                            where one click does the job.
                        </p>
                    </Section>

                    <Screenshot
                        src="/images/projects/klikado-2.png"
                        alt="Klikado video downloader"
                    />

                    <Section title="The Four Tools">
                        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
                            {[
                                "Text formatter: turns plain text into Unicode characters that look bold, italic, or monospace, so the style survives on LinkedIn, X, and Instagram. It runs entirely in the browser.",
                                "Video downloader: paste a YouTube, TikTok, Instagram, or Facebook link, get a preview with title and duration, then download HD MP4, standard MP4, or MP3.",
                                "Link shortener: turns a long URL into a klikado.app link stored on the server, so it works for anyone you share it with.",
                                "QR generator: builds a QR code for any link or text right in the browser. Every shortened link gets one automatically.",
                            ].map((item) => (
                                <li key={item} className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="How It Runs">
                        <p>
                            Klikado is a single Next.js app, deployed on my own VPS rather than a
                            managed platform. Cloudflare handles DNS in front of the server, and
                            Caddy sits at the edge as a reverse proxy, serving the site over HTTPS
                            with certificates it renews on its own. The app itself runs as a systemd
                            service that only listens on localhost.
                        </p>
                        <p>
                            The formatter and the QR generator never leave the browser. Only the
                            shortener and the downloader talk to the server. The shortener writes to
                            a SQLite file, one row per link, with a hit count bumped on every visit.
                            The downloader runs yt-dlp as a separate process: once to read the video
                            details for the preview, and again to fetch the chosen format, with
                            ffmpeg joining the picture and sound when a platform serves them as two
                            streams.
                        </p>
                        <p>
                            Every push to main deploys automatically through GitHub Actions, and a
                            version endpoint reports exactly what is live.
                        </p>
                    </Section>

                    <Section title="Security">
                        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
                            {[
                                "API routes are rate limited per visitor",
                                "Database queries use prepared statements throughout",
                                "The downloader checks its platform allowlist before yt-dlp ever runs",
                            ].map((item) => (
                                <li key={item} className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Section title="What I Learned">
                        <p>
                            Running my own server taught me things a managed host hides. The first
                            bug I hit in production: a short link&apos;s QR code sent my phone to
                            localhost, because behind Caddy the app saw its own internal address
                            instead of the public domain. I also learned why download tools need
                            constant updates, since platforms keep changing how their video players
                            hand out media, and I now keep a written log of each bug and its fix in
                            the repo.
                        </p>
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
            <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-muted">
                {children}
            </div>
        </div>
    )
}

function Screenshot({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-app">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="w-full object-cover" />
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
