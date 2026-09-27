/**
 * Employment history, most-recent first.
 *
 * Each entry is self-contained: the experience timeline iterates over this
 * list, so adding a new job is one object - no JSX changes.
 *
 * Logos live in /public/images/experience/. If a new company isn't there
 * yet, `logo` can be `null` and the timeline renders a letter-badge fallback.
 */

export type ExperienceEntry = {
    /** Company name - shown as the card title. */
    company: string
    /** Role held at the company. */
    role: string
    /** e.g. "Internship", "Co-op", "Part-time". */
    kind: string
    /** Free-text location line ("Montréal, QC"). */
    location: string
    /** Free-text date range ("Jan 2025 – Aug 2025"). */
    period: string
    /** Array of bullet points - each becomes a <li>. */
    bullets: readonly string[]
    /** Logo URL under /public, or null for the letter-badge fallback. */
    logo: string | null
    /** Tailwind color for the node dot / accent (a brand color). */
    accent: string
    /** If true the logo tile uses a white background (for dark wordmarks). */
    lightLogoBg?: boolean
    /**
     * Optional hex color to force as the logo tile background.
     * Takes priority over `lightLogoBg`. Useful for logos designed on specific
     * brand backgrounds (e.g. Caterpillar's yellow mark on dark).
     */
    bgOverride?: string
}

/** Order here == order rendered (top of timeline == most recent). */
export const EXPERIENCE: readonly ExperienceEntry[] = [
    {
        company: "TD Bank",
        role: "Data Scientist",
        kind: "Internship",
        location: "Ottawa, ON",
        period: "May – Jul 2026",
        bullets: [
            "Automated a manual Azure Databricks pipeline that measures how much TD Helps hardship tools reduce write-offs, now running every month, quarter, and fiscal year into Azure Synapse as one source of truth for managers and 3+ partner teams.",
            "Delivered a seven-page Power BI dashboard tracking daily Promise to Pay agreements for 20+ team managers, using TD approved GenAI tools to speed up development and save 10+ hours of manual work weekly.",
        ],
        logo: "/images/experience/TD-Bank-Logo.png",
        accent: "#00B04F",
        lightLogoBg: true,
    },
    {
        company: "Elections Canada",
        role: "Junior Data Scientist",
        kind: "Student",
        location: "Ottawa, ON",
        period: "Nov 2025 – Apr 2026",
        bullets: [
            "Migrated and debugged 3,500+ lines of legacy SAS and Python code for critical audit workflows, resolving 6+ high-impact logical bugs and data parity issues.",
            "Led the team discussion on advancing to better production-ready code, bringing in virtual environments, Pytest, standardized documentation, and type-hinting as concrete steps toward bridging software engineering standards with the team's data science workflows.",
        ],
        logo: "/images/experience/Elections_Canada_Logo.png",
        accent: "#E4002B",
        lightLogoBg: true,
    },
    {
        company: "Caterpillar",
        role: "Software Designer",
        kind: "Internship",
        location: "Montréal, QC",
        period: "Jan – Apr 2025",
        bullets: [
            "Led CI/CD pipeline migration from Azure DevOps to GitHub Actions, writing automation scripts that reduced workflow runtime by 62% across distributed build environments.",
            "Integrated GitHub Actions Importer achieving 80% automated pipeline translation accuracy, with documentation adopted as the migration standard across 5+ development teams.",
            "Debugged Make/CMake build systems and wrote Bash scripts to identify runtime bottlenecks, including translation of Docker-based build and test configurations.",
        ],
        logo: "",
        accent: "#FFCD11",
        lightLogoBg: false,
        bgOverride: "#1C1C1C",
    },
    {
        company: "Ford",
        role: "Test Automation Engineer",
        kind: "Co-op",
        location: "Ottawa, ON",
        period: "May – Dec 2024",
        bullets: [
            "Automated token management for distributed test infrastructure using Python and Jenkins, reducing manual task time by 90% and processing 70+ devices.",
            "Built FNV (Fully Networked Vehicle) test stations from scratch integrating Infotainment systems, Arduinos, ECUs, and telematics hardware across 4 vehicle platforms.",
            // "Developed a Python pipeline using Pandas and NumPy to automate weekly failure analysis reports, eliminating all manual Excel processing and enabling real-time insights.",
            "Mentored 3+ interns and contractors on key workflows and proprietary tools, creating documentation that reduced onboarding time and enabled independent test management within 10 days.",
        ],
        logo: "",
        accent: "#003478",
        lightLogoBg: true,
    },
    {
        company: "McDonald's",
        role: "Crew Trainer",
        kind: "Part-time",
        location: "Ottawa, ON",
        period: "2022 – 2023",
        bullets: [
            "Awarded Employee of the Month (July 2023) for consistently delivering excellent customer service and quickly resolving concerns.",
            "Guided new members on techniques and company standards, supporting their fast integration into the team.",
            "Maintained seamless order flow through clear communication and teamwork during high-volume service periods.",
        ],
        logo: "/images/experience/mcdonalds.png",
        accent: "#FFC72C",
        lightLogoBg: true,
    },
] as const
