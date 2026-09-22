"use client"

import { motion } from "framer-motion"
import type { ArchiveConfig } from "@/lib/data/birthday/types"

type ArchiveLabelsProps = {
    archive: ArchiveConfig
    count: number
    visible: boolean
}

/**
 * Purpose:
 *   The index card details printed in the corners of the memory room:
 *   archive name and reference on the left, her name, the year and the
 *   number of frames on the right.
 *
 * Args:
 *   - archive : label copy.
 *   - count   : number of photos, for the counter.
 *   - visible : fade in once the light is on.
 *
 * Returns:
 *   A header strip across the top of the room.
 */
export function ArchiveLabels({ archive, count, visible }: ArchiveLabelsProps) {
    const counter = archive.counter.replace("{count}", String(count).padStart(3, "0"))

    return (
        <motion.header
            className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-4 pt-[max(16px,env(safe-area-inset-top))] sm:px-8 sm:pt-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: visible ? 2.2 : 1, delay: visible ? 1.8 : 0 }}
        >
            <div>
                <p className="bd-label flex items-center gap-2 text-[var(--bd-ink-muted)]">
                    <motion.span
                        aria-hidden
                        className="block h-1 w-1 rounded-full bg-[var(--bd-light)]"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {archive.title}
                </p>
                <p className="bd-label mt-1 pl-3">{archive.reference}</p>
            </div>
            <div className="text-right">
                <p className="bd-label text-[var(--bd-ink-muted)]">{archive.subject}</p>
                <p className="bd-label mt-1">{counter}</p>
            </div>
        </motion.header>
    )
}
