/**
 * Projects data. One source of truth for the projects grid and detail pages.
 *
 * Sorting behaviour (controlled by the two constants below):
 *   1. Projects with visible: false are always excluded.
 *   2. Remaining projects are sorted by priority (high > medium > low).
 *   3. Within the same priority, sorted by sortDate (newest first) when
 *      SORT_RECENT_FIRST is true, or left in declaration order when false.
 *
 * Fields:
 *   slug        - URL-safe identifier used for /projects/[slug] routes.
 *   title       - Display name.
 *   description - Short blurb shown on the card (1-2 lines max).
 *   image       - Primary card image (public/images/projects/).
 *   tech        - Tech stack tags.
 *   sortDate    - Numeric YYYYMM date for ordering (e.g. 202409 = Sep 2024).
 *   period      - Human-readable date string shown on the card badge.
 *   context     - Project type label shown on the card badge.
 *   githubUrl   - Shown as GitHub icon if present.
 *   liveUrl     - Shown as Globe icon if present (listed first).
 *   videoUrl    - Shown as YouTube icon if present.
 *   hasDetailPage - When true, card links to /projects/[slug].
 *   featured    - Featured cards get a wider 16:9 image ratio.
 *   priority    - "high" | "medium" | "low" (default "low").
 *                 High-priority projects appear before medium, then low.
 *   visible     - Set false to hide from the projects grid entirely.
 *   customPage  - True when a hand-crafted page exists at
 *                 src/app/projects/{slug}/page.tsx. The standard
 *                 detail template is skipped for these slugs.
 *
 * Long descriptions (detail page body):
 *   Edit content/projects/{slug}.txt. Paragraphs are separated by blank lines.
 *   The detail page reads this file at build time. If the file is missing or
 *   empty, it falls back to project.description.
 */

export type ProjectPriority = "high" | "medium" | "low"

export type Project = {
    slug: string
    title: string
    description: string
    image: string
    images?: string[]
    tech: string[]
    sortDate: number
    period: string
    context: string
    githubUrl?: string
    liveUrl?: string
    videoUrl?: string
    hasDetailPage: boolean
    featured?: boolean
    priority?: ProjectPriority
    visible?: boolean
    /**
     * Set true when the project has a hand-crafted page at
     * src/app/projects/{slug}/page.tsx. Next.js static routes take precedence
     * over the [slug] dynamic route automatically -- no code change needed.
     * Setting this flag just excludes the slug from generateStaticParams() so
     * the dynamic template does not shadow the custom one.
     */
    customPage?: boolean
}

/** When true, projects with equal priority are sorted newest-first. */
export const SORT_RECENT_FIRST = true

const PRIORITY_WEIGHT: Record<ProjectPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
}

/**
 * Purpose:
 *   Returns the visible, sorted subset of PROJECTS.
 *   Sort key: priority desc, then sortDate desc (if SORT_RECENT_FIRST).
 *
 * Returns:
 *   Readonly array of Project entries ready to render.
 */
export function getSortedProjects(): readonly Project[] {
    return [...PROJECTS]
        .filter((p) => p.visible !== false)
        .sort((a, b) => {
            const pa = PRIORITY_WEIGHT[a.priority ?? "low"]
            const pb = PRIORITY_WEIGHT[b.priority ?? "low"]
            if (pa !== pb) return pb - pa
            if (SORT_RECENT_FIRST) return b.sortDate - a.sortDate
            return 0
        })
}

