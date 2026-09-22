"use client"

import { AnimatePresence, motion } from "framer-motion"
import { EASE_OUT } from "./motion"

type ContinueButtonProps = {
    visible: boolean
    label: string
    onClick: () => void
}

/**
 * Purpose:
 *   The "continue" control shown once a calm section has fully revealed.
 *   Deliberately easy to find on a phone: a warm, softly breathing pill with
 *   an arrow that nudges forward, centered above the bottom edge.
 *
 * Args:
 *   - visible : fade the control in or out.
 *   - label   : visible and accessible text.
 *   - onClick : moves the story forward.
 *
 * Returns:
 *   A button pinned near the bottom of the screen.
 */
export function ContinueButton({ visible, label, onClick }: ContinueButtonProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+20px)] z-20 flex justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: EASE_OUT }}
                >
                    <button type="button" onClick={onClick} className="bd-continue">
                        <span>{label}</span>
                        <motion.svg
                            aria-hidden
                            viewBox="0 0 16 16"
                            className="h-4 w-4"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <path
                                d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </motion.svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
