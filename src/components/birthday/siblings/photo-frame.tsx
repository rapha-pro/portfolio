"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { EASE_OUT } from "../shared/motion"

type PhotoFrameProps = {
    src: string // "" leaves the frame empty
    alt: string
    tilt: number // resting rotation in degrees
    delay: number // seconds before it appears
    compact: boolean // smaller, to leave room for a long letter
}

/**
 * Purpose:
 *   A framed photograph standing in the room: warm metal frame, a mat, and
 *   glass catching the light of the bulb. Empty when no photo is set yet,
 *   so the page still reads while the pictures are being gathered.
 *
 * Args:
 *   - src   : public path of the photo.
 *   - alt   : description for screen readers.
 *   - tilt    : resting rotation.
 *   - delay   : entrance delay in seconds.
 *   - compact : smaller frame, used next to long letters.
 *
 * Returns:
 *   The frame.
 */
export function PhotoFrame({ src, alt, tilt, delay, compact }: PhotoFrameProps) {
    // A photo that has not been added yet leaves the frame empty.
    const [failed, setFailed] = useState(false)
    const photo = failed ? "" : src
    return (
        <motion.figure
            className={`bd-frame shrink-0 ${compact ? "bd-frame-compact" : ""}`}
            initial={{ opacity: 0, scale: 0.92, rotate: tilt * 2, y: 14 }}
            animate={{ opacity: 1, scale: 1, rotate: tilt, y: 0 }}
            transition={{ duration: 1.5, delay, ease: EASE_OUT }}
        >
            <div className="bd-frame-inner">
                {photo ? (
                    <Image
                        src={photo}
                        onError={() => setFailed(true)}
                        alt={alt}
                        fill
                        sizes="(max-width: 640px) 60vw, 280px"
                        className="bd-frame-img"
                    />
                ) : (
                    <span aria-hidden className="bd-frame-empty" />
                )}
            </div>
        </motion.figure>
    )
}
