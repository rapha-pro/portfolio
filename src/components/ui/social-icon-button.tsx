"use client"

import {
  useCallback,
  useRef,
  type AnchorHTMLAttributes,
  type ComponentType,
  type MouseEvent,
} from "react"
import gsap from "gsap"

/** Shape every animated icon exposes. */
export type AnimatedIconComponent = ComponentType<{
  size?: number
  className?: string
}>

type SocialIconButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Animated SVG component (e.g. AnimatedGithub). */
  icon: AnimatedIconComponent
  /** Accessible label — also used as `title`. */
  label: string
  /** Icon rendered size in px. Default 18. */
  iconSize?: number
}

/**
 * Purpose:
 *   Unified pill button for social / contact icons. Applies the magnetic
 *   hover pull, switches text color to the accent on hover, and lights up
 *   an accent-colored glow behind the icon. The nested animated icon
 *   handles its own micro-animation.
 *
 * Args:
 *   icon       — the animated icon component to render.
 *   label      — aria-label / title text.
 *   iconSize   — size passed to the icon component.
 *   href       — destination.
 *   className  — merged onto the root <a>.
 *   ...rest    — other anchor attributes.
 *
 * Returns:
 *   An animated <a> pill.
 */
export function SocialIconButton({
  icon: Icon,
  label,
  iconSize = 18,
  className = "",
  ...rest
}: SocialIconButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  /** Magnetic pull while hovered. */
  const onMove = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    gsap.to(el, { x: dx * 0.3, y: dy * 0.3, duration: 0.3, ease: "power2.out" })
  }, [])

  /** Elastic return to center. */
  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" })
  }, [])

  return (
    <a
      ref={ref}
      aria-label={label}
      title={label}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`
        group relative inline-flex h-11 w-11 items-center justify-center rounded-xl
        border border-app bg-[var(--glass)]
        text-muted
        backdrop-blur-md
        transition-colors duration-300
        hover:text-accent
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
        ${className}
      `}
      {...rest}
    >
      {/* Accent glow (masked behind the icon, revealed on hover) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(60% 80% at 50% 50%, var(--accent-soft), transparent 70%)",
          boxShadow: "0 0 22px -4px var(--accent-glow)",
        }}
      />

      <Icon size={iconSize} />
    </a>
  )
}
