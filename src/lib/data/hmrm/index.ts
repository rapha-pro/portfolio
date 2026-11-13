import type { HqConfig, HqRoomStop } from "./types"
import { FLOORS, TOUR_ORDER } from "./building"
import { HQ_COPY, HQ_PROFILE } from "./copy"
import { THEME } from "./theme"

/** The HMRM headquarters design pages, served at raphaelonana.dev/mrmpf_hmrm_design. */
export const HMRM_DESIGN: HqConfig = {
    profile: HQ_PROFILE,
    theme: THEME,
    copy: HQ_COPY,
    floors: FLOORS,
    tourOrder: TOUR_ORDER,
}

/** Every room with its floor, in guided tour order. */
function tourStops() {
    return TOUR_ORDER.flatMap((floorId) => {
        const floor = FLOORS.find((f) => f.id === floorId)
        return floor ? floor.rooms.map((room) => ({ floor, room })) : []
    })
}

/**
 * Purpose:
 *   Every room id, one page each.
 *
 * Returns:
 *   Room ids in guided tour order.
 */
export function roomIds(): string[] {
    return tourStops().map((s) => s.room.id)
}

/**
 * Purpose:
 *   Finds a room with its floor, its step in the guided tour and the rooms
 *   before and after it, for the tour controls of a room page.
 *
 * Args:
 *   - id : the room id from the URL.
 *
 * Returns:
 *   The room stop, or undefined when no room has that id.
 */
export function getRoom(id: string): HqRoomStop | undefined {
    const stops = tourStops()
    const index = stops.findIndex((s) => s.room.id === id)
    if (index < 0) return undefined
    const { floor, room } = stops[index]
    const link = (i: number) =>
        stops[i] ? { id: stops[i].room.id, cardName: stops[i].room.cardName } : null
    return {
        floor: { id: floor.id, name: floor.name, theme: floor.theme },
        room,
        step: index + 1,
        total: stops.length,
        previous: link(index - 1),
        next: link(index + 1),
    }
}
