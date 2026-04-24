"use client"

import { useCallback, useRef, type MouseEvent } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

import { HeroBackground } from "./hero-background"
import { StatusBadge } from "./status-badge"
import { IdentityBlock } from "./identity-block"
import { BioCard } from "./bio-card"
import { ActionBar } from "./action-bar"
import { SkillMarquee } from "./skill-marquee"
import { PhotoCard } from "./photo-card"
import { SkillCubePanel } from "./skill-cube-panel"

/**
 * Purpose:
 *   The landing hero. Owns the top-level <section>, the mouse-parallax
 *   effect, and the GSAP entrance timeline that fades/slides each column
 *   in. All visual content lives in composed subcomponents so this file
 *   stays focused on layout + motion orchestration.
 *
 * Returns:
 *   The <section id="home">.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const rightRef   = useRef<HTMLDivElement>(null)

  /* GSAP entrance timeline — scoped so it cleans up on unmount. */
  useGSAP(
    () => {
      const leftItems = leftRef.current?.querySelectorAll(".gs-item")
      if (!leftItems || !rightRef.current) return

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(leftItems, { opacity: 0, y: 40, stagger: 0.11, duration: 1 })
        .from(rightRef.current, { opacity: 0, x: 60, duration: 1.1 }, "<0.2")
    },
    { scope: sectionRef },
  )

  /**
   * Purpose:
   *   Translate decorative orbs on mouse movement to create parallax
   *   depth. Targets are any elements with `.parallax-slow` / `.parallax-fast`.
   *
   * Args:
   *   e — the pointer move event.
   */
  const onMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const { innerWidth: W, innerHeight: H } = window
    const mx = (e.clientX / W - 0.5) * 2
    const my = (e.clientY / H - 0.5) * 2
    gsap.to(".parallax-slow", { x: mx * 12, y: my * 8,  duration: 1.2, ease: "power2.out" })
    gsap.to(".parallax-fast", { x: mx * 24, y: my * 16, duration: 0.8, ease: "power2.out" })
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen w-full overflow-hidden px-4 pb-20 pt-28 md:px-8 lg:px-16"
    >
      <HeroBackground />

      {/* ══ Content grid ══ */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">

        {/* ── LEFT column ── */}
        <div ref={leftRef} className="flex flex-col gap-8">
          <div className="gs-item">
            <StatusBadge />
          </div>

          <div className="gs-item">
            <IdentityBlock />
          </div>

          <div className="gs-item">
            <BioCard />
          </div>

          <div className="gs-item">
            <ActionBar />
          </div>

          <div className="gs-item">
            <SkillMarquee />
          </div>
        </div>

        {/* ── RIGHT column ── */}
        <div ref={rightRef} className="flex flex-col items-center gap-8">
          <PhotoCard />
          <SkillCubePanel />
        </div>
      </div>
    </section>
  )
}
