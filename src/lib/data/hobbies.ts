/**
 * Hobbies / life-outside-the-terminal data.
 *
 * Rendered as a responsive card grid inside the Hobbies tab. Each entry
 * pairs a photo + a short personal story. Video support is stubbed via the
 * optional `videoSrc` field — when set, the card can render a short muted
 * loop instead of (or in addition to) the photo.
 */

export type Hobby = {
  /** Display title ("Piano"). */
  title: string
  /** One-liner shown under the title ("Summer 2024 · Downtown Ottawa"). */
  meta: string
  /** 2–4 short sentences — tell the story, keep it human. */
  story: string
  /** Emoji rendered in the header chip. Purely decorative. */
  emoji: string
  /** Image under /public/. */
  imageSrc: string
  /** Short <img alt>. */
  imageAlt: string
  /** Optional tint used on the card's header accent bar. */
  accent: string
  /** Optional video clip (muted autoplay loop). Not yet used. */
  videoSrc?: string
}

export const HOBBIES: readonly Hobby[] = [
  {
    title: "Piano",
    meta: "Church musician · ongoing",
    story:
      "It started about five years ago. I actually wanted to play drums, but there wasn't a kit at church — and the pianist doubled as the singer, so the bench kept going empty. A small group of us got trained for about six months and, before long, I was playing Sunday services entirely by ear. I've been hooked on that instrument since.",
    emoji: "🎹",
    imageSrc: "/images/on piano.jpg",
    imageAlt: "Playing piano",
    accent: "#8B5CF6",
  },
  {
    title: "Cycling",
    meta: "Summer weekends · Ottawa / Montréal",
    story:
      "The best way I know to clear a head full of code. I ride through Ottawa's paths when I'm home and along the Lachine Canal in Montréal — part cardio, part moving meditation, part excuse to find a good coffee at the other end.",
    emoji: "🚴",
    imageSrc: "/images/cycling.jpg",
    imageAlt: "Cycling",
    accent: "#10B981",
  },
  {
    title: "Soccer",
    meta: "Pickup games · when the weather allows",
    story:
      "Grew up on small pitches back home — the muscle memory never quite leaves. I still play pickup games whenever a group forms; I'm more creative midfielder than scoring striker, but I'll take a clean through-ball over a goal any day.",
    emoji: "⚽",
    imageSrc: "/images/main_profile.jpg",
    imageAlt: "Soccer",
    accent: "#F59E0B",
  },
  {
    title: "Tennis",
    meta: "Evenings · local courts",
    story:
      "The newest one, and the one I'm worst at. I took it up to have something that forces me to be fully off-screen for an hour — and nothing demands presence like trying to return a serve you completely misread. Slowly, painfully, getting better.",
    emoji: "🎾",
    imageSrc: "/images/tennis.jpg",
    imageAlt: "Playing tennis",
    accent: "#06B6D4",
  },
] as const
