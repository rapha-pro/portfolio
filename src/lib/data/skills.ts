/**
 * Shared skills catalog.
 *
 * One source of truth for any surface that renders tech logos — the hero
 * cube, floating skill cloud, projects section, etc.
 *
 * Design notes:
 *   - Each skill has a `category` for grouping in UIs.
 *   - Each skill has an `onCube` flag. Exactly six of these are true; they
 *     map to the six faces of <SkillCube /> in declaration order.
 *   - `bg` is a tint color used on solid surfaces (chips, fallback plates).
 *     The 3D cube renders logos at full brightness, so `bg` doesn't affect
 *     the cube faces — only the chips.
 */

export type SkillCategory = "language" | "framework" | "tool"

export type Skill = {
  label: string
  category: SkillCategory
  /** Hex accent color used for chips and glows. */
  bg: string
  /** URL of the logo SVG — mostly devicons CDN. */
  src: string
  /** When true, the skill is placed on a face of the 3D hero cube. */
  onCube?: boolean
}

/**
 * Canonical skill list. Edit here once.
 *
 * Cube faces (in order): Python, C++, Docker, SQL, GitHub,
 * scikit-learn — reflecting a data-science trajectory.
 */
export const SKILLS: readonly Skill[] = [
  /* ── On the cube (data-science set) ───────────────────── */
  { label: "Python",       category: "language",  bg: "#3B82F6", onCube: true,
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { label: "C++",          category: "language",  bg: "#7C3AED", onCube: true,
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { label: "Docker",       category: "tool",      bg: "#2563EB", onCube: true,
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { label: "SQL",          category: "framework", bg: "#3B82F6", onCube: true,
    src: "/images/logos/sql.svg" },
  { label: "GitHub",       category: "tool",      bg: "#24292e", onCube: true,
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { label: "scikit-learn", category: "framework", bg: "#F7931E", onCube: true,
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },

  /* ── Other languages ──────────────────────────────────── */
  { label: "TypeScript",   category: "language",  bg: "#3178C6",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { label: "JavaScript",   category: "language",  bg: "#F7DF1E",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { label: "Java",         category: "language",  bg: "#DC2626",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { label: "C",            category: "language",  bg: "#5C6BC0",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  { label: "HTML5",        category: "language",  bg: "#E34F26",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { label: "CSS",          category: "language",  bg: "#1572B6",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { label: "Haskell",      category: "language",  bg: "#5E5086",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg" },
  { label: "SAS",          category: "language",  bg: "#0066CC",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sas/sas-original.svg" },

  /* ── Tools / platforms ────────────────────────────────── */
  { label: "Git",           category: "tool", bg: "#F05032",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { label: "Jenkins",       category: "tool", bg: "#D24939",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
  { label: "GitHub Actions",category: "tool", bg: "#2088FF",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
  { label: "Azure DevOps",  category: "tool", bg: "#0078D4",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuredevops/azuredevops-original.svg" },
  { label: "Grafana",       category: "tool", bg: "#F46800",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" },
  { label: "Linux",         category: "tool", bg: "#000000",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
  { label: "Bash",          category: "tool", bg: "#4EAA25",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" },
  { label: "Jira",          category: "tool", bg: "#0052CC",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
  { label: "PuTTY",         category: "tool", bg: "#0B1020",
    src: "/images/logos/putty.svg" },

  /* ── Frameworks / libraries / platforms ───────────────── */
  { label: "Pandas",        category: "framework", bg: "#150458",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
  { label: "NumPy",         category: "framework", bg: "#013243",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
  { label: "RAG",           category: "framework", bg: "#6D28D9",
    src: "/images/logos/rag.svg" },
  { label: "LangChain",     category: "framework", bg: "#1C3D36",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/langchain/langchain-original.svg" },
  { label: "Next.js",       category: "framework", bg: "#18181b",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { label: "MongoDB",       category: "framework", bg: "#47A248",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { label: "SQLite",        category: "framework", bg: "#003B57",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
] as const

/** Exactly the six skills flagged `onCube`, in declaration order. */
export const CUBE_SKILLS: readonly Skill[] = SKILLS.filter((s) => s.onCube)

/** Everything not on the cube — feeds the floating skill cloud. */
export const FLOATING_SKILLS: readonly Skill[] = SKILLS.filter((s) => !s.onCube)
