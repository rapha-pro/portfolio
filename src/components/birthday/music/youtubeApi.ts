/**
 * Minimal typings and a singleton loader for the YouTube IFrame Player
 * API, so the birthday pages need no extra dependency.
 */

export type YTPlayer = {
    playVideo: () => void
    pauseVideo: () => void
    seekTo: (seconds: number, allowSeekAhead: boolean) => void
    setVolume: (volume: number) => void
    unMute: () => void
    getPlayerState: () => number
    destroy: () => void
}

type YTPlayerEvent = { target: YTPlayer; data: number }

type YTPlayerOptions = {
    host?: string
    width?: string
    height?: string
    videoId: string
    playerVars?: Record<string, string | number>
    events?: {
        onReady?: (e: YTPlayerEvent) => void
        onStateChange?: (e: YTPlayerEvent) => void
        onError?: (e: YTPlayerEvent) => void
    }
}

export type YTNamespace = {
    Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer
    PlayerState: {
        UNSTARTED: number
        ENDED: number
        PLAYING: number
        PAUSED: number
        BUFFERING: number
        CUED: number
    }
}

declare global {
    interface Window {
        YT?: YTNamespace
        onYouTubeIframeAPIReady?: () => void
    }
}

let apiPromise: Promise<YTNamespace> | null = null

const ID = /^[\w-]{11}$/

/**
 * Purpose:
 *   Extracts the video id from whatever was pasted in music.ts: a bare id,
 *   youtu.be/<id>, youtube.com/watch?v=<id>, /embed/<id>, /shorts/<id> or
 *   /live/<id>, with or without extra parameters such as ?si=.
 *
 * Args:
 *   - link : the pasted link or id.
 *
 * Returns:
 *   The 11 character id, or "" when none can be found.
 */
export function parseYouTubeId(link: string): string {
    const value = link.trim()
    if (!value) return ""
    if (ID.test(value)) return value
    try {
        const url = new URL(value.startsWith("http") ? value : `https://${value}`)
        const fromQuery = url.searchParams.get("v")
        if (fromQuery && ID.test(fromQuery)) return fromQuery
        const parts = url.pathname.split("/").filter(Boolean)
        const candidate = url.hostname.includes("youtu.be")
            ? parts[0]
            : parts[parts.findIndex((p) => ["embed", "shorts", "live", "v"].includes(p)) + 1]
        return candidate && ID.test(candidate) ? candidate : ""
    } catch {
        return ""
    }
}

/**
 * Purpose:
 *   Injects the IFrame API script once and resolves when it is ready.
 *   Chains any existing onYouTubeIframeAPIReady handler instead of
 *   replacing it.
 *
 * Returns:
 *   A promise of the global YT namespace.
 */
export function loadYouTubeApi(): Promise<YTNamespace> {
    if (apiPromise) return apiPromise

    apiPromise = new Promise<YTNamespace>((resolve, reject) => {
        if (window.YT?.Player) {
            resolve(window.YT)
            return
        }
        const previous = window.onYouTubeIframeAPIReady
        window.onYouTubeIframeAPIReady = () => {
            previous?.()
            if (window.YT) resolve(window.YT)
        }
        const script = document.createElement("script")
        script.src = "https://www.youtube.com/iframe_api"
        script.async = true
        script.onerror = () => {
            apiPromise = null
            reject(new Error("YouTube IFrame API failed to load"))
        }
        document.head.appendChild(script)
    })

    return apiPromise
}
