"use client"

import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import type { MusicConfig } from "@/lib/data/birthday/types"
import { loadYouTubeApi, parseYouTubeId, type YTPlayer } from "./youtubeApi"

export type MusicStatus = "unavailable" | "idle" | "loading" | "playing" | "paused" | "blocked"

export type MusicController = {
    available: boolean // a source is configured
    status: MusicStatus
    hostRef: RefObject<HTMLDivElement | null> // hidden element the YouTube player mounts into
    start: () => void // first play; browsers allow sound once she has interacted with the page
    toggle: () => void // pause or resume
}

type Backend = {
    play: () => void
    pause: () => void
    setVolume: (volume: number) => void // 0 to 100
    destroy: () => void
}

const FADE_STEP_MS = 80
const BLOCKED_AFTER_MS = 3200

/**
 * Purpose:
 *   One small interface over two music sources: a hidden, looping YouTube
 *   player (IFrame API) or a plain audio file. Nothing plays until start()
 *   is called; playback then fades in. Typing the PIN counts as interaction,
 *   so most browsers allow it later on. iPhones refuse to start YouTube
 *   from a script: status then becomes "blocked" and the player is placed,
 *   invisibly, under the sound button so her next tap starts it.
 *
 * Args:
 *   - music   : the person's music settings.
 *   - preload : create the player ahead of time (after the gate) so the
 *               first tap starts instantly.
 *
 * Returns:
 *   A MusicController.
 */
