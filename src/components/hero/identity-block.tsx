"use client"

import { Cursor, useTypewriter } from "react-simple-typewriter"
import { HERO_COPY } from "@/lib/data/hero-copy"

type IdentityBlockProps = {
  /** Display name. Defaults to HERO_COPY.firstName. */
  name?: string
  /** Rotating roles fed to the typewriter. */
  roles?: readonly string[]
}

/**
 * Purpose:
 *   The hero "headline" stack — greeting kicker, first name with a glowing
 *   gradient underline, and a typewriter line that loops through roles.
 *
 * Args:
 *   name  — overrides the displayed name.
 *   roles — overrides the typewriter word list.
 *
 * Returns:
 *   A vertical flex stack of three typographic layers.
 */
export function IdentityBlock({
  name = HERO_COPY.firstName + " " + HERO_COPY.lastName,
  roles = HERO_COPY.roles,
}: IdentityBlockProps) {
  const [text] = useTypewriter({
    words: [...roles],
    loop: true,
    typeSpeed: 90,
    deleteSpeed: 55,
    delaySpeed: 2800,
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Kicker */}
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-subtle">
        {HERO_COPY.greetingKicker}
      </p>

      {/* Name with animated gradient underline */}
      <h1 className="relative text-5xl font-black leading-none tracking-tight text-brand lg:text-7xl">
        {name}
        <span
          aria-hidden
          className="absolute -bottom-2 left-0 h-1 w-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--accent), #8b5cf6, #e11d48)",
            filter: "blur(2px)",
          }}
        />
      </h1>

      {/* Typewriter role */}
      <h2 className="text-xl font-light text-muted lg:text-2xl">
        <span className="italic text-subtle me-2">aspiring </span>
        <span className="font-semibold text-brand">{text}</span>
        <Cursor cursorBlinking cursorStyle="|" cursorColor="var(--accent)" />
      </h2>
    </div>
  )
}
