"use client"

import type { RefObject } from "react"

type MusicHostProps = {
    hostRef: RefObject<HTMLDivElement | null>
    armed: boolean // playback was refused: let her next tap reach the player
}

/**
 * Purpose:
 *   Where the YouTube player lives: invisible in a corner while it works.
 *   iPhones only let YouTube start from a tap inside the player itself, so
 *   when a scripted start is refused the (still invisible) player is moved
 *   under the sound button: tapping "Tap for music" then starts it. It is
 *   never moved in the DOM (that would reload the iframe), only restyled.
 *
 * Args:
 *   - hostRef : element the player mounts into.
 *   - armed   : true while playback is blocked.
 *
 * Returns:
 *   A fixed-position container.
 */
export function MusicHost({ hostRef, armed }: MusicHostProps) {
    return (
        <div className="bd-music-shell" data-armed={armed} aria-hidden>
            <div ref={hostRef} className="bd-music-frame" />
        </div>
    )
}
