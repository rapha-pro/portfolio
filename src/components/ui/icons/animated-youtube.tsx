"use client"

import { motion } from "framer-motion"

type AnimatedYoutubeProps = {
  size?: number
  className?: string
}

/**
 * Purpose:
 *   YouTube play-button mark. On hover the rounded-rect container scales up
 *   slightly and the play triangle pulses, mimicking the YouTube hover state.
 *
 * Args:
 *   size      -- width/height in px. Default 20.
 *   className -- extra classes on the root <motion.svg>.
 *
 * Returns:
 *   A motion SVG that inherits `currentColor`.
 */
export function AnimatedYoutube({ size = 20, className = "" }: AnimatedYoutubeProps) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      initial="idle"
      whileHover="hover"
      whileTap={{ scale: 0.92 }}
      fill="currentColor"
      className={className}
      aria-hidden
    >
      {/* Rounded-rect background -- scales up on hover */}
      <motion.path
        d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
        variants={{
          idle:  { scale: 1 },
          hover: { scale: 1.08 },
        }}
        style={{ transformOrigin: "12px 12px", transformBox: "view-box" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Play triangle -- brightens on hover */}
      <motion.polygon
        points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02"
        fill="var(--bg, #fff)"
        variants={{
          idle:  { scale: 1,    opacity: 0.9 },
          hover: { scale: 1.15, opacity: 1   },
        }}
        style={{ transformOrigin: "12px 12px", transformBox: "view-box" }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.svg>
  )
}
