/**
 * Shared types for the personal birthday experiences served at
 * raphaelonana.dev/<slug>. Every person gets a folder in
 * src/lib/data/birthday/<name>/ that exports one BirthdayConfig, which is
 * registered in src/lib/data/birthday/index.ts.
 *
 * Everything here must stay plain serializable data (no functions): the
 * config is passed from the server page to the client experience as props.
 */

export type BirthdayProfile = {
    name: string // display name, reused across all copy
    year: number // shown on the archive labels
    slug: string // URL segment: "mystery" -> raphaelonana.dev/mystery
    pageTitle: string // browser tab + link preview title
    pageDescription: string // link preview description
}

export type PinHint = {
    afterAttempts: number // revealed once this many wrong attempts have happened
    text: string
}

export type HighlightColor = "green" | "yellow"

/** A piece of a line, optionally in a highlight color. */
export type RichPart = {
    text: string
    color?: HighlightColor
}

export type UnlockedConfig = {
    lines: RichPart[][] // one entry per line; the lines fade in one after another
}

export type BriefingConfig = {
    message: string // phones: headphones and landscape
    desktopMessage: string // wide screens: headphones only
}

export type GateConfig = {
    pin: string // digits only; its length sets the number of boxes
    title: string
    subtitle: string
    cornerLabel: string // small line in the top corner of the entrance, "" to hide
    inputLabel: string // screen reader label for the code input
    unlocked: UnlockedConfig | null // the screen right after the right code, null to skip
    briefing: BriefingConfig | null // the "headphones and landscape" screen, null to skip
    wrongMessages: string[] // cycled on each wrong attempt
    hints: PinHint[] // revealed progressively, leave empty for none
    tunnelWhisper: string | null // short line inside the tunnel, null to hide
}

export type ArchiveConfig = {
    title: string // top left label
    reference: string // small line under the title
    subject: string // top right label
    counter: string // "{count}" is replaced with the number of photos
    streamLabel: string // screen reader description of the photo stream
}

export type PhotoFileEntry = string | { file: string; position?: string; poster?: string }

export type PhotoConfig = {
    folder: string // path inside /public, e.g. "images/birthday/dulcinee"
    files: PhotoFileEntry[] // explicit order; leave empty to use every photo and video in the folder
    order: "name" | "shuffle" // "shuffle" is stable between builds
    videoEvery: number[] // photos between videos, cycled: [3, 4] alternates 3 and 4; [] keeps file order
}

export type BirthdayMedia = {
    kind: "image" | "video"
    src: string // public URL
    poster?: string // videos: still frame shown before playback
    position?: string // CSS object-position for cropping, e.g. "50% 30%"
}

export type MessageTone = "normal" | "quiet" | "emphasis"

export type TypedMessage = {
    text: string | string[] // a string types as one paragraph; an array types line by line
    tone?: MessageTone
    typeSpeedMs?: number // overrides timing.messages.typeSpeedMs
    pauseAfterMs?: number // overrides timing.messages.pauseAfterMs
    fadeInMs?: number // overrides timing.messages.fadeInMs
    fadeOutMs?: number // overrides timing.messages.fadeOutMs
}

export type MusicSource =
    | { kind: "youtube"; link: string; startSeconds?: number } // any YouTube link, or just the id
    | { kind: "file"; src: string }

export type MusicConfig = {
    source: MusicSource
    title: string // shown briefly in the corner once it starts, "" to hide
    artist: string
    volume: number // 0 to 100
    fadeInMs: number
    startAtMessage: number // music starts as this message appears (0 = the first);
    // any negative value starts it with the photos, before the first message
    controls: {
        play: string // accessible label of the corner button while paused
        pause: string // accessible label of the corner button while playing
        blocked: string // shown when the phone needs one tap before it allows sound
    }
}

export type VerseConfig = {
    kicker: string | null
    lines: string[] // revealed one by one
    reference: string
    prayerIntro: string
    prayer: string
}

