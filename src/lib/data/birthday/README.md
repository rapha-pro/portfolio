# `lib/data/birthday/`

Everything you can change about a birthday page, without touching components.
Each person has a folder here; the page for that person lives at
`raphaelonana.dev/<slug>`.

| File        | Role                                                            |
| ----------- | --------------------------------------------------------------- |
| `index.ts`  | Registry of all birthday pages (`BIRTHDAYS`) + `getBirthday()`. |
| `types.ts`  | The `BirthdayConfig` shape every person's folder must satisfy.  |
| `dulcinee/` | Dulcinée's page, served at `/mystery`.                          |

## Editing Dulcinée's page

| To change...                                       | Edit                                                         |
| -------------------------------------------------- | ------------------------------------------------------------ |
| Her name, URL, year, tab title                     | `dulcinee/profile.ts` (the name flows into every other file) |
| The PIN, entrance text, hints                      | `dulcinee/gate.ts` (`pin` is the only place the code lives)  |
| Photos and videos                                  | See "Photos and videos" below                                |
| Order or crop                                      | `dulcinee/photos.ts`                                         |
| Typed messages                                     | `dulcinee/messages.ts`                                       |
| Music (YouTube link or mp3)                        | `dulcinee/music.ts`                                          |
| Bible verse and prayer                             | `dulcinee/verse.ts`                                          |
| Her siblings names, messages and photos            | `dulcinee/siblings.ts`                                       |
| Birthday message, the "20" sun, balloons, confetti | `dulcinee/wishes.ts` (`celebration`, `null` hides it)        |
| Ending and the notebook lines                      | `dulcinee/finale.ts`                                         |
| "Continue" and other small words                   | `dulcinee/ui.ts`                                             |
| Colors                                             | `dulcinee/theme.ts` (`festive` colors balloons and confetti) |
| Card speed, pauses, flicker                        | `dulcinee/timing.ts` (`photoSpeed`: lower is slower)         |

### Photos and videos

1. Put the full-size originals (photos and videos, straight from the phone) in
   `media-originals/birthday/dulcinee/`. That folder is git ignored, so the
   heavy files never reach GitHub.
2. Run `pnpm birthday:media dulcinee`. It writes web versions to
   `public/images/birthday/dulcinee/`: photos at 1600 px, videos as silent
   looping MP4s of at most 20 seconds (`--max-seconds 30` to change) with a
   poster frame. Re-running only processes new files. Videos need ffmpeg.
3. Anything you do not want published can sit in
   `media-originals/birthday/dulcinee/_unused/`.

Every photo and video in the public folder is shown, sorted by file name,
with a video woven in after every few photos (`videoEvery: [3, 4]` in
`photos.ts`; `[]` keeps the plain order). Videos play muted on their card
while it is on screen. Tapping a card
enlarges it for `timing.archive.focusMs` (7 seconds), then it returns.

### Her siblings

`siblings.ts` holds one entry per sibling: name, message, and a photo of the
two of them. They appear one at a time after the verse, with the name on top,
the framed photo beside it and the message underneath.

Put the photos in `public/images/birthday/dulcinee/siblings/` (that folder is
ignored by the memory stream) and point `photo` at them, for example
`"/images/birthday/dulcinee/siblings/grace.jpg"`. An empty `photo` leaves the
frame empty, so the page works before the pictures arrive. Set the whole
export to `null` to skip the chapter.

### Music

- Paste any YouTube link (or just the id) into `source.link`. The video must
  allow embedding. Current song: "In Christ Alone" (Depths of Worship).
- It starts by itself when message number `startAtMessage` appears (3 = after
  the first three messages) and fades in. Typing the PIN counts as
  interaction, so browsers allow the sound.
- iPhones never start sound on their own. There the sound button shows
  "Tap for music", and that one tap starts it. The same applies to an mp3
  (`source: { kind: "file", src: "/audio/birthday/dulcinee/song.mp3" }`).
- The song title next to the sound button (and the credit on the last
  screen) opens the song on YouTube and pauses the page's music.
- With an empty link the sound button does not appear.

### Previewing a chapter while editing (development only)

`pnpm dev`, then open any of:

- `http://localhost:3000/mystery` (the full experience)
- `http://localhost:3000/mystery?chapter=room`
- `http://localhost:3000/mystery?chapter=verse`
- `http://localhost:3000/mystery?chapter=siblings`
- `http://localhost:3000/mystery?chapter=wishes`
- `http://localhost:3000/mystery?chapter=finale`

The `chapter` shortcut is ignored in production, so the PIN cannot be skipped
on the live site. While typing, tap (or press space) to finish a line or skip
a pause.

## Adding someone else

1. Copy `dulcinee/` to a new folder, e.g. `grace/`, and rename the exported
   constant in its `index.ts` (e.g. `GRACE`).
2. Edit every file in the new folder: at least `profile.ts` (new `slug`),
   `gate.ts` (new `pin`) and `photos.ts` (`folder: "images/birthday/grace"`).
3. Put the originals in `media-originals/birthday/grace/` and run
   `pnpm birthday:media grace`.
4. Register it in `index.ts`: `export const BIRTHDAYS = [DULCINEE, GRACE]`.

Only slugs listed in `BIRTHDAYS` exist; any other URL stays a 404. Pages are
`noindex`, and link previews show the page's own title and description rather
than the portfolio's.

## Good to know

The PIN is a gentle gate, not security: it ships with the page, and the photos
are public files. Keep anything truly private out of these folders.
