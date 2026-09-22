"use client"

import { useEffect } from "react"
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { EASE_IN_OUT } from "../shared/motion"
import { DustMotes } from "./dust-motes"
import { HangingBulb } from "./hanging-bulb"
import { LIGHT_LEVELS, type LightMode } from "./lightModes"

type LightRigProps = {
    mode: LightMode
    flicker: MotionValue<number> // from useFlicker, 1 = steady
}

/** Power-on stutter of an old bulb, as fractions of the target brightness. */
const POWER_ON = [0, 0.55, 0.05, 0.82, 0.22, 1]
const POWER_ON_TIMES = [0, 0.12, 0.22, 0.42, 0.55, 1]

/**
 * Purpose:
 *   The persistent light of the experience: bulb, pool of light, beam and
 *   dust, plus the warm bloom of the birthday chapter. It lives across
 *   every phase so the story feels like one continuous room whose light
 *   changes, instead of separate pages.
 *
 * Args:
 *   - mode    : which chapter's lighting to ease towards.
 *   - flicker : flicker multiplier shared with the photo stream.
 *
 * Returns:
 *   Decorative layers behind the content.
 */
export function LightRig({ mode, flicker }: LightRigProps) {
    const levels = LIGHT_LEVELS[mode]
    const power = useMotionValue(0)
    const lit = useTransform(() => power.get() * flicker.get())

    useEffect(() => {
        const target = levels.power
        // Coming out of darkness: stutter on like an old filament.
        const fromDark = power.get() < 0.02 && target > 0
        const controls = fromDark
            ? animate(
                  power,
                  POWER_ON.map((v) => v * target),
                  { duration: 1.9, times: POWER_ON_TIMES, ease: "linear", delay: 0.3 }
              )
            : animate(power, target, { duration: target === 0 ? 0.6 : 2.6, ease: EASE_IN_OUT })
        return () => controls.stop()
    }, [levels.power, power])

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
            {/* Warm bloom for the birthday chapter */}
            <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: levels.bloom }}
                transition={{ duration: 3.5, ease: EASE_IN_OUT }}
                style={{
                    background:
                        "radial-gradient(90% 70% at 50% 38%, color-mix(in srgb, var(--bd-ember) 16%, transparent) 0%, color-mix(in srgb, var(--bd-ember) 5%, transparent) 50%, transparent 80%)",
                }}
            />

            <div className="bd-sway absolute inset-0">
                <motion.div
                    className="absolute inset-0"
                    style={{ opacity: lit, transformOrigin: "50% var(--bd-light-y)" }}
                    initial={false}
                    animate={{ scale: levels.poolScale }}
                    transition={{ duration: 3, ease: EASE_IN_OUT }}
                >
                    <div className="bd-pool absolute inset-0" />
                    <div className="bd-cone" />
                    <motion.div
                        className="absolute inset-0"
                        initial={false}
                        animate={{ opacity: levels.motes }}
                        transition={{ duration: 2 }}
                    >
                        <DustMotes />
                    </motion.div>
                </motion.div>

                <HangingBulb lit={lit} visible={mode !== "off"} />
            </div>
        </div>
    )
}
