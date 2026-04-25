"use client"

import { ArrowRight, Download } from "lucide-react"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock"
import { SOCIALS } from "@/lib/data/socials"

type ActionBarProps = {
  contactHref?: string
  resumeHref?: string
  className?: string
}

/**
 * Purpose: Primary + secondary CTAs and the Aceternity FloatingDock social row.
 * Args: contactHref, resumeHref, className
 * Returns: CTA row + FloatingDock socials stack.
 */
export function ActionBar({
  contactHref = "#contact",
  resumeHref = "/resume.pdf",
  className = "",
}: ActionBarProps) {
  const dockItems: DockItem[] = SOCIALS.map((s) => {
    const Icon = s.icon
    return {
      title: s.label,
      icon: <Icon size={20} className="text-[color:var(--accent)]" />,
      href: s.href,
      target: s.href.startsWith("http") ? "_blank" : undefined,
      rel: s.href.startsWith("http") ? "noopener noreferrer" : undefined,
    }
  })

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        <MagneticButton
          href={contactHref}
          className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300"
          style={{ background: "linear-gradient(135deg, var(--accent), #6d28d9)", boxShadow: "0 0 24px var(--accent-glow)" }}
        >
          Get in touch
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
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

      <FloatingDock items={dockItems} />
    </div>
  )
}
