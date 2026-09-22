/**
 * Purpose:
 *   Creates a small deterministic pseudo random generator (mulberry32).
 *   Used wherever the birthday pages need "random" looking layouts that
 *   must be identical on the server and the client.
 *
 * Args:
 *   - seed : any string; the same seed always yields the same sequence.
 *
 * Returns:
 *   A function returning floats in [0, 1).
 */
export function seededRandom(seed: string): () => number {
    let h = 1779033703 ^ seed.length
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
        h = (h << 13) | (h >>> 19)
    }
    let state = h >>> 0

    return () => {
        state = (state + 0x6d2b79f5) | 0
        let t = Math.imul(state ^ (state >>> 15), 1 | state)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/**
 * Purpose:
 *   Returns a shuffled copy of a list, stable for a given seed.
 *
 * Args:
 *   - items : the list to shuffle (not mutated).
 *   - seed  : seed for the generator.
 *
 * Returns:
 *   A new array in shuffled order.
 */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
    const rand = seededRandom(seed)
    const out = [...items]
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[out[i], out[j]] = [out[j], out[i]]
    }
    return out
}
