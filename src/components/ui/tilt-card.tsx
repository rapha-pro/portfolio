"use client"

import { useRef, type MouseEvent, type ReactNode } from "react"
import gsap from "gsap"

type TiltCardProps = {
  /** Max tilt per axis in degrees. Default 16. */
  max?: number
  /** CSS perspective in px. Default 900. */
  perspective?: number
  /** Extra classes on the root. */
  className?: string
  children: ReactNode
}

/**
 * Purpose:
 *   Wraps children with a 3D tilt that tracks cursor position — drops to
 *   zero with an elastic spring on leave. Good for photo cards, feature
 *   tiles, project thumbnails.
 *
 * Args:
 *   max        — maximum rotate in degrees for rotateX/rotateY.
 *   perspective — CSS perspective to preserve depth.
 *   className  — extra classes on the root.
 *   children   — content to tilt.
 *
 * Returns:
 *   A <div> with GSAP-driven 3D tilt.
 */
export function TiltCard({
  max = 16,
  perspective = 900,
  className = "",
  children,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: x * max,
      rotateX: -y * max,
      transformPerspective: perspective,
      duration: 0.4,
      ease: "power2.out",
    })
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    gsap.to(el, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d" }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
