"use client"

import { motion } from "framer-motion"
import { FloatingDock, type DockItem } from "@/components/ui/floating-dock"
import { SOCIALS } from "@/lib/data/socials"
import { PROFILE } from "@/lib/data/contact-copy"
import { BrandLogo } from "@/components/brand-logo"
import { LionelCard } from "./lionel-card"
import { PicBreezyCard } from "./picbreezy-card"
import { KlikadoCard } from "./klikado-card"

const NAV_LINKS = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
] as const

/**
 * Purpose:
 *   Site-wide footer. Three-column grid on desktop (brand + FloatingDock
 *   on the left, friend-site cards centered, nav links on the right).
 *   On mobile, everything is centered and the nav collapses to an inline row.
 *
 * Args: none
 *
 * Returns:
 *   A <footer> element rendered below the Contact section.
 */
export function Footer() {
    const year = new Date().getFullYear()

    const dockItems: DockItem[] = SOCIALS.map((s) => ({
        title: s.label,
        icon: <s.icon size={18} className="text-[color:var(--accent)]" />,
        href: s.href,
        target: s.href.startsWith("http") ? "_blank" : undefined,
        rel: s.href.startsWith("http") ? "noopener noreferrer" : undefined,
    }))

    return (
        <footer className="relative w-full overflow-hidden border-t border-app">
            {/* Top accent glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                    background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-[0.06]"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 100% at 50% 0%, var(--accent), transparent)",
                }}
            />

            <div className="relative mx-auto w-full max-w-7xl px-6 py-14 md:px-10">
                {/* Three-column on desktop; centered single column on mobile */}
                <div className="flex flex-col items-center gap-10 text-center md:grid md:grid-cols-[auto_1fr_auto] md:items-start md:gap-8 md:text-left">
                    {/* Left: brand + dock */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col items-center gap-4 md:items-start"
                    >
                        <BrandLogo size={36} />
                        <p className="max-w-[220px] text-xs leading-relaxed text-subtle">
                            {PROFILE.title}.<br />
                            Based in {PROFILE.location}.
                        </p>
                        <FloatingDock items={dockItems} />
                    </motion.div>

                    {/* Center: friend-site cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
                        className="flex flex-wrap justify-center gap-3"
                    >
                        <LionelCard />
                        <PicBreezyCard />
                        <KlikadoCard />
                    </motion.div>

                    {/* Right: nav links — inline row on mobile, vertical column on desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="flex flex-col items-center gap-2 md:items-start"
                    >
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-subtle">
                            Navigate
                        </p>
                        {/* Inline on mobile, vertical on desktop */}
                        <div className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-1 md:flex-col md:justify-start">
                            {NAV_LINKS.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    className="text-sm text-muted transition-colors hover:text-accent"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-app pt-6">
                    <p className="text-xs text-subtle">
                        &copy; {year} {PROFILE.fullName}. All rights reserved.
                    </p>
                    <p className="text-xs text-subtle">
                        Designed and built by{" "}
                        <span className="text-accent">{PROFILE.firstName}</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
