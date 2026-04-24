"use client"

import { motion } from "framer-motion"

type AnimatedMailProps = {
  size?: number
  className?: string
}

/**
 * Purpose:
 *   Envelope mark with an animated flap. On hover the flap rotates open,
 *   revealing a little letter inside that slides up. Releases back closed.
 *
 * Args:
 *   size      — width/height in px. Default 20.
 *   className — extra classes on the root.
 *
 * Returns:
 *   A motion SVG that inherits `currentColor`.
 */
export function AnimatedMail({ size = 20, className = "" }: AnimatedMailProps) {
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
        hover: { scale: 1.06 },
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* Envelope body */}
      <rect x="3" y="6" width="18" height="13" rx="2.2" />

      {/* Letter inside (revealed when flap opens) */}
      <motion.rect
        x="7"
        y="9"
        width="10"
        height="6"
        rx="0.5"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        variants={{
          idle:  { y: 2, opacity: 0 },
          hover: { y: -1, opacity: 1 },
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />

      {/* Flap — origin set near the top of the envelope so it rotates open */}
      <motion.path
        d="M3.4 7 L12 13 L20.6 7"
        style={{ transformOrigin: "12px 7px", transformBox: "view-box" }}
        variants={{
          idle:  { rotateX: 0,   y: 0 },
          hover: { rotateX: 180, y: -1 },
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.svg>
  )
}
