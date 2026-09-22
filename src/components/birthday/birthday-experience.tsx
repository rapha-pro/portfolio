"use client"

import "./birthday.css"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion"
import type { BirthdayConfig, BirthdayMedia, BirthdayTheme } from "@/lib/data/birthday/types"
import { MemoryRoom } from "./archive/memory-room"
import { FinalReveal } from "./finale/final-reveal"
import { PinGate } from "./gate/pin-gate"
import { MusicDock } from "./music/music-dock"
import { MusicHost } from "./music/music-host"
import { useBirthdayMusic } from "./music/useBirthdayMusic"
import { youtubeWatchUrl } from "./music/youtubeApi"
import { preloadCardImages, loadGhostImages } from "./shared/preload"
import { useFlicker } from "./shared/useFlicker"
import { useWakeLock } from "./shared/useWakeLock"
import { FilmGrain } from "./stage/film-grain"
import { LightRig } from "./stage/light-rig"
import type { LightMode } from "./stage/lightModes"
import { TunnelTransition } from "./tunnel/tunnel-transition"
import { VerseSection } from "./verse/verse-section"
import { BirthdayWishes } from "./wishes/birthday-wishes"

type Phase = "gate" | "tunnel" | "archive" | "verse" | "wishes" | "finale"

/** Chapters a development preview can open on directly. */
export type BirthdayChapter = "archive" | "verse" | "wishes" | "finale"

type BirthdayExperienceProps = {
    config: BirthdayConfig
    photos: BirthdayMedia[]
    startAt?: BirthdayChapter // development preview only
}

const LIGHT_FOR_PHASE: Record<Phase, LightMode> = {
    gate: "off",
    tunnel: "off",
    archive: "archive",
    verse: "verse",
    wishes: "warm",
    finale: "finale",
}

/**
 * Purpose:
 *   The whole birthday experience as one continuous scene. Owns the story
 *   state machine (gate, tunnel, archive, verse, wishes, finale) and the
 *   layers that persist across it: the light rig, grain, music and the
 *   tunnel overlay. Chapters cross-fade inside the same room instead of
 *   navigating, so nothing ever feels like a page change.
 *
 * Args:
 *   - config  : everything editable, from src/lib/data/birthday/<name>/.
 *   - photos  : photo and video URLs resolved on the server.
 *   - startAt : open on a chapter instead of the gate (dev preview).
 *
 * Returns:
 *   A full-screen, fixed experience.
 */
