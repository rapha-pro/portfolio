"use client"

import Link from "next/link"
import { motion } from "framer-motion"

type BrandLogoProps = {
  /** Total square size of the glyph in px. Default 36. */
  size?: number
  /** When true (mobile), hide the wordmark and show only the mark. */
  compact?: boolean
  /** Optional extra classes on the root link. */
  className?: string
}

/**
 * Purpose:
 *   Custom SVG monogram for "Raphaël". A rounded-square plate holds a
 *   geometric "R" built from three strokes; an orbiting dot adds life and
 *   picks up the current accent color via `currentColor` → `var(--accent)`.
 *
 * Args:
 *   size     — pixel size of the mark (square).
 *   compact  — when true, render only the glyph (used on mobile dock).
 *   className — extra classes applied to the outer <Link>.
 *
 * Returns:
 *   A <Link> to "#home" containing the mark + wordmark (unless compact).
 */
export function BrandLogo({ size = 36, compact = false, className = "" }: BrandLogoProps) {
  return (
    <Link
      href="#home"
      aria-label="Raphaël — home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ rotate: [0, -6, 6, 0], transition: { duration: 0.6 } }}
        className="relative inline-flex"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 40 40"
          width={size}
          height={size}
          aria-hidden
          className="drop-shadow-[0_6px_18px_var(--accent-glow)]"
        >
          <defs>
            {/* Accent-aware gradient. `currentColor` is bound to --accent below. */}
            <linearGradient id="rg-plate" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"  stopColor="currentColor" stopOpacity="0.95" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="rg-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.65" />
            </linearGradient>
          </defs>

          {/* Plate */}
          <g style={{ color: "var(--accent)" }}>
            <rect
              x="1.5" y="1.5" width="37" height="37" rx="10"
              fill="url(#rg-plate)"
            />
            {/* Inner bevel for glassmorphic lift */}
            <rect
              x="1.5" y="1.5" width="37" height="37" rx="10"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.8"
            />
          </g>

          {/* "R" — vertical + top arch + diagonal leg */}
          <g
            fill="none"
            stroke="url(#rg-stroke)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* vertical */}
            <path d="M13 28 V12" />
            {/* top arch + inward curl */}
            <path d="M13 12 H22 a5 5 0 0 1 0 10 H13" />
            {/* leg */}
            <path d="M18 22 L27 28" />
          </g>

          {/* Orbiting accent dot */}
          <motion.circle
            cx="30" cy="10" r="2"
            fill="#ffffff"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.15, 0.9],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.span>

      {!compact && (
        <span className="flex items-baseline gap-0.5">
          <span className="text-[15px] font-bold tracking-tight text-brand">
            Raphaël
          </span>
          <span className="font-mono text-[12px] font-medium text-accent">
            .dev
          </span>
        </span>
      )}
    </Link>
  )
}