export const PROJECTS: readonly Project[] = [
    {
        slug: "klikado",
        title: "Klikado",
        description:
            "A 4 in 1 toolkit: a Unicode text formatter, a video downloader, a link shortener, and a QR code generator, no accounts, self hosted on my own server.",
        image: "/images/projects/klikado_banner.png",
        images: ["/images/projects/klikado_banner.png", "/images/projects/klikado-2.png"],
        tech: [
            "Next.js",
            "TypeScript",
            "SQLite",
            "yt-dlp",
            "ffmpeg",
            "Caddy",
            "Cloudflare",
            "GitHub Actions",
            "Framer Motion",
        ],
        sortDate: 202609,
        period: "2026",
        context: "Personal Project",
        liveUrl: "https://klikado.app",
        hasDetailPage: true,
        featured: true,
        priority: "medium",
        visible: true,
        customPage: true,
    },
    {
        slug: "where-does-my-tax-money-go",
        title: "Where Does My Tax Money Go?",
        description:
            "Turns your income into a personal federal tax receipt, shows your share of real government spending, and lets Canadians rally behind official House of Commons e-petitions.",
        image: "/images/projects/tax_banner.png",
        images: [
            "/images/projects/tax_banner.png",
            "/images/projects/tax_receipt.png",
            "/images/projects/tax_news.png",
        ],
        tech: [
            "Next.js",
            "TypeScript",
            "PostgreSQL",
            "Neon",
            "Drizzle ORM",
            "Auth0",
            "Vitest",
            "Python",
        ],
        sortDate: 202609,
        period: "Sep 2026",
        context: "Hack the Hill III, Civic Challenge",
        githubUrl: "https://github.com/rapha-pro/hack-the-hill-iii",
        liveUrl: "https://wheredoesmytaxgo.vip",
        hasDetailPage: true,
        featured: true,
        priority: "medium",
        visible: true,
        customPage: true,
    },
    {
        slug: "flotunes",
        title: "FloTunes",
        description:
            "Full-stack app that transfers YouTube playlists to Spotify with intelligent song matching, confidence scoring, and real-time transfer analytics.",
        image: "/images/projects/flotunes.png",
        tech: [
            "Next.js",
            "FastAPI",
            "Python",
            "YouTube Data API",
            "Spotify Web API",
            "TypeScript",
            "GSAP",
        ],
        sortDate: 202502,
        period: "2025",
        context: "Personal Project",
        liveUrl: "https://flotunes.com",
        hasDetailPage: true,
        featured: true,
        priority: "medium",
        visible: true,
        customPage: true,
    },
    {
        slug: "aerologix",
        title: "AeroLogix",
        description:
            "Aviation flight logbook and planning app built on SQLite, tracking flight hours, airports, crew, and planned versus actual flight times.",
        image: "/images/projects/aerologix/landing.png",
        tech: ["Python", "SQLite3", "Streamlit", "pandas", "Plotly"],
        sortDate: 202603,
        period: "Winter 2026",
        context: "Database Course Project",
        videoUrl: "https://youtu.be/rRZZhTZSnus",
        hasDetailPage: true,
        priority: "medium",
        visible: true,
        customPage: true,
    },
    {
        slug: "hinton-market",
        title: "Hinton Farmers Market",
        description:
            "Team-built market management system in C++ and Qt, with vendor bookings, stall assignments, and a FIFO waitlist system backed by SQLite.",
        image: "/images/projects/hinton_farmer_market.png",
        tech: ["C++", "Qt", "SQLite3", "UML", "Design Patterns"],
        sortDate: 202604,
        period: "Winter 2026",
        context: "Software Engineering Course",
        hasDetailPage: true,
        priority: "medium",
        visible: true,
        customPage: true,
    },
    {
        slug: "pytorch-domain-classifier",
        title: "PyTorch Domain Classifier",
        description:
            "Dual ResNet-18 ensemble that scores high on in-domain images while degrading to near-random accuracy on out-of-domain data, using a confidence-gated pipeline.",
        image: "/images/projects/assignment_4_ML_in_domain_vs_out_domain_accuracy.png",
        tech: ["Python", "PyTorch", "ResNet-18", "CNN"],
        sortDate: 202511,
        period: "Fall 2025",
        context: "Machine Learning Course",
        hasDetailPage: true,
        priority: "medium",
        visible: true,
        customPage: true,
    },
    {
        slug: "cu-webring",
        title: "CU-Webring",
        description:
            "Open-source web ring for Carleton University students and alumni to showcase personal websites and connect with the community.",
        image: "/images/projects/cu-webring.png",
        tech: ["JavaScript", "GitHub Actions", "HTML", "CSS"],
        sortDate: 202501,
        period: "Jan 2025",
        context: "Open Source",
        githubUrl: "https://github.com/yufengliu15/cu-webring",
        liveUrl: "https://cu-webring.org/",
        hasDetailPage: true,
        featured: true,
        priority: "medium",
        visible: true,
    },
    {
        slug: "foodbank-ai",
        title: "FoodQuest",
        description:
            "Gamified food donation app where users earn points based on the nutritional value of donated items, built at a 48-hour hackathon at uOttawa.",
        image: "/images/projects/foodbank_ai.png",
        tech: [
            "PyTorch",
            "ResNet",
            "Flask",
            "PostgreSQL",
            "React",
            "FoodData Central API",
            "Figma",
        ],
        sortDate: 202409,
        period: "Sep 2024",
        context: "48-Hour uOttawa Hackathon",
        liveUrl: "https://devpost.com/software/foodbank-ai",
        videoUrl: "https://www.youtube.com/watch?v=wBvP8Fz40FQ",
        hasDetailPage: true,
        featured: true,
        priority: "medium",
        visible: true,
        customPage: true,
    },
    {
        slug: "galleria-webapp",
        title: "Galleria Webapp",
        description:
            "Full-stack gallery platform built with plain JavaScript and no frameworks, where artists upload work, follow each other, and leave comments.",
        image: "/images/projects/galleria.png",
        tech: ["Node.js", "Express.js", "MongoDB", "Pug", "JavaScript", "HTML", "CSS"],
        sortDate: 202312,
        period: "Fall 2023",
        context: "Web Dev Final Project",
        videoUrl: "https://www.youtube.com/watch?v=BV4YvM95jKQ&feature=youtu.be",
        hasDetailPage: true,
        priority: "low",
        visible: true,
    },
    {
        slug: "internship-nest",
        title: "Internship Nest",
        description:
            "Full-stack dashboard for students to track internship applications, deadlines, and interview stages.",
        image: "/images/projects/internship-nest.png",
        tech: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
        sortDate: 202402,
        period: "Winter 2024",
        context: "Personal Project",
        hasDetailPage: true,
        priority: "low",
        visible: false,
    },
    {
        slug: "shoppy-mart",
        title: "Shoppy Mart",
        description:
            "Small e-commerce UI built for a web dev course using provided product JSON, with cart and store features in plain JavaScript, Pug, and MongoDB.",
        image: "/images/projects/shoppy_mart.png",
        tech: ["JavaScript", "Pug", "MongoDB", "HTML", "CSS"],
        sortDate: 202306,
        period: "Summer 2023",
        context: "Course Project",
        hasDetailPage: true,
        priority: "low",
        visible: true,
    },
    {
        slug: "english-trivia",
        title: "English Trivia",
        description:
            "Full-stack trivia web app gamifying Grade 12 English lessons, built from scratch on Replit with Django for a high school final project.",
        image: "/images/projects/trivia.png",
        tech: ["Django", "JavaScript", "Bootstrap", "HTML", "CSS"],
        sortDate: 202204,
        period: "Dec 2021 – Apr 2022",
        context: "High School Final Project",
        githubUrl: "https://github.com/rapha-pro/English-Trivia",
        hasDetailPage: true,
        priority: "low",
        visible: true,
    },
    {
        slug: "christmas-newsletter",
        title: "Christmas Wishes",
        description:
            "A responsive festive website sent to close friends for the holidays, adapted from an online template and restyled to fit a personal aesthetic.",
        image: "/images/projects/christmas.png",
        tech: ["HTML", "CSS", "JavaScript"],
        sortDate: 202312,
        period: "Dec 2023",
        context: "Creative Project",
        liveUrl: "https://raphael-xmas-phi.vercel.app/",
        hasDetailPage: true,
        priority: "low",
        visible: true,
    },
    {
        slug: "snake-game",
        title: "Snake Game",
        description:
            "A classic snake game with a scoring system, built with Pygame and Tkinter while learning Python GUI programming in high school.",
        image: "/images/projects/snake.jpg",
        tech: ["Python", "Pygame", "Tkinter"],
        sortDate: 202208,
        period: "Summer 2022",
        context: "High School Project",
        githubUrl: "https://github.com/rapha-pro/Snake-game",
        hasDetailPage: true,
        priority: "low",
        visible: true,
    },
    {
        slug: "snake-ladder-simulation",
        title: "Snake and Ladder Simulation",
        description:
            "A two-player Snake and Ladder board game simulation built with Pygame as a first-year course project.",
        image: "/images/projects/snake-sim.jpg",
        tech: ["Python", "Pygame"],
        sortDate: 202212,
        period: "Fall 2022",
        context: "Course Project",
        githubUrl: "https://github.com/rapha-pro/Snake-Ladder-Simulation",
        hasDetailPage: true,
        priority: "low",
        visible: true,
    },
    {
        slug: "hangman",
        title: "Hangman",
        description:
            "A classic Hangman game with animated letter reveals, difficulty levels, and a word bank spanning multiple categories.",
        image: "/images/projects/hangman.jpg",
        tech: ["JavaScript", "HTML", "CSS"],
        sortDate: 202301,
        period: "Winter 2023",
        context: "Side Project",
        hasDetailPage: true,
        priority: "low",
        visible: true,
    },
    {
        slug: "weather-app",
        title: "Weather App",
        description:
            "A Python GUI app using Tkinter that pulls live weather data from the OpenWeatherMap API, built to learn what an API is and how to use one.",
        image: "/images/projects/weather.jpg",
        tech: ["Python", "Tkinter", "OpenWeatherMap API"],
        sortDate: 202208,
        period: "Summer 2022",
        context: "Learning Project",
        githubUrl: "https://github.com/rapha-pro/Weather-app",
        hasDetailPage: true,
        priority: "low",
        visible: true,
    },
] as const
