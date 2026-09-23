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

/** Shape of an empty frame, until a photo says otherwise. */
const DEFAULT_RATIO = 0.8

/**
 * Purpose:
 *   A framed photograph standing in the room: warm metal frame, a mat, and
 *   glass catching the light of the bulb. The frame takes the shape of the
 *   photo it holds, so nothing is ever cropped, and landscape pictures get
 *   more width. Empty when no photo is set yet, so the page still reads
 *   while the pictures are being gathered.
 *
 * Args:
 *   - src     : public path of the photo.
 *   - alt     : description for screen readers.
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
    const [ratio, setRatio] = useState(DEFAULT_RATIO)
    const photo = failed ? "" : src

    return (
        <motion.figure
            className={`bd-frame shrink-0 ${compact ? "bd-frame-compact" : ""}`}
            data-shape={ratio >= 1.05 ? "landscape" : "portrait"}
            initial={{ opacity: 0, scale: 0.92, rotate: tilt * 2, y: 14 }}
            animate={{ opacity: 1, scale: 1, rotate: tilt, y: 0 }}
            transition={{ duration: 1.5, delay, ease: EASE_OUT }}
        >
            <div className="bd-frame-inner" style={{ aspectRatio: ratio }}>
                {photo ? (
                    <Image
                        src={photo}
                        onLoad={(e) => {
                            const img = e.currentTarget
                            if (img.naturalWidth > 0) {
                                setRatio(img.naturalWidth / img.naturalHeight)
                            }
                        }}
                        onError={() => setFailed(true)}
                        alt={alt}
                        fill
                        sizes="(max-width: 640px) 80vw, 360px"
                        className="bd-frame-img"
                    />
                ) : (
                    <span aria-hidden className="bd-frame-empty" />
                )}
            </div>
        </motion.figure>
    )
}
