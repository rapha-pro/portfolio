"use client"

import { motion } from "framer-motion"

type AnimatedLinkedinProps = {
  size?: number
  className?: string
}

/**
 * Purpose:
 *   LinkedIn "in" mark. On hover the dot above the 'i' pops up and back
 *   while the whole mark scales — a subtle, branded micro-interaction.
 *
 * Args:
 *   size      — width/height in px. Default 20.
 *   className — extra classes on the root.
 *
 * Returns:
 *   A motion SVG using `currentColor`.
 */
export function AnimatedLinkedin({ size = 20, className = "" }: AnimatedLinkedinProps) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      initial="idle"
      whileHover="hover"
      whileTap={{ scale: 0.92 }}
      variants={{
        idle:  { scale: 1 },
        hover: { scale: 1.08 },
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      fill="currentColor"
      className={className}
      aria-hidden
    >
      {/* Rounded square backdrop */}
      <rect x="0.5" y="0.5" width="23" height="23" rx="4" fill="currentColor" opacity="0.12" />
      {/* 'in' body: lower-i stem + 'n' */}
      <path d="M3.8 9.5h2.6V19H3.8V9.5zm3.8 0h2.5v1.3h.04c.35-.62 1.2-1.28 2.47-1.28 2.64 0 3.13 1.65 3.13 3.8V19h-2.6v-4.34c0-1.04-.02-2.37-1.45-2.37-1.45 0-1.67 1.1-1.67 2.3V19H7.6V9.5z" />
      {/* The jumping dot */}
      <motion.circle
        cx="5.1"
        cy="6.6"
        r="1.55"
        variants={{
          idle:  { y: 0 },
          hover: { y: [-3, 0, -1.5, 0] },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </motion.svg>
  )
}
