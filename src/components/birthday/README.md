# `components/birthday/`

A cinematic, single-page birthday experience. It never navigates: one
full-screen scene moves through chapters while the light, grain and music
persist, so it feels like one continuous room. All content comes from
`src/lib/data/birthday/<name>/` through props; nothing here is personal.

Route: `src/app/(birthday)/[slug]/page.tsx` (static, one page per registered
person). Server utilities: `src/lib/birthday/` (media folder resolver).
Media preparation: `scripts/birthday-media.mjs` (`pnpm birthday:media <name>`).

## Flow

```
gate ──PIN──▶ tunnel ──flash──▶ archive ──last message──▶ verse ──▶ siblings ──▶ wishes ──▶ finale
             (overlay; the room mounts underneath so photos preload)
```

## Files

| File                               | Role                                                                                                                                                                                                            |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `birthday-experience.tsx`          | Orchestrator. Phase state machine, persistent layers (light rig, grain, music dock, tunnel overlay), theme to `--bd-*` variables, cache warming during the gate, dev-only `startAt`.                            |
| `birthday.css`                     | All styles, prefixed `.bd-`, inside `@layer components` so Tailwind utilities still win. Layout variables (`--bd-top`, `--bd-card-h`...) and keyframes live here.                                               |
| `stage/light-rig.tsx`              | The single light: bulb, pool, beam, dust, and the warm bloom of the birthday chapter. Eases between `lightModes.ts` presets per chapter; stutters on like an old filament.                                      |
| `stage/hanging-bulb.tsx`           | SVG bulb with cord, socket, filament and glow, driven by a brightness motion value.                                                                                                                             |
| `stage/dust-motes.tsx`             | CSS-animated dust in the beam (seeded positions).                                                                                                                                                               |
| `stage/film-grain.tsx`             | Vignette and transform-only film grain.                                                                                                                                                                         |
| `stage/lightModes.ts`              | Brightness, reach, bloom and dust per chapter.                                                                                                                                                                  |
| `gate/pin-gate.tsx`                | Entrance. One hidden numeric input drives the boxes; shake and hints on a wrong code; boxes fold into a point of light on success.                                                                              |
| `tunnel/tunnel-transition.tsx`     | Overlay timing: canvas, whisper line, warm flash, callbacks. Calm glow with reduced motion.                                                                                                                     |
| `tunnel/tunnelScene.ts`            | Canvas engine: dust streaks and ghosted photographs rushing out of a point of light. No React.                                                                                                                  |
| `archive/memory-room.tsx`          | Labels, photo stream and typed messages; cues the music at the configured message; hosts the enlarged card; fades the photos away at the end.                                                                   |
| `archive/photo-stream.tsx`         | Seamless px/s marquee of prints, lit by a soft mask, dimmed by flickers, paused by hover, keyboard focus, long press or an enlarged card. Plays only on-screen videos. Still and swipeable with reduced motion. |
| `archive/photo-card.tsx`           | One print: `next/image` or a muted looping video, resting tilt, 3D tilt and glare under the mouse; a tap reports its geometry so it can be enlarged.                                                            |
| `archive/focused-media.tsx`        | The tapped card flying to the center at its natural proportions, a countdown line, and the flight back after `focusMs`.                                                                                         |
| `archive/typed-messages.tsx`       | Paragraph by paragraph typing with human rhythm, ink fade, stable layout, tap or space to skip; reports each message as it starts; pauses while a card is enlarged.                                             |
| `archive/music-prompt.tsx`         | "Play the music" invitation; the tap is the gesture browsers need for sound.                                                                                                                                    |
| `archive/archive-labels.tsx`       | Corner labels of the archive.                                                                                                                                                                                   |
| `music/useBirthdayMusic.ts`        | One controller over a hidden YouTube player (IFrame API) or an audio file: fade in, pause, blocked detection.                                                                                                   |
| `music/youtubeApi.ts`              | Minimal IFrame API typings, a singleton loader, and `parseYouTubeId` for pasted links.                                                                                                                          |
| `music/music-dock.tsx`             | Corner sound button with equalizer; the song title links to YouTube (always on wide screens, briefly on phones).                                                                                                |
| `music/music-host.tsx`             | Where the YouTube iframe lives; placed invisibly under the sound button when an iPhone refuses a scripted start, so one tap starts it.                                                                          |
| `siblings/siblings-section.tsx`    | Her siblings messages, one at a time: name, framed photo, message, progress dots.                                                                                                                               |
| `siblings/photo-frame.tsx`         | Warm metal frame with a mat and glass, empty until a photo is set.                                                                                                                                              |
| `verse/verse-section.tsx`          | Verse line by line, reference, divider, prayer.                                                                                                                                                                 |
| `wishes/birthday-wishes.tsx`       | Warm chapter: the calligraphy line written left to right, her name letter by letter, the celebration, blessing paragraphs.                                                                                      |
| `wishes/sun-number.tsx`            | Her age as a child-drawn sun: shimmering number, ring, long and short rays, sparkles.                                                                                                                           |
| `wishes/balloons.tsx`              | Glossy balloons rising along the sides.                                                                                                                                                                         |
| `wishes/confetti.tsx`              | Confetti tumbling down (about half on phones).                                                                                                                                                                  |
| `finale/final-reveal.tsx`          | Closing line sequence, then the notebook, the last words and a song credit; replay link after a long while.                                                                                                     |
| `finale/notebook-illustration.tsx` | Self-drawing leather notebook with stitching, ribbon and pen.                                                                                                                                                   |
| `shared/`                          | Easing (`motion.ts`), fonts, image preloading, and hooks: flicker, wake lock, auto advance, page visibility, follow-reveal scrolling, the continue button.                                                      |

## Behavior notes

- Story clocks pause while the page is hidden (animations freeze in the
  background, timers would not), and the screen is kept awake during the story.
- Reduced motion: no tunnel movement, no flicker or sway, whole paragraphs
  instead of typing, a still photo row, opacity-only transitions.
- On short phones the calm chapters glide their text up as it appears, so
  nothing is revealed below the controls.
