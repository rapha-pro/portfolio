"use client"

import {
  useCallback,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react"
import gsap from "gsap"

type MagneticButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** 0–1 pull strength; higher = stronger attraction. Default 0.22. */
  strength?: number
  /** Elastic snap-back duration in seconds. Default 0.6. */
  releaseDuration?: number
  children?: ReactNode
}

/**
 * Purpose:
 *   Anchor element that magnetically follows the cursor while hovered,
 *   then elastically snaps back on leave. Use for CTAs and icon buttons.
 *
 * Args:
 *   strength         — pull magnitude (0 disables, 1 = full cursor offset).
 *   releaseDuration  — seconds for the snap-back.
 *   className        — merged onto the <a>.
 *   children         — anchor content.
 *   ...rest          — any other <a> attribute.
 *
 * Returns:
 *   An animated <a>.
 */
export function MagneticButton({
  strength = 0.22,
  releaseDuration = 0.6,
  className = "",
  children,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  const onMove = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.3,
        ease: "power2.out",
      })
    },
    [strength],
  )

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: releaseDuration,
      ease: "elastic.out(1, 0.5)",
    })
  }, [releaseDuration])

  return (
    <a
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </a>
  )
}
