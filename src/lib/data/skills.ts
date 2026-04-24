/**
 * Shared skills catalog.
 *
 * One source of truth for any surface that renders tech logos — the hero
 * cube, marquee, projects section, etc. Keep this list ordered roughly by
 * importance since the cube's 6 faces are assigned in order.
 */

export type Skill = {
  /** Human-readable name shown in marquees, tooltips, chips. */
  label: string
  /** Hex color used behind the icon on solid surfaces (e.g. cube face tint). */
  bg: string
  /** URL of the icon SVG. devicons CDN by default. */
  src: string
}

export const SKILLS: readonly Skill[] = [
  { label: "Python",  bg: "#3B82F6", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { label: "React",   bg: "#06B6D4", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { label: "Docker",  bg: "#2563EB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { label: "Next.js", bg: "#18181b", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { label: "Java",    bg: "#DC2626", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { label: "C++",     bg: "#7C3AED", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
] as const
