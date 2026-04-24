"use client"

import { NavbarDesktop } from "./navbar-desktop"
import { NavbarMobile } from "./navbar-mobile"

/**
 * Purpose:
 *   Responsive navbar entry point. Renders both the desktop (top) and
 *   mobile (bottom-floating-dock) variants; each is gated by its own
 *   Tailwind breakpoint classes, so only one is visible at a time.
 *
 * Returns:
 *   A React fragment wrapping both navbar variants.
 */
export function Navbar() {
  return (
    <>
      <NavbarDesktop />
      <NavbarMobile />
    </>
  )
}

export { NavbarDesktop, NavbarMobile }
