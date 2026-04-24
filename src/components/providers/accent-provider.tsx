"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

/**
 * Available accent identifiers. Each maps to an `.accent-*` class defined
 * in globals.css which overrides the `--accent*` CSS variables.
 */
export type Accent = "accent-violet" | "accent-cyan" | "accent-amber"

/** Single source of truth for accent metadata used across the UI. */
export const ACCENTS: ReadonlyArray<{
  id: Accent
  label: string
  swatch: string // hex used purely for the picker swatch
}> = [
  { id: "accent-violet", label: "Violet", swatch: "#8B5CF6" },
  { id: "accent-cyan",   label: "Cyan",   swatch: "#06B6D4" },
  { id: "accent-amber",  label: "Amber",  swatch: "#F59E0B" },
]

const DEFAULT_ACCENT: Accent = "accent-violet"
const STORAGE_KEY = "app-accent"
const ALL_CLASSES: Accent[] = ["accent-violet", "accent-cyan", "accent-amber"]

type AccentContextType = {
  accent: Accent
  setAccent: (next: Accent) => void
}

const AccentContext = createContext<AccentContextType | undefined>(undefined)

/**
 * Purpose:
 *   Toggle the `.accent-*` class on <html> so CSS variables re-cascade.
 *
 * Args:
 *   accent — the accent id to apply.
 */
function applyAccent(accent: Accent): void {
  const root = document.documentElement
  root.classList.remove(...ALL_CLASSES)
  root.classList.add(accent)
}

/**
 * Purpose:
 *   Provides accent state + a setter that persists to localStorage and
 *   mutates the root class so CSS variables update globally.
 *
 * Args:
 *   children — subtree that consumes the context.
 *
 * Returns:
 *   A context provider wrapping `children`.
 */
export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccentState] = useState<Accent>(DEFAULT_ACCENT)

  useEffect(() => {
    const saved = (typeof window !== "undefined"
      ? (localStorage.getItem(STORAGE_KEY) as Accent | null)
      : null)
    const initial = saved && ALL_CLASSES.includes(saved) ? saved : DEFAULT_ACCENT
    setAccentState(initial)
    applyAccent(initial)
  }, [])

  const value = useMemo<AccentContextType>(
    () => ({
      accent,
      setAccent: (next) => {
        setAccentState(next)
        try {
          localStorage.setItem(STORAGE_KEY, next)
        } catch {
          /* storage may be unavailable (SSR/privacy) — ignore */
        }
        applyAccent(next)
      },
    }),
    [accent],
  )

  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
}

/**
 * Purpose:
 *   Hook for reading/writing the accent. Throws if used outside the provider.
 *
 * Returns:
 *   `{ accent, setAccent }`.
 */
export function useAccent(): AccentContextType {
  const ctx = useContext(AccentContext)
  if (!ctx) throw new Error("useAccent must be used within AccentProvider")
  return ctx
}
