import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { AnimatedGithub } from "@/components/ui/icons/animated-github"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"
import { ReportSection } from "@/components/projects/report-blocks"

const project = PROJECTS.find((p) => p.slug === "echocv")!

/**
 * Purpose:
 *   Custom detail page for EchoCV, a resume you can talk to. Opens on what
 *   it changes for the person reading a resume, then explains the RAG
 *   pipeline and the app around it.
 *
 * Returns:
 *   Full project detail page with hero image, GitHub link, structured
 *   sections, and tech stack.
 */
export default function EchoCvPage() {
    if (!project) notFound()

    return (
        <main className="min-h-screen">
            {/* Hero image */}
            <div className="relative h-[55vh] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover object-center"
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
                {project.githubUrl && (
                    <div className="mb-10 flex flex-wrap gap-3">
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-app bg-[var(--glass)] px-4 py-2.5 text-sm font-medium text-brand backdrop-blur-sm transition-all duration-200 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                        >
                            <AnimatedGithub size={16} />
                            GitHub
                        </a>
                    </div>
                )}

                <div className="flex flex-col gap-10">
                    <ReportSection>
                        <p>
                            A resume is a one page summary that every reader has to interpret on
                            their own. A recruiter who wants to know what someone actually did at a
                            job, which languages they know, or what role they are after has to dig
                            for it, or wait for an interview. EchoCV turns the resume into a
                            conversation: anyone can ask a question in plain language and get an
                            answer drawn from my real documents, at any time.
                        </p>
                    </ReportSection>

                    <ReportSection title="What It Makes Easy">
                        <ul className="flex flex-col gap-3">
                            {[
                                {
                                    lead: "Asking instead of skimming.",
                                    body: "Questions like “What experience does Raphaël have?” or “What programming languages does Raphaël know?” get a direct answer, with suggested questions to start from.",
                                },
                                {
                                    lead: "Answers grounded in real documents.",
                                    body: "Every answer is built from passages retrieved from my own resume and notes, so the model works from what I wrote rather than guessing.",
                                },
                                {
                                    lead: "One folder of documents.",
                                    body: "The assistant learns from whatever sits in a single folder: PDF, Word, Markdown, and text files are extracted and indexed automatically.",
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
                    </ReportSection>

                    <ReportSection title="How It Works">
                        <p>
                            EchoCV is a retrieval augmented generation (RAG) system. When documents
                            are added, it extracts their text, splits it into chunks of 500
                            characters with a 50 character overlap, embeds each chunk with the
                            all-MiniLM-L6-v2 sentence transformer, and stores the vectors in
                            ChromaDB.
                        </p>
                        <p>
                            When someone asks a question, the question is embedded the same way and
                            ChromaDB returns the five most similar chunks. Those passages go into a
                            LangChain chain, prompt to model to output parser, that runs Llama 3.1
                            8B on Groq at a low temperature of 0.3, keeping answers close to the
                            source material.
                        </p>
                    </ReportSection>

                    <ReportSection title="The App">
                        <p>
                            The interface is a Streamlit app with three pages: the chat itself, with
                            suggested questions and live counts of the documents and chunks loaded;
                            an analytics page that charts which topics people ask about and when,
                            with Plotly, and can export the conversation; and a tools page to reload
                            the knowledge base and inspect its stats. The whole app is containerized
                            with Docker.
                        </p>
                    </ReportSection>

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
