"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Palette, Check } from "lucide-react"
import { ACCENTS, useAccent, type Accent } from "@/components/providers/accent-provider"

/* ══════════════════════════════════════════════════════════
   SWATCH VARIANT (desktop)
   Three color dots side-by-side with a spring-animated ring
   that slides onto the selected swatch.
═══════════════════════════════════════════════════════════ */

type AccentPickerSwatchesProps = { className?: string }

/**
 * Purpose:
 *   Compact three-dot accent picker. The active ring uses a shared
 *   Framer Motion layoutId so it smoothly slides between swatches.
 *
 * Args:
 *   className — extra classes on the wrapping <div>.
 *
 * Returns:
 *   A horizontal group of colored swatch buttons.
 */
export function AccentPickerSwatches({ className = "" }: AccentPickerSwatchesProps) {
  const { accent, setAccent } = useAccent()

  return (
    <div
      role="radiogroup"
      aria-label="Accent color"
      className={`flex items-center gap-1.5 ${className}`}
    >
      {ACCENTS.map((a) => {
        const active = accent === a.id
        return (
          <button
            key={a.id}
            role="radio"
            aria-checked={active}
            aria-label={`${a.label} accent`}
            title={a.label}
            onClick={() => setAccent(a.id)}
            className="relative inline-flex h-6 w-6 items-center justify-center rounded-full
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <motion.span
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="h-4 w-4 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
              style={{
                background: a.swatch,
                boxShadow: active
                  ? `0 0 0 2px var(--bg), 0 0 0 4px ${a.swatch}, 0 0 18px -2px ${a.swatch}`
                  : undefined,
              }}
            />
            {active && (
              <motion.span
                layoutId="accent-ring"
                transition={{ type: "spring", stiffness: 500, damping: 34 }}
                className="pointer-events-none absolute inset-0 rounded-full"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   DROPDOWN VARIANT (mobile)
   Compact trigger with color dot; opens a small glass panel.
═══════════════════════════════════════════════════════════ */

type AccentPickerDropdownProps = {
  /** Where to anchor the popover relative to the trigger. */
  align?: "bottom" | "top"
  className?: string
}

/**
 * Purpose:
 *   Mobile-first accent picker: a palette-icon button that opens a small
 *   list of accent options. Click outside / Escape closes it.
 *
 * Args:
 *   align    — "top" opens upward (use inside a bottom dock), "bottom" opens
 *              downward. Default "top".
 *   className — extra classes on the trigger button.
 *
 * Returns:
 *   A trigger button plus an animated popover (AnimatePresence).
 */
export function AccentPickerDropdown({
  align = "top",
  className = "",
}: AccentPickerDropdownProps) {
  const { accent, setAccent } = useAccent()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return

    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const current = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0]

  const panelPos =
    align === "top"
      ? "bottom-[calc(100%+10px)] right-0"
      : "top-[calc(100%+10px)] right-0"

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Change accent color"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`
          relative inline-flex h-10 w-10 items-center justify-center rounded-xl
          text-brand/80 hover:text-brand
          hover:bg-[var(--glass-highlight)]
          transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
          ${className}
        `}
      >
        <Palette size={18} />
        {/* tiny color dot indicating current accent */}
        <span
          aria-hidden
          className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-[var(--bg-elevated)]"
          style={{ background: current.swatch }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Accent color"
            initial={{ opacity: 0, y: align === "top" ? 8 : -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{    opacity: 0, y: align === "top" ? 8 : -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute ${panelPos} z-[60] min-w-[148px] overflow-hidden rounded-xl
                        glass-strong glass-bevel border-app
                        shadow-[var(--shadow-2)]`}
          >
            <ul className="p-1">
              {ACCENTS.map((a) => {
                const active = a.id === accent
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setAccent(a.id as Accent)
                        setOpen(false)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm
                                 text-brand/85 hover:bg-[var(--glass-highlight)] hover:text-brand
                                 transition-colors"
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{
                          background: a.swatch,
                          boxShadow: `0 0 10px -2px ${a.swatch}`,
                        }}
                      />
                      <span className="flex-1 text-left">{a.label}</span>
                      {active && <Check size={14} className="text-accent" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