export function BirthdayExperience({ config, photos, startAt }: BirthdayExperienceProps) {
    const reduceMotion = useReducedMotion() ?? false
    const [phase, setPhase] = useState<Phase>(startAt ?? "gate")
    const [tunnel, setTunnel] = useState<{ origin: { x: number; y: number } | null } | null>(null)
    const [run, setRun] = useState(0)
    const [musicCued, setMusicCued] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    const started = phase !== "gate"
    const inRoom = started && phase !== "tunnel"
    const flicker = useFlicker({
        enabled: config.timing.flicker.enabled && !reduceMotion && inRoom,
        minGapMs: config.timing.flicker.minGapMs,
        maxGapMs: config.timing.flicker.maxGapMs,
    })
    const music = useBirthdayMusic(config.music, started)
    useWakeLock(started)

    // Warm the cache while she reads the entrance screen.
    useEffect(() => {
        const t = window.setTimeout(() => {
            loadGhostImages(photos, 12)
            preloadCardImages(photos, 8)
        }, 1200)
        return () => window.clearTimeout(t)
    }, [photos])

    const handleUnlock = useCallback((origin: { x: number; y: number }) => {
        setTunnel({ origin })
        setPhase("tunnel")
    }, [])

    const handleFlash = useCallback(() => setPhase("archive"), [])

    const handleTunnelDone = useCallback(() => {
        setTunnel(null)
        rootRef.current?.focus({ preventScroll: true })
    }, [])

    const handleReplay = useCallback(() => {
        setRun((r) => r + 1)
        setTunnel({ origin: null })
        setPhase("tunnel")
    }, [])

    // Starts once, when the configured message appears; replays keep playing.
    const beginPlayback = music.start
    const cueMusic = useCallback(() => {
        if (musicCued) return
        setMusicCued(true)
        beginPlayback()
    }, [musicCued, beginPlayback])

    const toVerse = useCallback(() => setPhase("verse"), [])
    const toWishes = useCallback(() => setPhase("wishes"), [])
    const toFinale = useCallback(() => setPhase("finale"), [])

    const armPlayer = music.status === "blocked" && config.music.source.kind === "youtube"
    const songUrl =
        config.music.source.kind === "youtube" ? youtubeWatchUrl(config.music.source.link) : null
    const songLabel = [config.music.title, config.music.artist].filter(Boolean).join("  ·  ")
    const credit = songUrl && songLabel ? { label: songLabel, url: songUrl } : null
    const pauseForLink = music.pause

    return (
        <MotionConfig reducedMotion="user">
            <div
                ref={rootRef}
                tabIndex={-1}
                className="bd-root"
                style={themeVariables(config.theme)}
            >
                <LightRig mode={LIGHT_FOR_PHASE[phase]} flicker={flicker} />

                <main className="absolute inset-0">
                    <AnimatePresence mode="wait">
                        {phase === "gate" && (
                            <PinGate
                                key="gate"
                                gate={config.gate}
                                timing={config.timing.gate}
                                onUnlock={handleUnlock}
                            />
                        )}
                        {(phase === "tunnel" || phase === "archive") && (
                            <MemoryRoom
                                key={`room-${run}`}
                                config={config}
                                photos={photos}
                                active={phase === "archive"}
                                flicker={flicker}
                                reduceMotion={reduceMotion}
                                onMusicCue={cueMusic}
                                onComplete={toVerse}
                            />
                        )}
                        {phase === "verse" && (
                            <VerseSection
                                key="verse"
                                verse={config.verse}
                                timing={config.timing.verse}
                                continueLabel={config.ui.continueLabel}
                                onComplete={toWishes}
                            />
                        )}
                        {phase === "wishes" && (
                            <BirthdayWishes
                                key="wishes"
                                wishes={config.wishes}
                                festive={config.theme.festive}
                                timing={config.timing.wishes}
                                continueLabel={config.ui.continueLabel}
                                onComplete={toFinale}
                            />
                        )}
                        {phase === "finale" && (
                            <FinalReveal
                                key="finale"
                                finale={config.finale}
                                timing={config.timing.finale}
                                credit={credit}
                                onCreditClick={pauseForLink}
                                onReplay={handleReplay}
                            />
                        )}
                    </AnimatePresence>
                </main>

                <MusicDock
                    music={music}
                    config={config.music}
                    url={songUrl}
                    visible={inRoom && musicCued}
                    phoneTitle={phase === "archive"}
                />

                <FilmGrain />

                {tunnel && (
                    <TunnelTransition
                        photos={photos}
                        theme={config.theme}
                        timing={config.timing.tunnel}
                        whisper={run === 0 ? config.gate.tunnelWhisper : null}
                        origin={tunnel.origin}
                        reduceMotion={reduceMotion}
                        onFlash={handleFlash}
                        onDone={handleTunnelDone}
                    />
                )}

                <MusicHost hostRef={music.hostRef} armed={armPlayer} />
            </div>
        </MotionConfig>
    )
}

/** Maps the person's palette onto the --bd-* variables used by birthday.css. */
function themeVariables(theme: BirthdayTheme): CSSProperties {
    return {
        "--bd-bg": theme.background,
        "--bd-surface": theme.surface,
        "--bd-ink": theme.ink,
        "--bd-ink-muted": theme.inkMuted,
        "--bd-ink-subtle": theme.inkSubtle,
        "--bd-light": theme.light,
        "--bd-ember": theme.ember,
    } as CSSProperties
}
