"use client"

import { Cursor, useTypewriter } from "react-simple-typewriter"
import { HERO_COPY } from "@/lib/data/hero-copy"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"

type IdentityBlockProps = {
  firstName?: string
  lastName?: string
  roles?: readonly string[]
}

/**
 * Purpose: Hero headline stack -- greeting kicker, name as Aceternity
 *   TextHoverEffect SVG (accent gradient sweeps on cursor hover), and a
 *   typewriter role line below.
 *
 *   Desktop: first + last name on a single line (wide viewBox, one SVG).
 *   Mobile:  two stacked SVGs so each word fills the narrow viewport.
 *
 * Args: firstName, lastName, roles
 * Returns: Kicker + TextHoverEffect name + typewriter.
 */
export function IdentityBlock({
  firstName = HERO_COPY.firstName,
  lastName  = HERO_COPY.lastName,
  roles     = HERO_COPY.roles,
}: IdentityBlockProps) {
  const [text] = useTypewriter({
    words: [...roles],
    loop: true,
    typeSpeed: 90,
    deleteSpeed: 55,
    delaySpeed: 2800,
  })

  const first = firstName.toUpperCase()
  const last  = lastName.toUpperCase()

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-subtle">
        {HERO_COPY.greetingKicker}
      </p>

      {/* Single-line name for all screen sizes */}
      <div className="-mx-1">
        <TextHoverEffect
          text={`${first} ${last}`}
          duration={0.12}
          className="h-14 sm:h-16 lg:h-20"
          viewBox="0 0 580 100"
        />
      </div>

      <h2 className="text-xl font-light text-muted lg:text-2xl">
        <span className="italic text-subtle me-2">aspiring </span>
        <span className="font-semibold text-brand">{text}</span>
        <Cursor cursorBlinking cursorStyle="|" cursorColor="var(--accent)" />
      </h2>
    </div>
  )
}
