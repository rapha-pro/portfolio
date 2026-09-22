import type { MusicConfig } from "../types"

/**
 * The soundtrack. It starts by itself as message number `startAtMessage`
 * appears (3 = right after the first three messages) and loops quietly.
 *
 * YouTube: paste any link to the video (youtu.be/..., youtube.com/watch?v=...,
 * with or without ?si=...), or just its id. startSeconds skips an intro.
 * The video itself stays hidden.
 *
 * Audio file (the one option iPhones always play without a tap): put an mp3
 * in public/audio/birthday/dulcinee/ and use
 *   source: { kind: "file", src: "/audio/birthday/dulcinee/song.mp3" }
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
    fadeInMs: 5000,
    startAtMessage: 3,
    controls: {
        play: "Play music",
        pause: "Pause music",
        blocked: "Tap for music",
    },
}
