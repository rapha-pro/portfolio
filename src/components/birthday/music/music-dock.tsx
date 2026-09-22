"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { MusicConfig } from "@/lib/data/birthday/types"
import { useMediaQuery } from "../shared/useMediaQuery"
import type { MusicController } from "./useBirthdayMusic"

type MusicDockProps = {
    music: MusicController
    config: MusicConfig
    url: string | null // the song on YouTube, when there is one
    visible: boolean
    phoneTitle: boolean // phones only show the title where no bottom button can collide
}

/**
 * Purpose:
 *   The small, always reachable sound control in the bottom corner, with a
 *   soft equalizer while playing. Next to it the song title links to the
 *   song on YouTube (and pauses the page's music so it does not play
 *   twice). On wide screens the title stays; on phones it shows for a few
 *   seconds whenever the music starts, so it never crowds the controls.
 *
 * Args:
 *   - music   : controller from useBirthdayMusic.
 *   - config  : labels, title and artist.
 *   - url     : link target for the title.
 *   - visible    : shown once the music has been cued.
 *   - phoneTitle : allow the short-lived title on phones (photo room only).
 *
 * Returns:
 *   The dock, or nothing when no music is configured.
 */
export function MusicDock({ music, config, url, visible, phoneTitle }: MusicDockProps) {
    const playing = music.status === "playing"
    const blocked = music.status === "blocked"
    const wide = useMediaQuery("(min-width: 640px)")
    const [recent, setRecent] = useState(false)
    const title = [config.title, config.artist].filter(Boolean).join("  ·  ")

    useEffect(() => {
        if (!playing || !title) return
        const on = window.setTimeout(() => setRecent(true), 700)
        const off = window.setTimeout(() => setRecent(false), 10700)
        return () => {
            window.clearTimeout(on)
            window.clearTimeout(off)
        }
    }, [playing, title])

    const showTitle =
        Boolean(title) && !blocked && (wide ? music.status !== "idle" : recent && phoneTitle)

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
                    <AnimatePresence mode="wait">
                        {blocked ? (
                            <motion.span
                                key="blocked"
                                className="bd-label normal-case tracking-[0.14em] text-[var(--bd-ink-muted)]"
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: [0.5, 1, 0.5], x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    opacity: { duration: 2.2, repeat: Infinity },
                                    x: { duration: 0.6 },
                                }}
                            >
                                {config.controls.blocked}
                            </motion.span>
                        ) : showTitle ? (
                            <motion.a
                                key="title"
                                href={url ?? undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => music.pause()}
                                aria-label={`${title}, open on YouTube`}
                                className="bd-label flex max-w-[58vw] items-center gap-2 normal-case tracking-[0.14em] underline-offset-4 transition-colors duration-300 hover:text-[var(--bd-ink-muted)] hover:underline"
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span aria-hidden>♪</span>
                                <span className="truncate">{title}</span>
                                {url && (
                                    <svg
                                        aria-hidden
                                        viewBox="0 0 12 12"
                                        className="h-2.5 w-2.5 shrink-0"
                                    >
                                        <path
                                            d="M4 2h6v6M10 2 3 9"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </motion.a>
                        ) : null}
                    </AnimatePresence>

                    <button
                        type="button"
                        onClick={music.toggle}
                        aria-label={playing ? config.controls.pause : config.controls.play}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border text-[var(--bd-light)] transition-colors duration-300"
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
