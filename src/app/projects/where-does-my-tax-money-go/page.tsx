import Link from "next/link"
import { ArrowLeft, ExternalLink, Globe } from "lucide-react"
import { AnimatedGithub } from "@/components/ui/icons/animated-github"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"
import { notFound } from "next/navigation"

const project = PROJECTS.find((p) => p.slug === "where-does-my-tax-money-go")!

const DEVPOST_URL = "https://devpost.com/software/wheredoesmytaxgo"

/**
 * Purpose:
 *   Custom detail page for Where Does My Tax Money Go?, built at Hack the
 *   Hill III. Opens on the problem, then what the app makes easy for Canadians, then its
 *   target audience, and ends with a short note on my role on the team.
 *
 * Returns:
 *   Full project detail page with hero image, link buttons, structured
 *   sections, inline screenshots, and tech stack.
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
                    <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-muted">
                        <p>
                            Every Canadian who works pays federal tax, yet almost nobody can say
                            what their own money actually paid for. Spending reaches people in two
                            ways: headlines about one scandal at a time, with no sense of scale, or
                            budget documents written in billions and program codes most people
                            can&apos;t use. People get angry for a week, then move on, because there
                            is nothing obvious to do about it.
                        </p>
                    </div>

                    <Section title="What It Makes Easy">
                        <ul className="flex flex-col gap-3 text-[15px] leading-relaxed text-muted">
                            {[
                                {
                                    lead: "Seeing your own money.",
                                    body: "Enter your income and province and you get a receipt, in your own dollars instead of billions: how much federal tax you paid and how much of it went to pensions, health care transfers, interest on the debt, and more. More than half goes to just 7 of the 1,228 federal programs.",
                                },
                                {
                                    lead: "Understanding the news in personal terms.",
                                    body: "Every spending story, from budget jumps in the public data to recent headlines, shows what it cost you personally. A $162 million program becomes about $3 out of your pocket, which makes it much easier to judge whether it was worth it.",
                                },
                                {
                                    lead: "Turning an opinion into a voice.",
                                    body: "If a story matters to you, you can start or join a campaign on it. Once a campaign gathers enough supporters, the team asks an MP to sponsor it and opens an official House of Commons e-petition, where 500 signatures means the government has to answer in writing.",
                                },
                                {
                                    lead: "Trusting what you see.",
                                    body: "The numbers come from the government's own open data, with sources shown, and your income is calculated on your device and never sent anywhere.",
                                },
                            ].map((item) => (
                                <li key={item.lead} className="flex gap-2">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                                    <span>
                                        <span className="font-semibold text-brand">
                                            {item.lead}
                                        </span>{" "}
                                        {item.body}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <Screenshot
                        src="/images/projects/tax_receipt.png"
                        alt="Federal tax receipt screen"
                    />

                    <Section title="Target Audience: Who Is It For">
                        <p>
                            Basically every Canadian. Anyone who earns an income pays federal tax,
                            and anyone who reads a spending headline deserves to know what it means
                            for them. The app needs no knowledge of how a federal budget works: an
                            income and a province are enough to see where your money goes and to
                            have a say in how it is spent.
                        </p>
                    </Section>

                    <Screenshot
                        src="/images/projects/tax_news.png"
                        alt="Spending stories feed with your personal share of each item"
                    />

                    <Section title="My Role">
                        <p>
                            We were a team of four at Hack the Hill III. I owned the data and
                            backend: the tax calculator for every province and territory, the
                            spending breakdown built from GC InfoBase open data, the APIs behind the
                            receipt and the stories feed, and the campaign and petition backend,
                            including reading live petition status from ourcommons.ca. The app was
                            built with LLM assisted coding.
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
