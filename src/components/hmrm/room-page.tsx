import { notFound } from "next/navigation"
import { HMRM_DESIGN, getRoom } from "@/lib/data/hmrm"
import { resolveRoomPhotos } from "@/lib/hmrm/resolveRoomPhotos"
import { RoomView } from "./room-view"

type RoomPageProps = {
    roomId: string
}

/**
 * Purpose:
 *   Server only. Loads a room and its photos (read from the folder at build
 *   time) and renders it. Shared by the tour start (the page root shows the
 *   first room) and every room page.
 *
 * Args:
 *   - roomId : the room id.
 *
 * Returns:
 *   The room view, or a 404 for an unknown id.
 */
export function RoomPage({ roomId }: RoomPageProps) {
    const stop = getRoom(roomId)
    if (!stop) notFound()
    const photos = resolveRoomPhotos(HMRM_DESIGN.profile.photoFolder, stop.room)
    // Keyed by room so each stop starts fresh (first photo, slideshow running).
    return <RoomView key={stop.room.id} stop={stop} photos={photos} copy={HMRM_DESIGN.copy} />
}
