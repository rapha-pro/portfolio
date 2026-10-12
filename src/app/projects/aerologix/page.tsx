import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PROJECTS } from "@/lib/data/projects"
import { TechBadge } from "@/components/projects/tech-badge"
import { notFound } from "next/navigation"

const project = PROJECTS.find((p) => p.slug === "aerologix")!

/**
 * Purpose:
 *   Custom detail page for AeroLogix. Covers the app purpose, features,
 *   and database design with inline screenshots of the ER model and schema.
 *
 * Returns:
 *   Full project detail page with hero image, YouTube button, structured
 *   sections, database screenshots, and tech stack.
 */
export default function AeroLogixPage() {
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

                {/* Write-up sections */}
                <div className="flex flex-col gap-10">
                    <Section title="What is it about">
                        <p>
                            AeroLogix is a digital flight logbook built for pilots and flight
                            simulator enthusiasts who want something better than a spreadsheet or a
                            paper logbook. The app stores both planned and actual flight data, so
                            you can compare what you filed versus what actually happened, including
                            departure delays, real flight duration, and any remarks from the flight.
                        </p>
                        <p>
                            It also ships with a full airport reference database sourced from
                            OurAirports, covering identifiers, locations, runway surfaces, and
                            lengths for airports worldwide. This means you can look up any airport
                            before planning a leg, rather than keeping a separate reference document
                            open.
                        </p>
                    </Section>

                    {/* Landing screenshot */}
                    <div className="overflow-hidden rounded-2xl border border-app">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/projects/aerologix/landing.png"
                            alt="AeroLogix landing page"
                            className="w-full object-cover"
                        />
                    </div>

                    {/* Dashboard screenshot */}
                    <div className="overflow-hidden rounded-2xl border border-app">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/projects/aerologix/dashboard.png"
                            alt="AeroLogix dashboard"
                            className="w-full object-cover"
                        />
                    </div>

                    <Section title="Features">
                        <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-muted">
                            {[
                                "Browse a worldwide airport directory with runway details pulled from the OurAirports public dataset",
                                "Add and manage aircraft records by registration, model, and notes",
                                "Add and manage crew members with their roles",
                                "Plan flights with multiple airports, crew assignments, and scheduled times",
                                "Log completed flights with actual departure and arrival times",
                                "Search and filter your flight log by date, aircraft, airport, or crew member",
                                "Summary reports: total flight time by month, by aircraft, and most visited airports",
                                "Export your full flight log to CSV",
                            ].map((item) => (
                                <li key={item} className="flex gap-2">
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Section>

                    {/* Flights screenshot */}
                    <div className="overflow-hidden rounded-2xl border border-app">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/projects/aerologix/flights.png"
                            alt="AeroLogix flights view"
                            className="w-full object-cover"
                        />
                    </div>

                    <Section title="Database Design">
                        <p>
                            The database is built on SQLite and organized around two types of data.
                            Reference data, imported from the OurAirports public dataset, covers
                            airports, runways, countries, and regions. Operational data is
                            everything the user enters: aircraft, crew, flight plans, and completed
                            flight records.
                        </p>
                        <p>
                            Two many-to-many relationships drive the core logic. A flight can
                            involve multiple crew members across different roles, and a single
                            flight can pass through multiple airports (departure, arrival,
                            alternates) in a defined sequence. Junction tables handle both
                            relationships cleanly, keeping the schema normalized and queries
                            straightforward.
                        </p>
                        <p>
                            All queries are written in raw SQL, with no ORM layer hiding what is
                            happening under the hood.
                        </p>
                    </Section>

                    {/* ER Model */}
                    <div>
                        <p className="mb-3 text-sm font-medium text-muted">
                            Entity-Relationship Model
                        </p>
                        <div className="overflow-hidden rounded-2xl border border-app bg-white p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/projects/aerologix/database_project_ER-model.png"
                                alt="AeroLogix ER model"
                                className="w-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Schema */}
                    <div>
                        <p className="mb-3 text-sm font-medium text-muted">Database Schema</p>
                        <div className="overflow-hidden rounded-2xl border border-app bg-white p-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/projects/aerologix/database_project_Tables.png"
                                alt="AeroLogix database schema"
                                className="w-full object-contain"
                            />
                        </div>
                    </div>

                    {/* YouTube embed */}
                    <div className="overflow-hidden rounded-2xl border border-app">
                        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                            <iframe
                                src="https://www.youtube.com/embed/rRZZhTZSnus"
                                title="AeroLogix demo"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 h-full w-full"
                            />
                        </div>
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
