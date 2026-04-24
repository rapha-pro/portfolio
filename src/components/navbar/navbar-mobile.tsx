"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { NAV_ITEMS } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"
import { AccentPickerDropdown } from "./accent-picker"

/**
 * Purpose:
 *   Determine which nav section is currently most in view, so the dock can
 *   highlight it. Mirrors the desktop scroll-spy behavior.
 *
 * Returns:
 *   The active href string (e.g. "#home").
 */
function useActiveSection(): string {
  const [activeHref, setActiveHref] = useState<string>("#home")

  useEffect(() => {
    const syncFromHash = () =>
      setActiveHref(window.location.hash || "#home")
    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)

    const ids = NAV_ITEMS.map((i) => i.href.replace("#", ""))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) {
      return () => window.removeEventListener("hashchange", syncFromHash)
    }

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActiveHref(`#${visible.target.id}`)
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.1, 0.3, 0.6] },
    )
    sections.forEach((s) => io.observe(s))

    return () => {
      window.removeEventListener("hashchange", syncFromHash)
      io.disconnect()
    }
  }, [])

  return activeHref
}

/**
 * Purpose:
 *   Mobile bottom dock. Modern-app style: a floating glass pill centered
 *   at the bottom, _not_ full-width. Shows icon-only nav items, the accent
 *   picker as a dropdown, and the theme toggle. Respects safe-area inset.
 *
 * Returns:
 *   A fixed <div> positioned bottom-center (hidden on md+).
 */
export function NavbarMobile() {
  const activeHref = useActiveSection()

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="
        fixed left-1/2 z-50 -translate-x-1/2 md:hidden
        bottom-[max(16px,env(safe-area-inset-bottom))]
      "
    >
      <div
        className="
          relative flex items-center gap-1 overflow-hidden rounded-2xl
          border border-app bg-[var(--glass-strong)]
          px-2 py-2
          backdrop-blur-2xl backdrop-saturate-150
          shadow-[var(--shadow-2)]
          glass-bevel
        "
      >
        {/* Accent wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(200px 60px at 50% 100%, var(--accent-soft), transparent 70%)",
          }}
        />

        {/* Nav items */}
        <nav className="relative flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = item.href === activeHref
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={`
                  relative inline-flex h-10 w-10 items-center justify-center rounded-xl
                  transition-colors
                  ${active ? "text-accent" : "text-brand/70 hover:text-brand"}
                `}
              >
                {active && (
                  <motion.span
                    layoutId="dock-active"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "var(--glass-highlight)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.35), 0 0 20px -4px var(--accent-glow)",
                    }}
                  />
                )}
                <motion.span
                  whileTap={{ scale: 0.85 }}
                  className="relative inline-flex"
                >
                  <Icon size={18} />
                </motion.span>
              </Link>
            )
          })}
        </nav>

        <span aria-hidden className="mx-1 h-6 w-px bg-[var(--glass-border)]" />

        {/* Accent dropdown + theme toggle */}
        <div className="relative flex items-center gap-0.5">
          <AccentPickerDropdown align="top" />
          <ThemeToggle size={40} />
        </div>
      </div>
    </motion.div>
  )
}
