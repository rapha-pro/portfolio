"use client"

import Link from "next/link"
import { MotionConfig, motion } from "framer-motion"
import { Play } from "lucide-react"
import type { HqCopy, HqFloor } from "@/lib/data/hmrm/types"

type BuildingGridProps = {
    floors: HqFloor[] // rooftop first
    copy: HqCopy
}

/**
 * Purpose:
 *   The building, floor by floor: one row per floor (name and theme, then
 *   its rooms), the rooftop on top. The floors are laid down one after the
 *   other from the basement up, like a building going up. Every room is a
 *   link to its own page; a button at the top restarts the guided tour.
 *
 * Args:
 *   - floors : floors from the rooftop down.
 *   - copy   : page words.
 *
 * Returns:
 *   The page content.
 */
export function BuildingGrid({ floors, copy }: BuildingGridProps) {
    const count = floors.length

    return (
        <MotionConfig reducedMotion="user">
            <main className="hq-page">
                <header className="hq-head hq-rise">
                    <p className="hq-label">{copy.brand}</p>
                    <h1 className="hq-title hq-serif">
                        {copy.title} <em>{copy.titleAccent}</em>
                    </h1>
                    <p className="hq-lead">
                        {copy.eyebrow}. {copy.lead}
                    </p>
                    <Link href="/mrmpf_hmrm_design" className="hq-start">
                        <Play size={14} aria-hidden />
                        {copy.startTour}
                    </Link>
                </header>

                <ol className="hq-building">
                    {floors.map((floor, i) => {
                        const fromBottom = count - 1 - i
                        return (
                            <li
                                key={floor.id}
                                className="hq-floor"
                                style={{ animationDelay: `${0.25 + fromBottom * 0.12}s` }}
                            >
                                <div className="hq-floor-label">
                                    <span className="hq-floor-name">{floor.name}</span>
                                    <span className="hq-floor-theme">{floor.theme}</span>
                                </div>
                                <ul className="hq-floor-rooms" data-count={floor.rooms.length}>
                                    {floor.rooms.map((room) => (
                                        <li key={room.id}>
                                            <motion.div
                                                className="hq-card-wrap"
                                                whileHover={{ y: -3 }}
                                                whileTap={{ scale: 0.96 }}
                                            >
                                                <Link
                                                    href={`/mrmpf_hmrm_design/${room.id}`}
                                                    className="hq-card"
                                                    data-featured={room.featured || undefined}
                                                >
                                                    <span className="hq-card-name">
                                                        {room.cardName}
                                                    </span>
                                                    <span className="hq-card-sub">
                                                        {room.subtitle}
                                                    </span>
                                                </Link>
                                            </motion.div>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        )
                    })}
                </ol>
            </main>
        </MotionConfig>
    )
}
