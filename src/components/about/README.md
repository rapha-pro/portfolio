# `components/about/`

Everything rendered inside `<section id="about">`. The section is split into
two halves:

1. **Narrative** — a DeepMind-style zig-zag timeline that tells the "how I got
   here" story, mixing prose paragraphs with captioned photos.
2. **Tabs** — an animated tab switcher hosting Experience / Education /
   Achievements / Hobbies.

All content lives in `src/lib/data/*.ts`, so adding a new job, course, hobby,
or narrative chapter is a one-object edit — no JSX changes required.

## Files

| File | Role |
| ---- | ---- |
| `index.tsx` | Top-level orchestrator — renders the heading, `<NarrativeTimeline />`, and `<TabSwitcher />`. Exports the default `About` component consumed by `app/page.tsx`. |
| `narrative-timeline.tsx` | Zig-zag story timeline. Pulls from `lib/data/narrative.ts` and alternates blocks left/right of a center rail. Each row fades/slides in on scroll. |
| `tab-switcher.tsx` | Reusable animated tab switcher with a `layoutId` sliding pill. Also exports the inline SVG tab icons (`IconBriefcase`, `IconGrad`, `IconTrophy`, `IconSparkles`) used by tabs + the Achievements rails. |
| `experience-tab.tsx` | Vertical timeline of jobs from `lib/data/experience.ts`. Each entry uses `<CompanyLogo />` with a brand-colour rail node and a glass card. |
| `education-tab.tsx` | School stack + year sub-selector (Freshman / Sophomore / Junior / Senior). Drives the course grid below, using data from `lib/data/education.ts`. |
| `course-card.tsx` | One course tile. Shows banner/monogram, code, title, description, language, and reveals the grade on hover/tap. |
| `achievements-tab.tsx` | Two-column layout: Awards (left) + Activities (right). Data from `lib/data/achievements.ts`. |
| `hobbies-tab.tsx` | Responsive card grid for hobbies. Data from `lib/data/hobbies.ts`. Supports an optional muted looping `videoSrc` per card. |
| `company-logo.tsx` | Smart logo tile with resilient fallback chain: local image → Simple Icons CDN → letter-monogram badge. Used by both Experience and Education. |

## Data sources

- `src/lib/data/narrative.ts` — story blocks (prose + photo).
- `src/lib/data/experience.ts` — employment history.
- `src/lib/data/education.ts` — schools + per-year course catalog.
- `src/lib/data/achievements.ts` — awards + activities.
- `src/lib/data/hobbies.ts` — hobbies cards.

## Adding content

- **New job:** prepend an entry to `EXPERIENCE` in `experience.ts`.
- **New course:** push to the correct `YearBlock.courses` array in `education.ts`.
  Drop a banner into `public/images/courses/` if you have one; otherwise the
  card shows a monogram.
- **New hobby:** push to `HOBBIES` in `hobbies.ts`. Add a photo under
  `public/images/`. A `videoSrc` can be added later for a looping clip.
- **Narrative chapter:** insert a `{ kind: "prose" | "photo", ... }` entry at
  the correct point in `NARRATIVE` — the timeline auto-alternates sides.
