/** How the room's light behaves in each chapter of the story. */
export type LightMode = "off" | "archive" | "verse" | "warm" | "finale"

type LightLevels = {
    power: number // bulb and pool brightness
    poolScale: number // how far the pool of light reaches
    bloom: number // warm ambient glow filling the room
    motes: number // dust in the beam
}

export const LIGHT_LEVELS: Record<LightMode, LightLevels> = {
    off: { power: 0, poolScale: 0.85, bloom: 0, motes: 0 },
    archive: { power: 1, poolScale: 1, bloom: 0, motes: 1 },
    verse: { power: 0.78, poolScale: 0.9, bloom: 0.1, motes: 0.7 },
    warm: { power: 1, poolScale: 1.3, bloom: 1, motes: 0.4 },
    finale: { power: 0.92, poolScale: 1.08, bloom: 0.5, motes: 0.8 },
}
