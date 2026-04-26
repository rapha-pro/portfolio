/**
 * Tech logo lookup utility.
 *
 * Merges the canonical SKILLS list with an extended map for common
 * technologies that appear in project descriptions but not on the cube/marquee.
 *
 * Usage:
 *   import { getTechLogo } from "@/lib/tech-logo"
 *   const src = getTechLogo("React") // returns devicons CDN URL or undefined
 */

import { SKILLS } from "@/lib/data/skills"

/** Map of lowercase tech name -> logo image URL. Built lazily on first call. */
let _cache: Map<string, string> | null = null

const EXTRA: Record<string, string> = {
  "react":        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "next.js":      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  "node.js":      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "express.js":   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  "flask":        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  "pytorch":      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  "postgresql":   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  "firebase":     "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  "tailwind css": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  "tensorflow":   "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  "pygame":       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "html":         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "html5":        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "css":          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "css3":         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "pug":          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pug/pug-plain.svg",
  "sqlite":       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
  "mysql":        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  "redux":        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
  "graphql":      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  "rust":         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
  "go":           "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
  "swift":        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
  "kotlin":       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  "vue.js":       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  "angular":      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
  "svelte":       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
  "aws":          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  "vercel":       "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  "github actions":"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg",
}

function buildCache(): Map<string, string> {
  const map = new Map<string, string>()
  // Seed from canonical SKILLS list
  for (const skill of SKILLS) {
    map.set(skill.label.toLowerCase(), skill.src)
  }
  // Add / override with the extra map
  for (const [key, src] of Object.entries(EXTRA)) {
    map.set(key, src)
  }
  return map
}

/**
 * Purpose:
 *   Looks up the logo image URL for a technology name.
 *   Case-insensitive. Returns undefined when no logo is known.
 *
 * Args:
 *   name -- technology display name (e.g. "React", "PyTorch").
 *
 * Returns:
 *   Logo image URL string, or undefined.
 */
export function getTechLogo(name: string): string | undefined {
  if (!_cache) _cache = buildCache()
  return _cache.get(name.toLowerCase())
}
