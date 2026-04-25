"use client"

import {
  useMotionValue,
  useSpring,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion"
import { useRef, useState } from "react"

export type DockItem = {
  title: string
  icon: React.ReactNode
  href: string
  target?: string
  rel?: string
}

type FloatingDockProps = {
  items: DockItem[]
  /** Extra classes applied to the desktop dock bar. */
  className?: string
  /** Extra classes applied to the mobile icon row. */
  mobileClassName?: string
}

/**
 * Purpose:
 *   Aceternity-style floating dock. Desktop: a magnifying icon bar where
 *   nearby icons scale up as the cursor approaches. Mobile: a compact
 *   horizontal row of equal-size icon pills.
 *
 * Args:
 *   items         — array of dock items (title, icon, href).
 *   className     — extra classes on the desktop bar.
 *   mobileClassName — extra classes on the mobile row.
 *
 * Returns:
 *   A dock that switches between desktop magnified bar and mobile row.
 */
export function FloatingDock({ items, className = "", mobileClassName = "" }: FloatingDockProps) {
  return (
    <>
      <FloatingDockDesktop items={items} className={className} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  )
}

/** Mobile: simple pill row, no magnification. */
function FloatingDockMobile({ items, className }: { items: DockItem[]; className: string }) {
  return (
    <div className={`flex items-center gap-3 md:hidden ${className}`}>
      {items.map((item) => (
        <a
          key={item.title}
          href={item.href}
          target={item.target}
          rel={item.rel}
          aria-label={item.title}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-app bg-[var(--glass)] backdrop-blur-md transition-colors duration-200 hover:bg-[var(--glass-strong)]"
        >
          {item.icon}
        </a>
      ))}
    </div>
  )
}

/** Desktop: magnifying dock bar — icons scale when the cursor approaches. */
function FloatingDockDesktop({ items, className }: { items: DockItem[]; className: string }) {
  /** pageX of the cursor inside the dock; Infinity = cursor is outside. */
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`hidden h-14 items-end gap-3 rounded-2xl border border-app bg-[var(--glass)] px-4 pb-2.5 backdrop-blur-md md:flex ${className}`}
    >
      {items.map((item) => (
        <DockIcon key={item.title} mouseX={mouseX} item={item} />
      ))}
    </motion.div>
  )
}

type DockIconProps = {
  mouseX: ReturnType<typeof useMotionValue<number>>
  item: DockItem
}

/**
 * Purpose:
 *   A single dock icon that magnifies when the cursor is nearby.
 *   Uses Framer Motion springs for smooth physics-based scaling.
 *
 * Args:
 *   mouseX — shared page-x motion value from the dock wrapper.
 *   item   — the dock item to render.
 *
 * Returns:
 *   A scaled icon with a floating label on hover.
 */
function DockIcon({ mouseX, item }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  /** Distance from cursor to this icon's center on the x-axis. */
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const sizeTransform  = useTransform(distance, [-140, 0, 140], [36, 68, 36])
  const iconTransform  = useTransform(distance, [-140, 0, 140], [18, 34, 18])

  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 180, damping: 14 })
  const iconSize = useSpring(iconTransform, { mass: 0.1, stiffness: 180, damping: 14 })

  return (
    <a
      href={item.href}
      target={item.target}
      rel={item.rel}
      aria-label={item.title}
      className="relative flex items-end"
    >
      {/* Floating label */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            transition={{ duration: 0.18 }}
            className="absolute -top-9 left-1/2 whitespace-nowrap rounded-lg border border-app bg-[var(--glass)] px-2.5 py-1 text-[11px] font-medium text-brand backdrop-blur-sm"
          >
            {item.title}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon tile */}
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center justify-center rounded-full border border-app bg-[var(--glass)] backdrop-blur-sm transition-[background] duration-200 hover:bg-[var(--glass-strong)]"
      >
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center"
        >
          {item.icon}
        </motion.div>
      </motion.div>
    </a>
  )
}
