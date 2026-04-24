"use client"

import { ArrowRight, Download } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { SOCIALS } from "@/lib/data/socials"

type ActionBarProps = {
  /** Where "Get in touch" points. Default "#contact". */
  contactHref?: string
  /** Resume file path. Default "/resume.pdf". */
  resumeHref?: string
  className?: string
}

/**
 * Purpose:
 *   Primary + secondary CTAs and a row of social icon buttons. Every
 *   button is magnetic — cursor-following with an elastic snap-back.
 *
 * Args:
 *   contactHref — destination for the primary CTA.
 *   resumeHref  — destination for the secondary CTA.
 *   className   — extra classes on the root.
 *
 * Returns:
 *   A vertical stack: CTA row + socials row.
 */
export function ActionBar({
  contactHref = "#contact",
  resumeHref = "/resume.pdf",
  className = "",
}: ActionBarProps) {
  const visibleSocials = SOCIALS.filter((s) => s.href !== "#")

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Primary + secondary CTA */}
      <div className="flex flex-wrap items-center gap-4">
        <MagneticButton
          href={contactHref}
          className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, var(--accent), #6d28d9)",
            boxShadow: "0 0 24px var(--accent-glow)",
          }}
        >
          Get in touch
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </MagneticButton>

        <MagneticButton
          href={resumeHref}
          className="inline-flex items-center gap-2 rounded-xl border border-app bg-[var(--glass)] px-6 py-3 text-sm font-medium text-brand/85 backdrop-blur-md transition-all duration-300 hover:bg-[var(--glass-strong)]"
        >
          <Download size={14} />
          Resume
        </MagneticButton>
      </div>

      {/* Socials */}
      <div className="flex items-center gap-3">
        {visibleSocials.map(({ icon: Icon, href, label }) => (
          <MagneticButton
            key={label}
            href={href}
            aria-label={label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-app bg-[var(--glass)] text-muted backdrop-blur-md transition-all duration-300 hover:text-accent"
          >
            <Icon size={16} />
          </MagneticButton>
        ))}
      </div>
    </div>
  )
}