export function useBirthdayMusic(music: MusicConfig, preload: boolean): MusicController {
    const { source, volume, fadeInMs } = music
    const videoId = source.kind === "youtube" ? parseYouTubeId(source.link) : ""
    const startSeconds = source.kind === "youtube" ? (source.startSeconds ?? 0) : 0
    const fileSrc = source.kind === "file" ? source.src.trim() : ""
    const available = videoId.length > 0 || fileSrc.length > 0

    const [status, setStatus] = useState<MusicStatus>("idle")
    const [ready, setReady] = useState(false)
    const [wanted, setWanted] = useState(false)

    const hostRef = useRef<HTMLDivElement | null>(null)
    const backendRef = useRef<Backend | null>(null)
    const wantRef = useRef(false)
    const volumeRef = useRef(0)
    const fadeTimer = useRef(0)
    const fadingRef = useRef(false)
    const blockTimer = useRef(0)

    const fadeTo = useCallback((target: number, ms: number, then?: () => void) => {
        const backend = backendRef.current
        window.clearInterval(fadeTimer.current)
        if (!backend) return
        const from = volumeRef.current
        const steps = Math.max(1, Math.round(ms / FADE_STEP_MS))
        let step = 0
        fadingRef.current = true
        fadeTimer.current = window.setInterval(() => {
            step++
            volumeRef.current = from + (target - from) * (step / steps)
            backend.setVolume(volumeRef.current)
            if (step >= steps) {
                window.clearInterval(fadeTimer.current)
                fadingRef.current = false
                then?.()
            }
        }, FADE_STEP_MS)
    }, [])

    const begin = useCallback(() => {
        const backend = backendRef.current
        if (!backend) return
        volumeRef.current = 0
        backend.setVolume(0)
        backend.play()
        fadeTo(volume, fadeInMs)
        window.clearTimeout(blockTimer.current)
        blockTimer.current = window.setTimeout(() => {
            setStatus((s) => (s === "playing" || s === "paused" ? s : "blocked"))
        }, BLOCKED_AFTER_MS)
    }, [fadeTo, volume, fadeInMs])

    const onPlaying = useCallback(() => {
        window.clearTimeout(blockTimer.current)
        setStatus("playing")
        // Started by a direct tap on the player: still fade in gently.
        if (volumeRef.current < 1 && !fadingRef.current) fadeTo(volume, fadeInMs)
    }, [fadeTo, volume, fadeInMs])

    // Create the backend once the story has started.
    useEffect(() => {
        if (!preload || !available) return
        let cancelled = false

        if (fileSrc) {
            const audio = new Audio(fileSrc)
            audio.loop = true
            audio.preload = "auto"
            const handlePlaying = () => onPlaying()
            const handlePause = () => setStatus("paused")
            audio.addEventListener("playing", handlePlaying)
            audio.addEventListener("pause", handlePause)
            backendRef.current = {
                play: () => {
                    audio.play().catch(() => setStatus("blocked"))
                },
                pause: () => audio.pause(),
                setVolume: (v) => {
                    audio.volume = Math.min(1, Math.max(0, v / 100))
                },
                destroy: () => {
                    audio.pause()
                    audio.removeEventListener("playing", handlePlaying)
                    audio.removeEventListener("pause", handlePause)
                    audio.removeAttribute("src")
                    audio.load()
                },
            }
            queueMicrotask(() => {
                if (cancelled) return
                setReady(true)
                if (wantRef.current) begin()
            })
            return () => {
                cancelled = true
                window.clearInterval(fadeTimer.current)
                window.clearTimeout(blockTimer.current)
                backendRef.current?.destroy()
                backendRef.current = null
            }
        }

        const host = hostRef.current
        if (!host) return
        let player: YTPlayer | null = null

        loadYouTubeApi()
            .then((YT) => {
                if (cancelled) return
                const target = document.createElement("div")
                host.appendChild(target)
                player = new YT.Player(target, {
                    host: "https://www.youtube-nocookie.com",
                    width: "200",
                    height: "200",
                    videoId,
                    playerVars: {
                        autoplay: 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        iv_load_policy: 3,
                        loop: 1,
                        playlist: videoId,
                        playsinline: 1,
                        rel: 0,
                        start: startSeconds,
                        origin: window.location.origin,
                    },
                    events: {
                        onReady: (e) => {
                            if (cancelled) return
                            const p = e.target
                            backendRef.current = {
                                play: () => p.playVideo(),
                                pause: () => p.pauseVideo(),
                                setVolume: (v) => p.setVolume(Math.round(v)),
                                destroy: () => p.destroy(),
                            }
                            setReady(true)
                            if (wantRef.current) begin()
                        },
                        onStateChange: (e) => {
                            if (e.data === YT.PlayerState.PLAYING) onPlaying()
                            else if (e.data === YT.PlayerState.PAUSED) setStatus("paused")
                            else if (e.data === YT.PlayerState.ENDED) {
                                e.target.seekTo(startSeconds, true)
                                e.target.playVideo()
                            }
                        },
                        onError: () => {
                            if (!cancelled) setStatus("unavailable")
                        },
                    },
                })
            })
            .catch(() => {
                if (!cancelled) setStatus("unavailable")
            })

        return () => {
            cancelled = true
            window.clearInterval(fadeTimer.current)
            window.clearTimeout(blockTimer.current)
            player?.destroy()
            backendRef.current = null
            host.replaceChildren()
        }
    }, [preload, available, fileSrc, videoId, startSeconds, begin, onPlaying])

    const start = useCallback(() => {
        if (!available) return
        wantRef.current = true
        setWanted(true)
        // Must run inside the tap handler: browsers only allow sound then.
        if (backendRef.current) begin()
    }, [available, begin])

    const toggle = useCallback(() => {
        const backend = backendRef.current
        if (!backend) {
            start()
            return
        }
        if (status === "playing") {
            fadeTo(0, 450, () => backend.pause())
        } else {
            wantRef.current = true
            setWanted(true)
            begin()
        }
    }, [status, begin, fadeTo, start])

    let effective: MusicStatus = status
    if (!available) effective = "unavailable"
    else if (status === "idle" && wanted && !ready) effective = "loading"

    return { available: effective !== "unavailable", status: effective, hostRef, start, toggle }
}
