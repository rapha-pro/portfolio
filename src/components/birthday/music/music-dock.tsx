"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { MusicConfig } from "@/lib/data/birthday/types"
import type { MusicController } from "./useBirthdayMusic"

type MusicDockProps = {
    music: MusicController
    config: MusicConfig
    visible: boolean
}

/**
 * Purpose:
 *   The small, always reachable sound control in the bottom corner. Shows
 *   a soft equalizer while playing and the song title for a few seconds
 *   whenever playback starts.
 *
 * Args:
 *   - music   : controller from useBirthdayMusic.
 *   - config  : labels, title and artist.
 *   - visible : shown once the music choice has been made.
 *
 * Returns:
 *   The dock, or nothing when no music is configured.
 */
export function MusicDock({ music, config, visible }: MusicDockProps) {
    const playing = music.status === "playing"
    const blocked = music.status === "blocked"
    const [showTitle, setShowTitle] = useState(false)
    const title = [config.title, config.artist].filter(Boolean).join("  ·  ")

    useEffect(() => {
        if (!playing || !title) return
        const on = window.setTimeout(() => setShowTitle(true), 700)
        const off = window.setTimeout(() => setShowTitle(false), 7500)
        return () => {
            window.clearTimeout(on)
            window.clearTimeout(off)
        }
    }, [playing, title])

    const label = blocked ? config.controls.blocked : showTitle && playing ? `♪  ${title}` : null

    return (
        <AnimatePresence>
            {visible && music.available && (
                <motion.div
                    className="absolute bottom-[calc(env(safe-area-inset-bottom,0px)+14px)] right-3 z-30 flex items-center gap-3 sm:right-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                >
                    <AnimatePresence>
                        {label && (
                            <motion.span
                                key={label}
                                className="bd-label max-w-[52vw] truncate normal-case tracking-[0.14em]"
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                {label}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    <button
                        type="button"
                        onClick={music.toggle}
                        aria-label={playing ? config.controls.pause : config.controls.play}
                        className="grid h-11 w-11 place-items-center rounded-full border text-[var(--bd-light)] transition-colors duration-300"
                        style={{
                            borderColor: "color-mix(in srgb, var(--bd-light) 26%, transparent)",
                            background: "color-mix(in srgb, var(--bd-bg) 70%, transparent)",
                        }}
                    >
                        {playing ? (
                            <span aria-hidden className="bd-eq flex h-4 items-center gap-[3px]">
                                <span />
                                <span />
                                <span />
                            </span>
                        ) : music.status === "loading" ? (
                            <motion.span
                                aria-hidden
                                className="block h-1.5 w-1.5 rounded-full bg-current"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.4, repeat: Infinity }}
                            />
                        ) : (
                            <svg aria-hidden viewBox="0 0 16 16" className="ml-0.5 h-3.5 w-3.5">
                                <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
                            </svg>
                        )}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
