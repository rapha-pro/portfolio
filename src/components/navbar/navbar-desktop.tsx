"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { BrandLogo } from "./brand-logo"
import { NAV_ITEMS } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"
import { AccentPickerSwatches } from "./accent-picker"

/**
 * Purpose:
 *   Spring-tracks the viewport scroll position as a 0→1 "condensed" value.
 *   Used to shrink padding, tighten the border radius, and bump blur/shadow
 *   once the user has scrolled past ~40px.
 *
 * Returns:
 *   A motion value in [0, 1].
 */
function useScrollCondensed() {
  const raw = useMotionValue(0)
  const condensed = useSpring(raw, { stiffness: 220, damping: 28 })

  useEffect(() => {
    const onScroll = () => {
      const t = Math.min(1, Math.max(0, window.scrollY / 80))
      raw.set(t)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [raw])

  return condensed
}

type NavLinksProps = {
  /** href of the item currently treated as active (hash). */
  activeHref: string
  /** Click handler — typically updates active state. */
  onItemClick: (href: string) => void
}

/**
 * Purpose:
 *   Horizontal row of nav links with a shared Framer `layoutId` pill that
 *   slides to the active item. Each link also does a small icon lift on hover.
 *
 * Args:
 *   activeHref  — href of the item that should show the pill.
 *   onItemClick — invoked with the item's href on click.
 *
 * Returns:
 *   A <nav> of links.
 */
function NavLinks({ activeHref, onItemClick }: NavLinksProps) {
  return (
    <nav className="relative flex items-center gap-0.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const active = item.href === activeHref

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onItemClick(item.href)}
            className={`
              group relative inline-flex items-center gap-2 rounded-xl px-3 py-2
              text-sm font-medium transition-colors
              ${active ? "text-brand" : "text-brand/70 hover:text-brand"}
            `}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 -z-10 rounded-xl"
                style={{
                  background: "var(--glass-highlight)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 18px -8px var(--accent-glow)",
                }}
              />
            )}
            <motion.span
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2"
            >
              <Icon
                size={15}
                className={active ? "text-accent" : "text-brand/60 group-hover:text-accent"}
              />
              <span>{item.label}</span>
            </motion.span>
          </Link>
        )
      })}
    </nav>
  )
}

/**
 * Purpose:
 *   The desktop top navbar. Floats 16px from the top, centered at
 *   ~min(1120px, 92vw). As the user scrolls, the container condenses:
 *   tighter padding, stronger blur and shadow.
 *
 * Returns:
 *   A fixed <header> (hidden on <md screens).
 */
export function NavbarDesktop() {
  const condensed = useScrollCondensed()
  const [activeHref, setActiveHref] = useState<string>("#home")

  // Condensed container transforms
  const padY       = useTransform(condensed, [0, 1], [12, 8])
  const padX       = useTransform(condensed, [0, 1], [16, 14])
  const radius     = useTransform(condensed, [0, 1], [20, 18])
  const blur       = useTransform(condensed, [0, 1], [14, 22])
  const backdropFx = useTransform(blur, (b) => `blur(${b}px) saturate(160%)`)

  // Sync active section from URL hash and scroll-spy
  useEffect(() => {
    const syncFromHash = () =>
      setActiveHref(window.location.hash || "#home")
    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)

    // Scroll-spy: whichever section is most in-view wins
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
      { rootMargin: "-40% 0px -50% 0px", threshold: [0.1, 0.3, 0.6] },
    )
    sections.forEach((s) => io.observe(s))

    return () => {
      window.removeEventListener("hashchange", syncFromHash)
      io.disconnect()
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-4 z-50 hidden w-[min(1120px,94vw)] -translate-x-1/2 md:block"
    >
      <motion.div
        style={{
          paddingTop: padY,
          paddingBottom: padY,
          paddingLeft: padX,
          paddingRight: padX,
          borderRadius: radius,
          backdropFilter: backdropFx,
          WebkitBackdropFilter: backdropFx,
        }}
        className="
          relative overflow-hidden border border-app
          bg-[var(--glass-strong)]
          shadow-[var(--shadow-glow)]
          glass-bevel
        "
      >
        {/* Accent wash — subtle gradient that picks up the current accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.6]"
          style={{
            background:
              "radial-gradient(600px 120px at 20% 0%, var(--accent-soft), transparent 70%), radial-gradient(500px 100px at 90% 100%, var(--accent-soft), transparent 70%)",
          }}
        />

        <div className="relative flex items-center justify-between">
          <BrandLogo size={34} />

          <NavLinks activeHref={activeHref} onItemClick={setActiveHref} />

          <div className="flex items-center gap-3">
            <AccentPickerSwatches />
            <span aria-hidden className="h-5 w-px bg-[var(--glass-border)]" />
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}
