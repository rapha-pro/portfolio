"use client"

import { useEffect, useRef, useState } from "react"
import { useMotionValue, useSpring } from "framer-motion"

type TextHoverEffectProps = {
  /** Text to display -- keep it short (one word / short name). */
  text: string
  /**
   * Spring stiffness for the gradient-follow (higher = snappier).
   * Roughly equivalent to the old `duration` param.
   */
  duration?: number
  className?: string
  /**
   * SVG viewBox string. Widen for longer strings.
   * Default: "0 0 300 100". For the full name on one line use "0 0 600 100".
   */
  viewBox?: string
}

/**
 * Purpose:
 *   Aceternity-style TextHoverEffect. Renders large outlined SVG text that
 *   reveals an accent-color gradient wherever the cursor moves. Base text is
 *   a subtle outline; hover layer sweeps accent over the letters.
 *
 *   Fix over the original: uses useMotionValue + useSpring + a ref to the
 *   <radialGradient> element to directly setAttribute() on every animation
 *   frame. This bypasses motion.radialGradient which does not reliably animate
 *   SVG paint-server attributes in all browsers.
 *
 * Args:
 *   text     -- string to display (all-caps recommended).
 *   duration -- spring stiffness hint (default 0.15, lower = slower follow).
 *   viewBox  -- override the SVG viewBox (default "0 0 300 100").
 *   className -- extra classes on the outer wrapper div.
 *
 * Returns:
 *   Responsive SVG text with cursor-tracked accent gradient reveal.
 */
export function TextHoverEffect({
  text,
  duration = 0.15,
  className = "",
  viewBox = "0 0 300 100",
}: TextHoverEffectProps) {
  const svgRef  = useRef<SVGSVGElement>(null)
  const gradRef = useRef<SVGRadialGradientElement>(null)
  const [hovered, setHovered] = useState(false)

  // Parse viewBox to know the coordinate space
  const [, , vbW, vbH] = viewBox.split(" ").map(Number)

  // Raw cursor position in SVG user-space coordinates
  const rawX = useMotionValue(vbW / 2)
  const rawY = useMotionValue(vbH / 2)

  // Stiffness derived from `duration`: shorter duration => snappier spring
  const stiffness = Math.round(1 / Math.max(duration, 0.02) * 8)
  const springX = useSpring(rawX, { stiffness, damping: 30, mass: 0.5 })
  const springY = useSpring(rawY, { stiffness, damping: 30, mass: 0.5 })

  // On every spring tick, push the new coordinates directly to the SVG element
  useEffect(() => {
    const unsubX = springX.on("change", (x) => {
      gradRef.current?.setAttribute("cx", String(x))
    })
    const unsubY = springY.on("change", (y) => {
      gradRef.current?.setAttribute("cy", String(y))
    })
    return () => { unsubX(); unsubY() }
  }, [springX, springY])

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(((e.clientX - rect.left) / rect.width)  * vbW)
    rawY.set(((e.clientY - rect.top)  / rect.height) * vbH)
  }

  const gradId  = `thetextGradient-${text.replace(/\s+/g, "_")}`
  const maskId  = `revealMask-${text.replace(/\s+/g, "_")}`
  const textMaskId = `textMask-${text.replace(/\s+/g, "_")}`

  return (
    <div className={`w-full ${className}`}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="select-none"
      >
        <defs>
          {/* Accent gradient revealed by the mask */}
          <linearGradient
            id={gradId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2={vbW}
            y2="0"
          >
            <stop offset="0%"   stopColor="var(--accent)"      stopOpacity={hovered ? 1 : 0} />
            <stop offset="40%"  stopColor="var(--accent-glow)" stopOpacity={hovered ? 1 : 0} />
            <stop offset="60%"  stopColor="var(--accent)"      stopOpacity={hovered ? 1 : 0} />
            <stop offset="100%" stopColor="var(--accent)"      stopOpacity={hovered ? 1 : 0} />
          </linearGradient>

          {/* Radial gradient mask -- cx/cy driven by the spring via ref */}
          <radialGradient
            ref={gradRef}
            id={maskId}
            gradientUnits="userSpaceOnUse"
            cx={vbW / 2}
            cy={vbH / 2}
            r={vbW * 0.35}
          >
            <stop offset="0%"   stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>

          <mask id={textMaskId}>
            <rect x="0" y="0" width={vbW} height={vbH} fill={`url(#${maskId})`} />
          </mask>
        </defs>

        {/* Base: subtle outline, always visible */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="transparent"
          strokeWidth="0.4"
          style={{
            stroke: "var(--fg-subtle)",
            fontFamily: "inherit",
            fontSize: `${vbH * 0.6}px`,
            fontWeight: 900,
            letterSpacing: "-2px",
          }}
        >
          {text}
        </text>

        {/* Hover layer: gradient revealed through the radial mask */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="transparent"
          strokeWidth="0.5"
          stroke={`url(#${gradId})`}
          mask={`url(#${textMaskId})`}
          style={{
            fontFamily: "inherit",
            fontSize: `${vbH * 0.6}px`,
            fontWeight: 900,
            letterSpacing: "-2px",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  )
}
