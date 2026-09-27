import Link from "next/link"
import { ArrowLeft, ExternalLink, Globe } from "lucide-react"
import { AnimatedGithub } from "@/components/ui/icons/animated-github"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"
import { notFound } from "next/navigation"

const project = PROJECTS.find((p) => p.slug === "where-does-my-tax-go")!

const DEVPOST_URL = "https://devpost.com/software/wheredoesmytaxgo"

/**
 * Purpose:
 *   Custom detail page for Where Does My Tax Go?, built at Hack the Hill III.
 *   Covers the idea, how the app works, the data and backend work I owned
 *   on the team, and screenshots of the live site.
 *
 * Returns:
 *   Full project detail page with hero image, link buttons, structured
 *   sections, an inline receipt screenshot, and tech stack.
 */
export default function WhereDoesMyTaxGoPage() {
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
                    {project.liveUrl && (
                        <ExtLink
                            href={project.liveUrl}
                            icon={<Globe size={16} />}
                            label="wheredoesmytaxgo.vip"
                        />
                    )}
                    {project.githubUrl && (
                        <ExtLink
                            href={project.githubUrl}
                            icon={<AnimatedGithub size={16} />}
                            label="GitHub"
                        />
                    )}
                    <ExtLink href={DEVPOST_URL} icon={<ExternalLink size={16} />} label="Devpost" />
                </div>

                {/* Write-up sections */}
                <div className="flex flex-col gap-10">
                    <Section title="The Idea">
                        <p>
                            Canadians hear about federal spending in two ways: headlines about one
                            scandal at a time, with no sense of scale, or budget documents most
                            people can&apos;t read. Neither shows a person what their own money paid
                            for, and neither gives them anything to do about it.
                        </p>
                        <p>
                            We built Where Does My Tax Go? in a team of four at Hack the Hill III.
                            You enter your income and province, and the app hands you a federal tax
                            receipt: what you paid, and where it went, line by line.
                        </p>
                    </Section>

                    <Section title="What It Does">
                        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
                            {[
                                "Estimates your federal income tax and splits it across the biggest federal programs, using real 2024 to 2025 government spending",
                                "Shows a feed of spending stories, built from programs whose budgets jumped between years plus recent news, each with your personal share of the cost",
                                "Lets you start or join a campaign on a story you care about",
                                "Once a campaign gathers enough supporters, the team asks an MP to sponsor it and opens an official e-petition on ourcommons.ca, which supporters can then sign",
                            ].map((item) => (
                                <li key={item} className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Screenshot
                        src="/images/projects/tax_receipt.png"
                        alt="Federal tax receipt screen"
                    />

                    <Section title="My Part: Data and Backend">
                        <p>
                            I owned the data side. The tax calculator covers every province and
                            territory with 2024 federal and provincial brackets, CPP and QPP, EI,
                            and the basic personal amount phase outs, checked against Canada Revenue
                            Agency tables. It runs in the browser, so your income never leaves your
                            device.
                        </p>
                        <p>
                            For spending, I loaded the GC InfoBase open data into a Neon Postgres
                            database with Drizzle, computed total federal spending for the year, and
                            gave the seven largest programs plain English names. That feeds the
                            breakdown API behind the receipt, along with the spending feed and
                            department filter endpoints behind the stories screens.
                        </p>
                        <p>
                            I also built the campaign and petition backend. The database enforces
                            one campaign per person per story, and a supporter&apos;s postal code is
                            never stored, only their riding. Since ourcommons.ca has no API, the app
                            reads each petition&apos;s public page for its signature count,
                            sponsoring MP, and key dates, and moves campaigns to live or closed on
                            its own.
                        </p>
                        <p>
                            The backend is covered by Vitest tests that run each route against an in
                            memory Postgres.
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
