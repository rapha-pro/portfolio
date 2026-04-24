/**
 * Hero section copy.
 *
 * Kept separate from components so it's trivial to tweak voice/wording
 * without touching JSX, and easier to internationalize later.
 */

export const HERO_COPY = {
  firstName: "Raphaël",
  lastName: "Onana",
  greetingKicker: "Hello, world — I'm",

  bio: [
    /* Paragraph 1 — opens with the name substituted into the sentence */
    "I'm a passionate developer obsessed with data,",
    /* Paragraph 2 */
    "I build end-to-end ML pipelines and ship products that scale.",
    /* Paragraph 3 */
    "Based in Montréal, open to remote opportunities worldwide.",
    /* Paragraph 4 */
    "Currently focused on LLM fine-tuning & agentic systems.",
  ] as const,

  /** Typewriter loop in the identity block. */
  roles: [
    "Data Scientist",
    "Machine Learning Engineer",
    "Full-Stack AI Engineer",
  ] as const,

  photoCaption: "High School graduation · June 2022",
} as const
