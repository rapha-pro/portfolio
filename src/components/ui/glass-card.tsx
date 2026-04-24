"use client"

import { forwardRef, type HTMLAttributes, type ReactNode } from "react"

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  /** When true, the card brightens + lifts on hover. Default true. */
  hover?: boolean
  /** Disable the top bevel highlight line. Default false. */
  flat?: boolean
  children?: ReactNode
}

/**
 * Purpose:
 *   Reusable glassmorphic surface. Rounded border, top-edge highlight,
 *   blurred translucent background. Opt-in hover lift with accent glow.
 *
 * Args:
 *   hover    — toggle hover lift + accent glow (default true).
 *   flat     — hide the top bevel highlight line (default false).
 *   className — extra classes merged onto the root.
 *   children — card content.
 *   ...rest  — forwarded to the root <div>.
 *
 * Returns:
 *   A <div> with glass styling and optional hover interaction.
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    { hover = true, flat = false, className = "", children, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={`
          relative overflow-hidden rounded-2xl border border-app
          bg-[var(--glass)]
          backdrop-blur-xl backdrop-saturate-150
          shadow-[var(--shadow-1)]
          ${hover
            ? "transition-all duration-500 hover:bg-[var(--glass-strong)] hover:shadow-[0_16px_48px_-8px_var(--accent-glow)]"
            : ""}
          ${className}
        `}
        {...rest}
      >
        {!flat && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--glass-highlight), transparent)",
            }}
          />
        )}
        {children}
      </div>
    )
  },
)
