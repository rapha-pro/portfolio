/**
 * Projects data. One source of truth for the projects grid and detail pages.
 *
 * Fields:
 *   slug           -- URL-safe identifier used for /projects/[slug] routes.
 *   title          -- Display name.
 *   description    -- Short blurb shown on the card.
 *   longDescription -- Markdown-style paragraphs shown on the detail page.
 *   image          -- Primary card image (public/images/projects/).
 *   images         -- Extra screenshots for the detail page gallery.
 *   tech           -- Tech stack tags.
 *   period         -- Short date string, e.g. "Sep 2024".
 *   context        -- Project type label, e.g. "Hackathon Project".
 *   githubUrl      -- Shown as GitHub icon if present.
 *   liveUrl        -- Shown as Globe icon if present.
 *   videoUrl       -- Shown as YouTube icon if present.
 *   hasDetailPage  -- When true, the card links to /projects/[slug].
 *   featured       -- Featured cards get a wider slot in the masonry grid.
 */

export type Project = {
  slug: string
  title: string
  description: string
  longDescription?: string[]
  image: string
  images?: string[]
  tech: string[]
  period: string
  context: string
  githubUrl?: string
  liveUrl?: string
  videoUrl?: string
  hasDetailPage: boolean
  featured?: boolean
}

export const PROJECTS: readonly Project[] = [
  {
    slug: "cu-webring",
    title: "CU-Webring",
    description:
      "Contributed to the creation of the CU-Webring, a platform for Carleton University students and alumni to showcase their personal websites and portfolios, enhancing visibility and networking opportunities.",
    longDescription: [
      "CU-Webring is an open-source web ring built for the Carleton University community. A web ring is a circular collection of websites linked together so visitors can easily navigate between member sites.",
      "I contributed to the project by building out core navigation features and automating the member-addition workflow using GitHub Actions, making it easy for new students to submit their sites via pull request.",
      "The project is fully static, intentionally lightweight, and designed to stay that way — it's about discoverability, not complexity.",
    ],
    image: "/images/projects/cu-webring.png",
    tech: ["JavaScript", "GitHub Actions", "HTML", "CSS"],
    period: "Jan 2025",
    context: "Open Source Project",
    githubUrl: "https://github.com/nathonana",
    liveUrl: "https://cu-webring.vercel.app",
    hasDetailPage: true,
    featured: true,
  },
  {
    slug: "foodbank-ai",
    title: "Foodbank AI",
    description:
      "FoodQuest is a gamified web application designed to encourage food donations by allowing users to donate items, track their contributions, and earn points based on the nutritional value of donated items.",
    longDescription: [
      "FoodQuest was built at a 24-hour hackathon in September 2024. The core idea: make donating to food banks feel rewarding by gamifying the experience with points, streaks, and leaderboards.",
      "The AI component uses a PyTorch model to estimate the nutritional value of donated food items from photos, automatically assigning point values so users don't need to manually input data.",
      "The backend is a Flask REST API connected to a PostgreSQL database, with a React frontend for a smooth single-page experience.",
    ],
    image: "/images/projects/foodbank_ai.png",
    tech: ["PyTorch", "Flask", "Pandas", "NumPy", "Python", "React", "PostgreSQL"],
    period: "Sep 2024",
    context: "Hackathon Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: true,
    featured: true,
  },
  {
    slug: "galleria-webapp",
    title: "Galleria Webapp",
    description:
      "A gallery web application allowing artists to showcase their art and interact with other artists on the platform.",
    longDescription: [
      "Galleria was the final project for my Web Development course in Fall 2023. The goal was to build a full-stack application from scratch using Node.js and Express.",
      "Artists can create profiles, upload artwork, follow each other, and leave comments. The app uses MongoDB for flexible document storage and Pug as a server-side templating engine.",
      "This project taught me the full request-response cycle, session-based authentication, and how to structure a real MVC application.",
    ],
    image: "/images/projects/galleria.png",
    tech: ["Node.js", "Express.js", "MongoDB", "Pug", "HTML", "CSS"],
    period: "Fall 2023",
    context: "Web Dev Final Project",
    videoUrl: "https://youtube.com",
    hasDetailPage: true,
  },
  {
    slug: "internship-nest",
    title: "Internship Nest",
    description:
      "A full-stack internship tracking dashboard for students to manage applications, deadlines, and interview stages in one place.",
    image: "/images/projects/internship-nest.png",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    period: "Winter 2024",
    context: "Personal Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: false,
  },
  {
    slug: "shoppy-mart",
    title: "Shoppy Mart",
    description:
      "An e-commerce simulation app with product listings, a shopping cart, order management, and a lightweight admin panel.",
    image: "/images/projects/shoppy_mart.png",
    tech: ["React", "Firebase", "Tailwind CSS", "JavaScript"],
    period: "Summer 2023",
    context: "Personal Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: false,
  },
  {
    slug: "english-trivia",
    title: "English Trivia",
    description:
      "An interactive trivia web app covering English grammar, literature, and vocabulary — designed for classroom use.",
    image: "/images/projects/trivia.png",
    tech: ["JavaScript", "HTML", "CSS"],
    period: "Spring 2023",
    context: "Side Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: false,
  },
  {
    slug: "christmas-newsletter",
    title: "Christmas Newsletter",
    description:
      "A festive personal newsletter template with animated holiday elements, built and sent as a seasonal creative exercise.",
    image: "/images/projects/christmas.png",
    tech: ["HTML", "CSS", "JavaScript"],
    period: "Dec 2023",
    context: "Creative Project",
    hasDetailPage: false,
  },
  {
    slug: "snake-simulation",
    title: "Snake Simulation",
    description:
      "A Python snake game simulation where an AI agent learns to play using a genetic algorithm, visualized in real time.",
    image: "/images/projects/snake.jpg",
    tech: ["Python", "Pygame", "NumPy"],
    period: "Fall 2023",
    context: "AI Course Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: false,
  },
  {
    slug: "hangman",
    title: "Hangman",
    description:
      "A classic Hangman game with animated letter reveals, difficulty levels, and a word bank spanning multiple categories.",
    image: "/images/projects/hangman.jpg",
    tech: ["JavaScript", "HTML", "CSS"],
    period: "Winter 2023",
    context: "Side Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: false,
  },
  {
    slug: "weather-app",
    title: "Weather App",
    description:
      "A clean weather dashboard that fetches real-time conditions and forecasts from the OpenWeatherMap API.",
    image: "/images/projects/weather.jpg",
    tech: ["JavaScript", "REST API", "HTML", "CSS"],
    period: "Fall 2022",
    context: "Side Project",
    githubUrl: "https://github.com/nathonana",
    hasDetailPage: false,
  },
] as const
