import type { Metadata } from "next"
import { HMRM_DESIGN, getRoom, roomIds } from "@/lib/data/hmrm"
import { RoomPage } from "@/components/hmrm/room-page"

type RoomRouteProps = {
    params: Promise<{ room: string }>
}

// Only the rooms listed in lib/data/hmrm/building.ts exist; any other URL is a 404.
export const dynamicParams = false

/**
 * Purpose:
 *   Prerenders one page per room at build time.
 *
 * Returns:
 *   The list of { room } params.
 */
export function generateStaticParams(): { room: string }[] {
    return roomIds().map((room) => ({ room }))
}

/**
 * Purpose:
 *   Names the tab after the room (noindex is inherited from the layout).
 *
 * Args:
 *   - params : route params (a promise in Next.js 16).
 *
 * Returns:
 *   Page metadata.
 */
export async function generateMetadata({ params }: RoomRouteProps): Promise<Metadata> {
    const stop = getRoom((await params).room)
    if (!stop) return {}
    const title = `${stop.room.name} · ${HMRM_DESIGN.profile.pageTitle}`
    return {
        title: { absolute: title },
        openGraph: { title, description: stop.room.subtitle, type: "website" },
    }
}

/**
 * Purpose:
 *   raphaelonana.dev/mrmpf_hmrm_design/<room>: one stop of the guided tour.
 *
 * Args:
 *   - params : route params.
 *
 * Returns:
 *   The room page.
 */
export default async function RoomRoute({ params }: RoomRouteProps) {
    return <RoomPage roomId={(await params).room} />
}
