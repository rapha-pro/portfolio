"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { AnimatePresence, motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"

type ThemeToggleProps = {
  /** Px size of the button (square). Default 36. */
  size?: number
  className?: string
}

/**
 * Purpose:
 *   Animated light/dark toggle. The sun/moon icons cross-fade with a slight
 *   rotate+scale so the switch feels physical rather than binary.
 *
 * Args:
 *   size      — button diameter in px.
 *   className — extra classes merged into the button.
 *
 * Returns:
 *   A button element that flips `next-themes` theme between light/dark.
 */
export function ThemeToggle({ size = 36, className = "" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid SSR/CSR mismatch: only reveal the correct icon after mount.
  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      style={{ width: size, height: size }}
      className={`
        relative inline-flex items-center justify-center rounded-xl
        text-brand/80 hover:text-brand
        transition-colors
        hover:bg-[var(--glass-highlight)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
        ${className}
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0,  scale: 1 }}
            exit={{    opacity: 0, rotate: 90,  scale: 0.6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
