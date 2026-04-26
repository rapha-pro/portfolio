"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, type CSSProperties, type ReactNode } from "react"

/**
 * Purpose:
 *   Establishes a 3D perspective context for draggable card children.
 *
 * Args:
 *   className: extra classes applied to the wrapper div.
 *   children:  DraggableCardBody elements.
 */
export function DraggableCardContainer({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className} style={{ perspective: "3000px" }}>
      {children}
    </div>
  )
}

/**
 * Purpose:
 *   A Framer Motion card that can be freely dragged with a 3D tilt on hover.
 *   Click detection is built-in: the onClick callback only fires when the
 *   user did not actually drag (pointer stayed within a small threshold).
 *
 * Args:
 *   className: extra classes (cursor, select-none, etc.).
 *   style:     absolute position, initial rotate, zIndex, etc.
 *   children:  card visual content.
 *   onClick:   called on tap/click (not on drag-release).
 */
export function DraggableCardBody({
  className,
  style,
  children,
  onClick,
}: {
  className?: string
  style?: CSSProperties
  children: ReactNode
  onClick?: () => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Normalized mouse position [-0.5, 0.5] within the card bounds
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 30,
  })

  // Track whether the pointer moved enough to count as a drag vs a click
  const hasDragged = useRef(false)

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width - 0.5)
    mouseY.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ x, y, rotateX, rotateY, ...style }}
      drag
      dragElastic={0.4}
      dragMomentum={false}
      whileDrag={{ scale: 1.06, zIndex: 999, cursor: "grabbing" }}
      dragTransition={{ bounceStiffness: 500, bounceDamping: 25 }}
      onDragStart={() => { hasDragged.current = true }}
      onDragEnd={() => {
        setTimeout(() => { hasDragged.current = false }, 80)
      }}
      // Capture phase: suppress child click handlers when the user just finished dragging
      onClickCapture={(e) => {
        if (hasDragged.current) {
          e.stopPropagation()
          e.preventDefault()
        }
      }}
      onClick={() => { if (!hasDragged.current) onClick?.() }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  )
}
