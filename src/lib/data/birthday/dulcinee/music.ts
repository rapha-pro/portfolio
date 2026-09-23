import type { MusicConfig } from "../types"

/**
 * The soundtrack. It starts by itself and loops quietly. startAtMessage
 * says when: a negative value starts it with the photographs, before any
 * message; 0 starts it with the first message, 3 after the first three.
 *
 * YouTube: paste any link to the video (youtu.be/..., youtube.com/watch?v=...,
 * with or without ?si=...), or just its id. startSeconds skips an intro.
 * The video itself stays hidden.
 *
 * Audio file instead of YouTube: put an mp3 in public/audio/birthday/dulcinee/
 * and use
 *   source: { kind: "file", src: "/audio/birthday/dulcinee/song.mp3" }
 *
 * iPhones never start sound on their own; there the corner button shows
 * "Tap for music" and one tap starts it (for YouTube and mp3 alike).
 *
 * Leave link empty for no music (the sound button disappears too).
 */
export const MUSIC: MusicConfig = {
    source: {
        kind: "youtube",
        link: "https://youtu.be/Whp4odkWXho?si=tG3wzWx6NsOozNAV",
        startSeconds: 0,
    },
    title: "In Christ Alone",
    artist: "Depths of Worship",
    volume: 70,
    fadeInMs: 0,
    startAtMessage: -1,
    controls: {
        play: "Play music",
        pause: "Pause music",
        blocked: "Tap for music",
    },
}
