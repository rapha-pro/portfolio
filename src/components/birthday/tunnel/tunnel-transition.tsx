"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { BirthdayMedia, BirthdayTheme, BirthdayTiming } from "@/lib/data/birthday/types"
import { loadGhostImages } from "../shared/preload"
import { sec } from "../shared/motion"
import { startTunnelScene } from "./tunnelScene"

type TunnelTransitionProps = {
    photos: BirthdayMedia[]
    theme: BirthdayTheme
    timing: BirthdayTiming["tunnel"]
    whisper: string | null
    origin: { x: number; y: number } | null
    reduceMotion: boolean
    onFlash: () => void // the screen is fully lit: swap the scene underneath
    onDone: () => void // the flash has faded: unmount the tunnel
}

/**
 * Purpose:
 *   "Being pulled into a memory". A full-screen overlay that starts from
 *   the point of light left by the code, accelerates through warm dust and
 *   ghosted photographs, and resolves into a soft warm flash that fades to
 *   reveal the memory room. With reduced motion it becomes a slow glow.
 *
 * Args:
 *   - photos       : used for the ghost photographs.
 *   - theme        : colors for the canvas.
 *   - timing       : acceleration and flash durations.
 *   - whisper      : optional line shown early in the tunnel.
 *   - origin       : screen position of the point of light.
 *   - reduceMotion : calmer version without movement.
 *   - onFlash      : called at peak brightness.
 *   - onDone       : called once the overlay has faded out.
 *
 * Returns:
 *   The overlay, above every other layer.
 */
export function TunnelTransition({
    photos,
    theme,
    timing,
    whisper,
    origin,
    reduceMotion,
    onFlash,
    onDone,
}: TunnelTransitionProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const callbacks = useRef({ onFlash, onDone })
    const { durationMs, flashMs } = timing
    const total = durationMs + flashMs
    const at = (ms: number) => Math.min(1, Math.max(0, ms / total))

    useEffect(() => {
        callbacks.current = { onFlash, onDone }
    }, [onFlash, onDone])

    useEffect(() => {
        const flash = window.setTimeout(() => callbacks.current.onFlash(), durationMs + 100)
        const done = window.setTimeout(() => callbacks.current.onDone(), total)
        return () => {
            window.clearTimeout(flash)
            window.clearTimeout(done)
        }
    }, [durationMs, total])

    useEffect(() => {
        const canvas = canvasRef.current
        if (reduceMotion || !canvas) return
        const scene = startTunnelScene(canvas, {
            durationMs,
            background: theme.background,
            light: theme.light,
            ink: theme.ink,
            origin,
            images: loadGhostImages(photos, 12),
            compact: window.innerWidth < 640,
        })
        return () => scene.stop()
    }, [reduceMotion, durationMs, theme.background, theme.light, theme.ink, origin, photos])

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-50">
            {/* The tunnel itself, hidden behind the flash at its peak */}
            <motion.div
                className="absolute inset-0 bg-[var(--bd-bg)]"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 1, 0] }}
                transition={{
                    duration: sec(total),
                    times: [0, at(durationMs), at(durationMs + 140)],
                    ease: "linear",
                }}
            >
                {reduceMotion ? (
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--bd-light) 30%, transparent) 0%, transparent 60%)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: sec(durationMs), ease: "easeIn" }}
                    />
                ) : (
                    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
                )}
                <div className="bd-vignette absolute inset-0" />

                {whisper && (
                    <motion.p
                        className="bd-serif absolute inset-x-6 top-[64%] text-center text-[clamp(1.25rem,3.6vw,1.7rem)] italic text-[var(--bd-ink-muted)]"
                        initial={{ opacity: 0, filter: "blur(6px)" }}
                        animate={{
                            opacity: [0, 0, 1, 1, 0],
                            filter: [
                                "blur(6px)",
                                "blur(6px)",
                                "blur(0px)",
                                "blur(0px)",
                                "blur(8px)",
                            ],
                        }}
                        transition={{
                            duration: sec(durationMs),
                            times: [0, 0.08, 0.2, 0.42, 0.56],
                            ease: "easeInOut",
                        }}
                    >
                        {whisper}
                    </motion.p>
                )}
            </motion.div>

            {/* Warm flash: never pure white, she may be in a dark room */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(circle at 50% 50%, #fff8ec 0%, color-mix(in srgb, var(--bd-light) 55%, #fff4e2) 55%, color-mix(in srgb, var(--bd-light) 80%, #6b4a2a) 100%)",
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 0, reduceMotion ? 0.55 : 0.93, reduceMotion ? 0.55 : 0.93, 0],
                }}
                transition={{
                    duration: sec(total),
                    times: [0, at(durationMs - 700), at(durationMs), at(durationMs + 180), 1],
                    ease: ["linear", "easeIn", "linear", "easeOut"],
                }}
            />
        </div>
    )
}
