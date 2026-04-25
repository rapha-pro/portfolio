/**
 * About-section narrative story.
 *
 * An ordered list of "blocks". Each block is either prose (rendered as a
 * column of paragraphs) or a photo (rendered as a captioned image). The
 * NarrativeStory component alternates block placement left/right to create
 * a DeepMind-style zig-zag layout.
 *
 * Edit this file to tweak the story — the UI iterates over the array.
 */

export type NarrativeProseBlock = {
  kind: "prose"
  /** Optional accent kicker above the paragraphs (e.g. "2020 · Canada"). */
  kicker?: string
  /** Optional heading line. */
  heading?: string
  /** One or more paragraphs. */
  paragraphs: readonly string[]
}

export type NarrativePhotoBlock = {
  kind: "photo"
  src: string
  alt: string
  /** Short italic caption shown below the image. */
  caption: string
}

export type NarrativeBlock = NarrativeProseBlock | NarrativePhotoBlock

/**
 * The story reads top-to-bottom. Blocks alternate sides, but a photo and
 * the paragraph next to it can share a row if they're consecutive (the
 * layout takes care of pairing).
 */
export const NARRATIVE: readonly NarrativeBlock[] = [
  {
    kind: "photo",
    src: "/images/about%20me/about_me_intro.jpg",
    alt: "Raphaël — a snapshot",
    caption: "A little bit about me — beyond the terminal.",
  },
  {
    kind: "prose",
    kicker: "2020 · New Brunswick",
    heading: "Crossing an ocean with a notebook full of math",
    paragraphs: [
      "I landed in Canada in the middle of 2020 and enrolled in a new high school in New Brunswick. The math felt familiar — back home in Cameroon, Grade 11 had already taken us through topics that North American curricula reach in first-year university. The theory came easy; the language of computers did not.",
      "I knew exactly zero code. My older brother sat me down one afternoon and walked me through a few pages of C: variables, loops, and finally arrays. Something clicked. I kept going on my own, and for the first time a textbook felt like a toy.",
    ],
  },
  {
    kind: "prose",
    kicker: "2021 · Ottawa",
    heading: "Python, in earnest",
    paragraphs: [
      "The family moved to Ottawa the following year, and I transferred into a more rigorous school. I doubled down on math — calculus, advanced functions, physics — and took my first formal computer-science course. The language was Python, and that was all I knew at that point. I was hooked anyway.",
      "For the final term project I built something end-to-end, shipped it, and realized two things: I liked the feedback loop of software, and I wanted to do this for much more than a grade.",
    ],
  },
  {
    kind: "photo",
    src: "/images/about%20me/infront_of_classroom.jpg",
    alt: "Standing in front of a classroom",
    caption: "High school in Ottawa — somewhere between a math problem and a Python script.",
  },
  {
    kind: "prose",
    kicker: "2022 · Carleton",
    heading: "From hooked to hired",
    paragraphs: [
      "I went off to Carleton for Computer Science, AI/ML stream, with a minor in Maths & Stats. Freshman year turned into a chain reaction: Dean's List, Golden Key, a growing github, and the rush of finally having peers who also got excited about obscure algorithms.",
      "The internships followed — Ford, Caterpillar, Elections Canada, TD — each one teaching me a different shape of real-world engineering: automation, DevOps, embedded systems, and production ML on real customer data.",
    ],
  },
  {
    kind: "photo",
    src: "/images/about%20me/comp%202804.jpg",
    alt: "Working on a discrete math problem on a whiteboard",
    caption:
      "COMP 2804 · discrete math office hours — working through problem sets with friends on a whiteboard.",
  },
  {
    kind: "prose",
    heading: "Today",
    paragraphs: [
      "I live in Montréal, code in a few languages, think in French, English, and just-enough-Spanish, and spend the off-hours at a piano, on a bike, or on a tennis court I'm slowly losing to. On-keyboard I'm deep in LLM fine-tuning, RAG, and agentic systems — and always open to a good conversation.",
    ],
  },
] as const
