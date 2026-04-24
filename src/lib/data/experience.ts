/**
 * Employment history, most-recent first.
 *
 * Each entry is self-contained: the experience timeline iterates over this
 * list, so adding a new job is one object — no JSX changes.
 *
 * Logos live in /public/images/experience/. If a new company isn't there
 * yet, `logo` can be `null` and the timeline renders a letter-badge fallback.
 */

export type ExperienceEntry = {
  /** Company name — shown as the card title. */
  company: string
  /** Role held at the company. */
  role: string
  /** e.g. "Internship", "Co-op", "Part-time". */
  kind: string
  /** Free-text location line ("Montréal, QC"). */
  location: string
  /** Free-text date range ("Jan 2025 – Aug 2025"). */
  period: string
  /** Array of bullet points — each becomes a <li>. */
  bullets: readonly string[]
  /** Logo URL under /public, or null for the letter-badge fallback. */
  logo: string | null
  /** Tailwind color for the node dot / accent (a brand color). */
  accent: string
  /** If true the logo tile uses a light background (for dark wordmarks). */
  lightLogoBg?: boolean
}

/** Order here == order rendered (top of timeline == most recent). */
export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    company: "TD Bank",
    role: "Data Scientist Co-op",
    kind: "Co-op",
    location: "Toronto, ON",
    period: "2025",
    bullets: [
      "Built and evaluated machine-learning models on real customer data inside TD's secured analytics environment.",
      "Partnered with product and risk teams to turn raw banking signals into features, dashboards, and model-ready datasets.",
      "Contributed to production ML workflows — experimentation, validation, deployment — on an Agile data-science squad.",
    ],
    logo: "/images/experience/TD-Bank-Logo.png",
    accent: "#00B04F",
    lightLogoBg: true,
  },
  {
    company: "Elections Canada",
    role: "Junior Data Scientist",
    kind: "Co-op",
    location: "Ottawa, ON",
    period: "2024",
    bullets: [
      "Cleaned, joined, and analyzed large electoral datasets to support internal research projects.",
      "Produced exploratory analyses and visualizations that fed into operational and statistical reporting.",
      "Worked across Python and SQL pipelines to transform raw records into trustworthy, reproducible insights.",
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
    period: "2024",
    bullets: [
      "Led the migration of CI/CD pipelines from Azure DevOps Server to GitHub Actions with a full migration plan for the company's GitHub Enterprise transition.",
      "Integrated the GitHub Actions Importer into existing workflows, reaching high translation accuracy across legacy pipelines.",
      "Contributed to embedded software for autonomous drilling systems using Linux, bash, and Docker inside a scaled-Agile team.",
    ],
    logo: "/images/experience/caterpillar.png",
    accent: "#FFCD11",
    lightLogoBg: false,
  },
  {
    company: "Ford",
    role: "Test Automation Engineer",
    kind: "Internship",
    location: "Ottawa, ON",
    period: "2023",
    bullets: [
      "Built an automation pipeline for logging into nodes, processing device data, and generating structured JSON — replacing hours of manual work.",
      "Mentored a new intern on the team's automation stack, debugging process, and lab setup.",
      "Worked hands-on with Sync Infotainment, Telematics hardware, and Arduino while setting up Fully Networked Vehicle (FNV) systems for testing.",
    ],
    logo: "/images/experience/ford3.png",
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
      "Awarded Employee of the Month (July 2023) and promoted to Crew Trainer for consistent customer-service quality.",
      "Onboarded new crew members — teaching techniques and standards that kept the floor running during peak hours.",
      "Built the kind of fast, communicative teamwork that only a busy kitchen can teach you.",
    ],
    logo: "/images/experience/mcdonalds.png",
    accent: "#FFC72C",
    lightLogoBg: true,
  },
] as const
