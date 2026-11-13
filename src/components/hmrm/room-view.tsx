import Link from "next/link"
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react"
import type { HqCopy, HqPhoto, HqRoomStop } from "@/lib/data/hmrm/types"
import { RoomGallery } from "./room-gallery"
import { TourAutoAdvance } from "./tour-auto-advance"

type RoomViewProps = {
    stop: HqRoomStop
    photos: HqPhoto[]
    copy: HqCopy
}

const BASE = "/mrmpf_hmrm_design"

/**
 * Purpose:
 *   One stop of the guided tour: the room's photos first (they settle in as
 *   if walking through the door), then its step, floor, name and a short
 *   description, with previous and next rooms at the bottom (the last room
 *   leads to the menu). The tour moves on by itself after the last photo,
 *   or after a reading pause on a room without photos. The Menu button opens the whole building. A room
 *   without photos shows its text only.
 *
 * Args:
 *   - stop   : the room, its floor and its neighbours.
 *   - photos : the room's photos, possibly none.
 *   - copy   : page words.
 *
 * Returns:
 *   The room page content.
 */
export function RoomView({ stop, photos, copy }: RoomViewProps) {
    const { room, floor, previous, next } = stop

    return (
        <main className="hq-room" data-photos={photos.length > 0 || undefined}>
            <Link href={`${BASE}/menu`} className="hq-back">
                <LayoutGrid size={16} aria-hidden />
                {copy.menu}
            </Link>

            {photos.length === 0 && next && (
                <TourAutoAdvance href={`${BASE}/${next.id}`} copy={copy} />
            )}

            {photos.length > 0 && (
                <div className="hq-room-media">
                    <RoomGallery
                        photos={photos}
                        label={room.name}
                        copy={copy}
                        nextHref={next ? `${BASE}/${next.id}` : null}
                    />
                </div>
            )}

            <div className="hq-room-body hq-rise">
                <p className="hq-label">
                    <span className="hq-step-count">
                        {copy.step} {stop.step} / {stop.total}
                    </span>
                    {floor.name} · {floor.theme}
                </p>
                <h1 className="hq-room-title hq-serif">{room.name}</h1>
                <p className="hq-room-sub hq-serif">{room.subtitle}</p>
                <p className="hq-room-text">{room.description}</p>
                {photos.length > 1 && <p className="hq-room-hint">{copy.swipe}</p>}
            </div>

            <nav className="hq-room-nav">
                {previous ? (
                    <Link href={`${BASE}/${previous.id}`} className="hq-step">
                        <ChevronLeft size={18} aria-hidden />
                        <span>
                            <span className="hq-label">{copy.previous}</span>
                            <span className="hq-step-name">{previous.cardName}</span>
                        </span>
                    </Link>
                ) : (
                    <span />
                )}
                <Link
                    href={next ? `${BASE}/${next.id}` : `${BASE}/menu`}
                    className="hq-step hq-step--next"
                    data-primary
                >
                    <span>
                        <span className="hq-label">{next ? copy.next : copy.finish}</span>
                        <span className="hq-step-name">
                            {next ? next.cardName : copy.finishLink}
                        </span>
                    </span>
                    <ChevronRight size={18} aria-hidden />
                </Link>
            </nav>
        </main>
    )
}
