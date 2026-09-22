"use client"

import { useRef, useState, type CSSProperties, type PointerEvent } from "react"
import Image from "next/image"
import type { BirthdayMedia } from "@/lib/data/birthday/types"
import { CARD_SIZES } from "../shared/preload"

export type CardOpening = {
    index: number // position in the stream, to hide that exact card while open
    media: BirthdayMedia
    rect: { left: number; top: number; width: number; height: number } // where it sits now
    tilt: number
    ratio: number // natural width / height of the photo or video
    still: string // what the card shows right now, for an instant first frame
    time: number // video position, so the enlarged video continues seamlessly
}

type PhotoCardProps = {
    media: BirthdayMedia
    index: number
    tilt: number // resting rotation in degrees, like a print laid by hand
    lift: number // vertical offset as a fraction of the card height
    eager: boolean // load immediately (the first cards on screen)
    duplicate: boolean // second copy used by the seamless loop
    hidden: boolean // currently lifted into the enlarged view
    onOpen: ((opening: CardOpening) => void) | null // null disables enlarging
}

/**
 * Purpose:
 *   One print in the memory stream: a rounded photograph (or a muted,
 *   looping video) with a lit top edge and a soft shadow. With a mouse it
 *   tilts in 3D toward the cursor with a following glare, in the spirit of
 *   the Aceternity cards on the portfolio. A tap reports where the card is
 *   so it can be lifted out and enlarged. Tilt goes straight to CSS
 *   variables, so pointer moves never re-render.
 *
 * Args:
 *   - media     : photo or video.
 *   - index     : position in the stream.
 *   - tilt      : resting rotation.
 *   - lift      : resting vertical offset.
 *   - eager     : skip lazy loading.
 *   - duplicate : hidden from assistive technology.
 *   - hidden    : invisible while its enlarged copy is shown.
 *   - onOpen    : called on tap with the card's geometry.
 *
 * Returns:
 *   The card slot.
 */
export function PhotoCard({
    media,
    index,
    tilt,
    lift,
    eager,
    duplicate,
    hidden,
    onOpen,
}: PhotoCardProps) {
    const cardRef = useRef<HTMLButtonElement>(null)
    const [loaded, setLoaded] = useState(media.kind === "video")

    const onMove = (e: PointerEvent<HTMLButtonElement>) => {
        const el = cardRef.current
        if (!el || e.pointerType !== "mouse") return
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        el.style.setProperty("--ry", `${(x - 0.5) * 18}deg`)
        el.style.setProperty("--rx", `${(0.5 - y) * 14}deg`)
        el.style.setProperty("--gx", `${x * 100}%`)
        el.style.setProperty("--gy", `${y * 100}%`)
    }

    const onLeave = () => {
        const el = cardRef.current
        if (!el) return
        el.style.setProperty("--ry", "0deg")
        el.style.setProperty("--rx", "0deg")
    }

    const open = () => {
        const el = cardRef.current
        if (!el || !onOpen) return
        onLeave()
        const r = el.getBoundingClientRect()
        const content = el.querySelector("img, video")
        let ratio = 0.8
        let still = media.kind === "video" ? (media.poster ?? "") : ""
        let time = 0
        if (content instanceof HTMLImageElement && content.naturalWidth > 0) {
            ratio = content.naturalWidth / content.naturalHeight
            still = content.currentSrc || still
        } else if (content instanceof HTMLVideoElement) {
            if (content.videoWidth > 0) ratio = content.videoWidth / content.videoHeight
            time = content.currentTime
        }
        onOpen({
            index,
            media,
            rect: { left: r.left, top: r.top, width: r.width, height: r.height },
            tilt,
            ratio,
            still,
            time,
        })
    }

    return (
        <div
            className="bd-card-slot"
            aria-hidden={duplicate || undefined}
            style={
                {
                    "--tilt": `${tilt}deg`,
                    "--lift": `calc(var(--bd-card-h) * ${lift})`,
                } as CSSProperties
            }
        >
            <button
                ref={cardRef}
                type="button"
                tabIndex={-1}
                aria-label={media.kind === "video" ? "Enlarge video" : "Enlarge photo"}
                className="bd-card"
                data-loaded={loaded}
                data-kind={media.kind}
                style={hidden ? { visibility: "hidden" } : undefined}
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                onClick={open}
            >
                {media.kind === "video" ? (
                    <video
                        ref={(el) => {
                            if (el) el.muted = true
                        }}
                        className="bd-card-img"
                        src={media.src}
                        poster={media.poster}
                        muted
                        loop
                        playsInline
                        preload="none"
                        disablePictureInPicture
                        style={media.position ? { objectPosition: media.position } : undefined}
                    />
                ) : (
                    <Image
                        src={media.src}
                        alt=""
                        fill
                        sizes={CARD_SIZES}
                        loading={eager ? "eager" : "lazy"}
                        fetchPriority={eager ? "high" : "auto"}
                        draggable={false}
                        onLoad={() => setLoaded(true)}
                        className="bd-card-img"
                        style={media.position ? { objectPosition: media.position } : undefined}
                    />
                )}
                <span aria-hidden className="bd-card-sheen" />
                <span aria-hidden className="bd-card-glare" />
            </button>
        </div>
    )
}
