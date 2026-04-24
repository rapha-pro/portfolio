"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useState, type ReactNode } from "react"

export type TabDef = {
  /** Stable key used by React and for state. */
  key: string
  /** Visible label. */
  label: string
  /** Small icon node rendered left of the label. */
  icon: ReactNode
  /** The panel rendered when the tab is active. */
  content: ReactNode
}

type TabSwitcherProps = {
  tabs: readonly TabDef[]
  /** Key of the tab to open on first render. Defaults to the first tab. */
  defaultTab?: string
  className?: string
}

/**
 * Purpose:
 *   Stunning animated tab switcher. Tabs sit in a glass pill bar; a single
 *   shared `layoutId` element slides under the active tab. Content crossfades
 *   (and slides up) between tabs via AnimatePresence.
 *
 * Args:
 *   tabs       — the tab definitions + panels.
 *   defaultTab — optional initial tab key.
 *   className  — extra classes on the root wrapper.
 *
 * Returns:
 *   A tab bar + animated content area.
 */
export function TabSwitcher({
  tabs,
  defaultTab,
  className = "",
}: TabSwitcherProps) {
  const [activeKey, setActiveKey] = useState<string>(
    defaultTab ?? tabs[0]?.key ?? "",
  )
  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0]

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {/* Tab bar */}
      <div className="flex w-full justify-center">
        <div
          role="tablist"
          aria-label="About sections"
          className="flex flex-wrap items-center gap-1 rounded-2xl border border-app bg-[var(--glass)] p-1.5 backdrop-blur-md"
        >
          {tabs.map((t) => {
            const isActive = t.key === active?.key
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${t.key}`}
                onClick={() => setActiveKey(t.key)}
                className={`
                  relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
                  transition-colors duration-200
                  ${isActive ? "text-white" : "text-muted hover:text-brand"}
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="about-tab-active"
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--accent), #6d28d9)",
                      boxShadow: "0 0 22px -6px var(--accent-glow)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="flex h-4 w-4 items-center justify-center">
                  {t.icon}
                </span>
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Panels */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.key}
            id={`panel-${active?.key}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {active?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
 * Inline icon set — keeps this component dependency-free for lucide-react
 * version quirks. Each icon inherits currentColor so it retints with text.
 * ═══════════════════════════════════════════════════════════════════════════ */

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
}

/** Briefcase mark for Experience. */
export function IconBriefcase() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  )
}

/** Graduation cap for Education. */
export function IconGrad() {
  return (
    <svg {...iconProps}>
      <path d="M2 10 12 5l10 5-10 5Z" />
      <path d="M6 12v4c2 1.5 4 2 6 2s4-.5 6-2v-4" />
    </svg>
  )
}

/** Trophy for Achievements. */
export function IconTrophy() {
  return (
    <svg {...iconProps}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M17 5h3a2 2 0 0 1-2 4" />
      <path d="M7 5H4a2 2 0 0 0 2 4" />
    </svg>
  )
}

/** Sparkles for Hobbies (life outside the terminal). */
export function IconSparkles() {
  return (
    <svg {...iconProps}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="M6 6l2.5 2.5" />
      <path d="M15.5 15.5 18 18" />
      <path d="M18 6l-2.5 2.5" />
      <path d="M8.5 15.5 6 18" />
    </svg>
  )
}
