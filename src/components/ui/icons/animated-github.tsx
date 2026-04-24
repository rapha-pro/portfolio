"use client"

import { motion } from "framer-motion"

type AnimatedGithubProps = {
  size?: number
  className?: string
}

/**
 * Purpose:
 *   GitHub octocat mark as an SVG. On hover the whole mark tilts + scales
 *   slightly, and on tap it bounces — giving the static logo some life.
 *
 * Args:
 *   size      — width/height in px. Default 20.
 *   className — extra classes on the root <motion.svg>.
 *
 * Returns:
 *   A motion SVG that inherits `currentColor`.
 */
export function AnimatedGithub({ size = 20, className = "" }: AnimatedGithubProps) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      initial={{ rotate: 0, scale: 1 }}
      whileHover={{ rotate: [0, -12, 12, -6, 6, 0], scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.762-1.605-2.665-.305-5.467-1.335-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </motion.svg>
  )
}
