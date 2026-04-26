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
  high:   3,
  medium: 2,
  low:    1,
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
    slug: "cu-webring",
    title: "CU-Webring",
    description:
      "Open-source web ring for Carleton University students and alumni to showcase personal websites and connect with the community.",
    image: "/images/projects/cu-webring.png",
    tech: ["JavaScript", "GitHub Actions", "HTML", "CSS"],
    sortDate: 202501,
    period: "Jan 2025",
    context: "Open Source Project",
    githubUrl: "https://github.com/nathonana",
    liveUrl: "https://cu-webring.vercel.app",
    hasDetailPage: true,
    featured: true,
    priority: "medium",
    visible: true,
  },
  {
    slug: "foodbank-ai",
    title: "Foodbank AI",
    description:
      "Gamified food donation app where users earn points based on the nutritional value of donated items, built at a 24-hour hackathon.",
    image: "/images/projects/foodbank_ai.png",
    tech: ["PyTorch", "Flask", "Pandas", "NumPy", "Python", "React", "PostgreSQL"],
    sortDate: 202409,
    period: "Sep 2024",
    context: "Hackathon Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: true,
    featured: true,
    priority: "medium",
    visible: true,
  },
  {
    slug: "galleria-webapp",
    title: "Galleria Webapp",
    description:
      "A gallery web application allowing artists to showcase their art and interact with other artists on the platform.",
    image: "/images/projects/galleria.png",
    tech: ["Node.js", "Express.js", "MongoDB", "Pug", "HTML", "CSS"],
    sortDate: 202312,
    period: "Fall 2023",
    context: "Web Dev Final Project",
    videoUrl: "https://youtube.com",
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
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: true,
    priority: "low",
    visible: false,
  },
  {
    slug: "shoppy-mart",
    title: "Shoppy Mart",
    description:
      "An e-commerce simulation app with product listings, a shopping cart, order management, and a lightweight admin panel.",
    image: "/images/projects/shoppy_mart.png",
    tech: ["React", "Firebase", "Tailwind CSS", "JavaScript"],
    sortDate: 202306,
    period: "Summer 2023",
    context: "Personal Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: true,
    priority: "low",
    visible: true,
  },
  {
    slug: "english-trivia",
    title: "English Trivia",
    description:
      "Interactive trivia web app covering English grammar, literature, and vocabulary, designed for classroom use.",
    image: "/images/projects/trivia.png",
    tech: ["JavaScript", "HTML", "CSS"],
    sortDate: 202303,
    period: "Spring 2023",
    context: "Side Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: true,
    priority: "low",
    visible: true,
  },
  {
    slug: "christmas-newsletter",
    title: "Christmas Newsletter",
    description:
      "A festive personal newsletter template with animated holiday elements, built and sent as a seasonal creative exercise.",
    image: "/images/projects/christmas.png",
    tech: ["HTML", "CSS", "JavaScript"],
    sortDate: 202312,
    period: "Dec 2023",
    context: "Creative Project",
    hasDetailPage: true,
    priority: "low",
    visible: true,
  },
  {
    slug: "snake-simulation",
    title: "Snake Simulation",
    description:
      "A Python snake game where an AI agent learns to play using a genetic algorithm, visualized in real time.",
    image: "/images/projects/snake.jpg",
    tech: ["Python", "Pygame", "NumPy"],
    sortDate: 202309,
    period: "Fall 2023",
    context: "AI Course Project",
    githubUrl: "https://github.com/nathonana",
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
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: true,
    priority: "low",
    visible: true,
  },
  {
    slug: "weather-app",
    title: "Weather App",
    description:
      "A clean weather dashboard that fetches real-time conditions and forecasts from the OpenWeatherMap API.",
    image: "/images/projects/weather.jpg",
    tech: ["JavaScript", "REST API", "HTML", "CSS"],
    sortDate: 202209,
    period: "Fall 2022",
    context: "Side Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: true,
    priority: "low",
    visible: true,
  },
] as const
