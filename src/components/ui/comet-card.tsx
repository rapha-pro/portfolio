"use client"

import { useRef, useState, type MouseEvent } from "react"
import { motion } from "framer-motion"

type CometCardProps = {
  children: React.ReactNode
  /** Max tilt angle in degrees (default 12). */
  maxTilt?: number
  className?: string
}

/**
 * Purpose:
 *   Aceternity-style Comet Card — a 3D-tilt perspective card with a glowing
 *   comet radial light that follows the cursor across the card surface. The
 *   tilt resets smoothly when the cursor leaves.
 *
 * Args:
 *   children — card content rendered inside the 3D perspective shell.
 *   maxTilt  — maximum rotation in degrees on each axis.
 *   className — extra classes on the root.
 *
 * Returns:
 *   A 3D-tilt wrapper with a pointer-tracked glow layer.
 */
export function CometCard({ children, maxTilt = 12, className = "" }: CometCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)")
  const [glowPos, setGlowPos] = useState({ x: "50%", y: "50%" })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const dx = e.clientX - rect.left - cx
    const dy = e.clientY - rect.top - cy
    const rotX = -(dy / cy) * maxTilt
    const rotY = (dx / cx) * maxTilt
    setTransform(
      `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`
    )
    const glowX = ((e.clientX - rect.left) / rect.width) * 100
    const glowY = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPos({ x: `${glowX}%`, y: `${glowY}%` })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)")
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: isHovered
          ? "transform 0.08s linear"
          : "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative ${className}`}
    >
      {/* Comet glow that follows the cursor */}
      <motion.div
        aria-hidden
        animate={{
          left: glowPos.x,
          top: glowPos.y,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.08, ease: "linear" }}
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 220,
          height: 220,
          background:
            "radial-gradient(circle, var(--accent-glow) 0%, transparent 65%)",
          mixBlendMode: "screen",
          filter: "blur(6px)",
        }}
      />
      {children}
    </div>
  )
}
