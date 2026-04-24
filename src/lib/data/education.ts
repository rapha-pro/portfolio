/**
 * Education data: schools + per-year course catalog.
 *
 * The Education tab renders SCHOOLS as the overview cards and YEARS as a
 * sub-selector that reveals a grid of Course cards. Grades are revealed on
 * hover (or tap on touch).
 *
 * Editing tips:
 *   - To add a course, append to the YEARS[...].courses array.
 *   - If you have a banner/logo for a course, drop it in
 *     /public/images/courses/ and reference the filename in `banner`.
 *   - Tint `accent` for each course to color-code the card header.
 *   - Grades default to "In progress" when `grade` is omitted.
 */

export type School = {
  name: string
  degree: string
  location: string
  period: string
  result?: string
  description: string
  logo: string | null
  /** True when the logo renders on a light card background. */
  lightLogoBg?: boolean
}

export const SCHOOLS: readonly School[] = [
  {
    name: "Carleton University",
    degree: "Bachelor of Computer Science — AI/ML stream, minor in Math & Stats",
    location: "Ottawa, ON",
    period: "2022 – Present",
    result: "11.75 / 12",
    description:
      "Fourth-year student specializing in Artificial Intelligence and Machine Learning, with a minor in Mathematics and Statistics. Dean's Honour List every term; member of Golden Key.",
    logo: "/images/carleton.png",
    lightLogoBg: true,
  },
  {
    name: "Merivale High School",
    degree: "Ontario Secondary School Diploma",
    location: "Ottawa, ON",
    period: "2020 – 2022",
    result: "Ontario Scholar",
    description:
      "Graduated as an Ontario Scholar with honours standing across math, physics, and my first computer-science course. Where it started.",
    logo: null,
  },
] as const

export type Course = {
  /** Carleton course code, e.g. "COMP 1405". */
  code: string
  /** Full course title. */
  title: string
  /** Language(s) or stack used — e.g. "Python", "Java, SQL". */
  language?: string
  /** Grade received; leave empty for "In progress". */
  grade?: string
  /** Optional one-paragraph description (Carleton calendar or yours). */
  description?: string
  /** Optional banner image under /public/images/courses/. */
  banner?: string
  /** Hex tint used for the card header accent. */
  accent: string
}

export type YearKey = "freshman" | "sophomore" | "junior" | "senior"

export type YearBlock = {
  key: YearKey
  /** Display label for the sub-tab. */
  label: string
  /** Period shown under the label. */
  period: string
  /** True when courses are currently in progress (suppresses grade reveal). */
  inProgress?: boolean
  courses: readonly Course[]
}

/**
 * Four-year arc. Junior-year course descriptions are intentionally left
 * blank so Raphaël can paste them in once — code + structure are ready.
 */
export const YEARS: readonly YearBlock[] = [
  {
    key: "freshman",
    label: "Freshman",
    period: "2022 – 2023",
    courses: [
      { code: "COMP 1405", title: "Intro to Computer Science I",  language: "Python", grade: "A+", accent: "#3B82F6" },
      { code: "COMP 1406", title: "Intro to Computer Science II", language: "Java",   grade: "A+", accent: "#DC2626" },
      { code: "COMP 1805", title: "Discrete Maths I",             grade: "A",   accent: "#8B5CF6" },
      { code: "MATH 1007", title: "Calculus I",                   grade: "A+",  accent: "#F59E0B" },
      { code: "MATH 1107", title: "Linear Algebra I",             grade: "A+",  accent: "#F59E0B" },
      { code: "STAT 2507", title: "Stats & Modelling",            language: "SAS", grade: "A+", accent: "#0EA5E9" },
    ],
  },
  {
    key: "sophomore",
    label: "Sophomore",
    period: "2023 – 2024",
    courses: [
      { code: "COMP 2401", title: "Systems Programming",          language: "C",                          grade: "A+", accent: "#64748B" },
      { code: "COMP 2402", title: "Abstract Data Types & Algorithms", language: "Java",                   grade: "A+", accent: "#DC2626" },
      { code: "COMP 2406", title: "Web Development & Databases", language: "Node.js, Express, MongoDB", grade: "A+", accent: "#10B981" },
      { code: "COMP 2404", title: "Intro to Software Engineering", language: "C++",                     grade: "A+", accent: "#7C3AED" },
      { code: "COMP 2804", title: "Discrete Structures II",       grade: "A+",  accent: "#8B5CF6" },
      { code: "MATH 2007", title: "Calculus III",                 grade: "A+",  accent: "#F59E0B" },
    ],
  },
  {
    key: "junior",
    label: "Junior",
    period: "2024 – 2025",
    courses: [
      { code: "COMP 3000", title: "Operating Systems",                                grade: "A+", banner: "/images/courses/3000_operating_systems.png",  accent: "#0EA5E9" },
      { code: "COMP 3004", title: "Object-Oriented Software Engineering", language: "C++",            banner: "/images/courses/comp3004_banner.png",        accent: "#7C3AED" },
      { code: "COMP 3005", title: "Database Management Systems",          language: "SQL, Postgres", banner: "/images/courses/comp3005_banner.png",        accent: "#10B981" },
      { code: "COMP 3007", title: "Programming Paradigms",                language: "Haskell",        banner: "/images/courses/comp3007_banner.png",        accent: "#5E5086" },
      { code: "COMP 3105", title: "Introduction to Machine Learning",     language: "Python",         banner: "/images/courses/3105_Machine Learning_cover.png", accent: "#F7931E" },
      { code: "COMP 3804", title: "Design and Analysis of Algorithms",                               banner: "/images/courses/3804_algorithms_design_cover.jpg", accent: "#EF4444" },
      { code: "MATH 3007", title: "Complex Analysis",                                               banner: "/images/courses/Math_3007_complex_analysis.jpg",   accent: "#F59E0B" },
      { code: "STAT 3504", title: "Analysis of Variance & Experimental Design",                    banner: "/images/courses/stat3504_banner.png",              accent: "#0EA5E9" },
    ],
  },
  {
    key: "senior",
    label: "Senior",
    period: "Incoming · 2025 – 2026",
    inProgress: true,
    courses: [
      { code: "COMP 4106", title: "Artificial Intelligence", language: "Python", accent: "#8B5CF6" },
      { code: "COMP 4107", title: "Neural Networks",         language: "Python", accent: "#F43F5E" },
      { code: "COMP 4601", title: "Information Retrieval",                        accent: "#0EA5E9" },
      { code: "COMP 4905", title: "Honours Project",                              accent: "#10B981" },
      { code: "STAT 4502", title: "Survey Sampling",                              accent: "#F59E0B" },
    ],
  },
] as const
