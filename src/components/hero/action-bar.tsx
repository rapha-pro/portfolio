"use client"

import { ArrowRight, Download } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { SocialIconButton } from "@/components/ui/social-icon-button"
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
 *   Primary + secondary CTAs and a row of animated social icon buttons.
 *   CTAs are magnetic (cursor-following) and the socials use the shared
 *   SocialIconButton pill with per-icon hover micro-animations.
 *
 * Args:
 *   contactHref — primary CTA destination.
 *   resumeHref  — secondary CTA / file download URL.
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
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-app bg-[var(--glass)] px-6 py-3 text-sm font-medium text-brand/85 backdrop-blur-md transition-all duration-300 hover:bg-[var(--glass-strong)]"
        >
          <Download size={14} />
          Resume
        </MagneticButton>
      </div>

      {/* Socials */}
      <div className="flex items-center gap-3">
        {SOCIALS.map((s) => (
          <SocialIconButton
            key={s.label}
            icon={s.icon}
            label={s.label}
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
          />
        ))}
      </div>
    </div>
  )
}
