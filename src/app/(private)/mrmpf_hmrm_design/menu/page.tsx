import type { Metadata } from "next"
import { HMRM_DESIGN } from "@/lib/data/hmrm"
import { BuildingGrid } from "@/components/hmrm/building-grid"

export const metadata: Metadata = {
    title: { absolute: `${HMRM_DESIGN.copy.menu} · ${HMRM_DESIGN.profile.pageTitle}` },
}

/**
 * Purpose:
 *   raphaelonana.dev/mrmpf_hmrm_design/menu: the whole building, floor by
 *   floor; each room links to its page, and a button restarts the tour.
 *
 * Returns:
 *   The building grid.
 */
export default function HmrmMenuPage() {
    return <BuildingGrid floors={HMRM_DESIGN.floors} copy={HMRM_DESIGN.copy} />
}