export type CelebrationConfig = {
    number: string // the sparkling number under the title, e.g. her new age
    rays: number // sun rays drawn around it
    balloons: number // 0 for none
    confetti: number // 0 for none (phones show about half)
}

export type TitleLine = {
    text: string
    font?: "serif" | "script" // script is the calligraphy face
}

export type WishesConfig = {
    kicker: string | null
    title: TitleLine[] // one entry per visual line
    celebration: CelebrationConfig | null // null hides the number, balloons and confetti
    paragraphs: string[]
}

export type SiblingEntry = {
    name: string
    kicker?: string // small line above the name; falls back to SiblingsConfig.kicker
    message: string | string[] // one paragraph, or several
    photo: string // file name in the siblings folder, or a path starting with "/"
}

export type SiblingsConfig = {
    kicker: string | null // small line above each message, unless the entry has its own
    entries: SiblingEntry[] // shown one at a time, in order
}

export type FinaleLine = {
    text: string
    holdMs?: number // overrides timing.finale.defaultHoldMs
}

export type FinaleConfig = {
    lines: FinaleLine[] // shown one at a time before the notebook appears
    instruction: string
    closingTitle: string // "" to hide
    blessing: string
    replayLabel: string
}

export type InterfaceCopy = {
    continueLabel: string
    skipHint: string // screen reader hint for tapping to skip the typing
    closePhotoLabel: string // screen reader label of an enlarged photo
}

export type BirthdayTheme = {
    background: string // near black page background
    surface: string // photo card placeholder
    ink: string // main text
    inkMuted: string // secondary text
    inkSubtle: string // labels
    light: string // the bulb, glows and highlights
    ember: string // warm accent for the birthday section
    green: string // highlight on the unlock screen
    yellow: string // highlight on the unlock screen
    festive: string[] // balloons and confetti
}

export type BirthdayTiming = {
    gate: {
        introDelayMs: number // before the title fades in
        successHoldMs: number // spark of the right code, before the unlock screen
        unlockedLineMs: number // between the unlock screen lines
        unlockedHoldMs: number // the unlock screen, from its first line to its exit
        briefingRevealMs: number // before continue appears on the briefing screen, which then waits
    }
    tunnel: {
        durationMs: number // acceleration until the flash
        flashMs: number // flash fading into the memory room
    }
    archive: {
        messagesDelayMs: number // photos alone before the first message
        photosFadeMs: number // photos fading away after the last message
        photoSpeed: number // pixels per second on tablets and desktops
        photoSpeedMobile: number // pixels per second on phones
        focusMs: number // how long a tapped photo stays enlarged
    }
    messages: {
        typeSpeedMs: number // average delay between characters
        pauseAfterMs: number // hold after a paragraph finishes typing
        fadeInMs: number
        fadeOutMs: number
        lineGapMs: number // pause between lines of a multi-line paragraph
        phoneScale: number // phones type and pause this much slower (1 = same)
    }
    verse: {
        lineStaggerMs: number
        holdMs: number | null // auto continue after the reveal, null to wait for a tap
    }
    siblings: {
        holdMs: number | null // per sibling
    }
    wishes: {
        holdMs: number | null
    }
    finale: {
        lineFadeMs: number
        defaultHoldMs: number
        replayAfterMs: number // the replay link appears this long after the last screen
    }
    flicker: {
        enabled: boolean
        minGapMs: number
        maxGapMs: number
    }
}

export type BirthdayConfig = {
    profile: BirthdayProfile
    gate: GateConfig
    archive: ArchiveConfig
    photos: PhotoConfig
    messages: TypedMessage[]
    music: MusicConfig
    verse: VerseConfig
    siblings: SiblingsConfig | null // null skips the family chapter
    wishes: WishesConfig
    finale: FinaleConfig
    ui: InterfaceCopy
    theme: BirthdayTheme
    timing: BirthdayTiming
}
