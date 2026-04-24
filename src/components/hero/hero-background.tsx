"use client"

import { ParticleField } from "@/components/ui/particle-field"

/**
 * Purpose:
 *   All decorative / atmospheric layers behind the hero content —
 *   blur blobs, grid overlay, particle field, floating orb pills.
 *   Pointer-events are disabled throughout so it never intercepts input.
 *
 * Returns:
 *   A fragment of absolutely-positioned decorative layers. Must be
 *   placed inside a `position: relative` parent with `overflow: hidden`.
 */
export function HeroBackground() {
  return (
    <>
      {/* ── Atmosphere blobs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-10 blur-[80px]"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }}
      />

      {/* ── Particle field ── */}
      <ParticleField />

      {/* ── Subtle grid ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--fg) 1px, transparent 1px), linear-gradient(90deg, var(--fg) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Floating orb pills (parallax targets) ── */}
      <div className="parallax-slow pointer-events-none absolute left-[15%] top-[20%]">
        <div
          className="h-2 w-2 rounded-full"
          style={{
            background: "var(--accent)",
            boxShadow: "0 0 12px 4px var(--accent-glow)",
          }}
        />
      </div>
      <div className="parallax-fast pointer-events-none absolute right-[20%] top-[35%]">
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: "var(--accent)",
            boxShadow: "0 0 10px 3px var(--accent-glow)",
          }}
        />
      </div>
      <div className="parallax-slow pointer-events-none absolute bottom-[30%] left-[10%]">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            background: "var(--accent)",
            boxShadow: "0 0 14px 5px var(--accent-glow)",
            opacity: 0.7,
          }}
        />
      </div>
    </>
  )
}
