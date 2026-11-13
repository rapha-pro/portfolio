import { roomIds } from "@/lib/data/hmrm"
import { RoomPage } from "@/components/hmrm/room-page"

/**
 * Purpose:
 *   raphaelonana.dev/mrmpf_hmrm_design: the guided tour starts right away,
 *   on its first room (the entrance). The building menu lives at /menu.
 *
 * Returns:
 *   The first room of the tour.
 */
export default function HmrmTourStart() {
    return <RoomPage roomId={roomIds()[0]} />
}
