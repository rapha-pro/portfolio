"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, type MotionValue } from "framer-motion"
import type { BirthdayConfig, BirthdayMedia } from "@/lib/data/birthday/types"
import { EASE_IN_OUT, EASE_OUT, sec } from "../shared/motion"
import { useDocumentVisible } from "../shared/useDocumentVisible"
import { ArchiveLabels } from "./archive-labels"
import { FocusedMedia, focusTarget, type FocusedCard } from "./focused-media"
import type { CardOpening } from "./photo-card"
import { PhotoStream } from "./photo-stream"
import { TypedMessages } from "./typed-messages"

type MemoryRoomProps = {
    config: BirthdayConfig
    photos: BirthdayMedia[]
    active: boolean // false while mounted under the tunnel, so photos preload
    flicker: MotionValue<number>
    reduceMotion: boolean
    onMusicCue: () => void // the message that starts the music has appeared
    onComplete: () => void
}

/**
 * Purpose:
 *   The memory archive: labels in the corners, the photo and video stream
 *   under the bulb, and the typed messages just beneath it. A tapped card
 *   is lifted and enlarged for a few seconds (stream and typing pause
 *   meanwhile). The music is cued when the configured message appears.
 *   After the last message the photographs blur and fade away before the
 *   story moves on to the verse.
 *
 * Args:
 *   - config       : the person's full config.
 *   - photos       : resolved photos and videos.
 *   - active       : starts the room's own choreography.
 *   - flicker      : shared light flicker.
 *   - reduceMotion : calmer variants.
 *   - onMusicCue   : start the music.
 *   - onComplete   : photos have faded away.
 *
 * Returns:
 *   The room section.
 */
export function MemoryRoom({
    config,
    photos,
    active,
    flicker,
    reduceMotion,
    onMusicCue,
    onComplete,
}: MemoryRoomProps) {
    const timing = config.timing.archive
    const [showMessages, setShowMessages] = useState(false)
    const [leaving, setLeaving] = useState(false)
    const [focused, setFocused] = useState<FocusedCard | null>(null)
    const [liftedIndex, setLiftedIndex] = useState<number | null>(null)
    const completeRef = useRef(onComplete)
    const pageVisible = useDocumentVisible()

    useEffect(() => {
        completeRef.current = onComplete
    }, [onComplete])

    useEffect(() => {
        if (!active || !pageVisible) return
        const t = window.setTimeout(() => setShowMessages(true), timing.messagesDelayMs)
        return () => window.clearTimeout(t)
    }, [active, pageVisible, timing.messagesDelayMs])

    useEffect(() => {
        if (!leaving || !pageVisible) return
        const t = window.setTimeout(() => completeRef.current(), timing.photosFadeMs)
        return () => window.clearTimeout(t)
    }, [leaving, pageVisible, timing.photosFadeMs])

    const openCard = useCallback(
        (opening: CardOpening) => {
            if (liftedIndex !== null) return
            setLiftedIndex(opening.index)
            setFocused({ ...opening, target: focusTarget(opening.ratio) })
        },
        [liftedIndex]
    )

    const startAt = config.music.startAtMessage
    const handleMessageStart = useCallback(
        (index: number) => {
            if (index >= startAt) onMusicCue()
        },
        [startAt, onMusicCue]
    )

    return (
        <motion.section
            aria-label={config.archive.title}
            className="absolute inset-0 z-10 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
        >
            <ArchiveLabels
                archive={config.archive}
                count={photos.length}
                visible={active && !leaving}
            />

            <div className="shrink-0" style={{ height: "var(--bd-top)" }} />

            <motion.div
                className="shrink-0"
                initial={{ opacity: 0 }}
                animate={
                    leaving
                        ? { opacity: 0, y: -14, filter: "blur(8px)" }
                        : { opacity: active ? 1 : 0, y: 0, filter: "blur(0px)" }
                }
                transition={
                    leaving
                        ? { duration: sec(timing.photosFadeMs) * 0.9, ease: EASE_IN_OUT }
                        : { duration: 2.8, delay: active ? 1.4 : 0, ease: EASE_OUT }
                }
            >
                <PhotoStream
                    photos={photos}
                    flicker={flicker}
                    speed={timing.photoSpeed}
                    speedMobile={timing.photoSpeedMobile}
                    reduceMotion={reduceMotion}
                    label={config.archive.streamLabel}
                    liftedIndex={liftedIndex}
                    onOpen={active && !leaving ? openCard : null}
                />
            </motion.div>

            <motion.div
                className="relative flex min-h-0 flex-1 items-center justify-center px-6"
                style={{ paddingBottom: "var(--bd-bottom)" }}
                animate={{ opacity: leaving ? 0 : 1 }}
                transition={{ duration: sec(timing.photosFadeMs) * 0.6 }}
            >
                {showMessages && (
                    <TypedMessages
                        messages={config.messages}
                        timing={config.timing.messages}
                        reduceMotion={reduceMotion}
                        skipHint={config.ui.skipHint}
                        paused={liftedIndex !== null}
                        onMessageStart={handleMessageStart}
                        onComplete={() => setLeaving(true)}
                    />
                )}
            </motion.div>

            <FocusedMedia
                card={focused}
                durationMs={timing.focusMs}
                closeLabel={config.ui.closePhotoLabel}
                onClose={() => setFocused(null)}
                onClosed={() => setLiftedIndex(null)}
            />
        </motion.section>
    )
}
