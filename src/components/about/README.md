# `components/about/`

Everything rendered inside `<section id="about">`. The section is split into two halves:

1. **Narrative** — a paired zig-zag timeline that tells the "how I got here" story. Consecutive blocks (prose + photo) share a row so no whitespace is left on either side of the center rail.
2. **Tabs** — an animated tab switcher hosting Experience / Education / Achievements / Hobbies.

All content lives in `src/lib/data/*.ts`, so adding a new job, course, hobby, or narrative chapter is a one-object edit — no JSX changes required.

## Files

| File | Role |
| ---- | ---- |
| `index.tsx` | Top-level orchestrator — renders the section heading, `<NarrativeTimeline />`, and `<TabSwitcher />`. Default export consumed by `app/page.tsx`. |
| `narrative-timeline.tsx` | Paired zig-zag story timeline. Groups `NARRATIVE` blocks into pairs of two and places each pair side-by-side (left + right columns) with a center rail node between rows. Prose blocks render without a card background so text floats naturally beside photos. |
| `tab-switcher.tsx` | Reusable animated tab switcher with a `layoutId` sliding pill. Also exports inline SVG tab icons (`IconBriefcase`, `IconGrad`, `IconTrophy`, `IconSparkles`). |
| `experience-tab.tsx` | Zig-zag timeline of jobs from `lib/data/experience.ts`. **Desktop:** even entries go left, odd go right, with company-initial nodes on the center rail. **Mobile:** single column with left-side rail. |
| `education-tab.tsx` | School stack + year sub-selector (Freshman / Sophomore / Junior / Senior). Drives a course grid below, using data from `lib/data/education.ts`. |
| `course-card.tsx` | One course tile. Shows banner/monogram, code, title, language, and reveals grade on hover/tap. |
| `achievements-tab.tsx` | Two-column layout: Awards (left) + Activities (right). Data from `lib/data/achievements.ts`. |
| `hobbies-tab.tsx` | Responsive card grid. `imageSrc` is optional — omitting it hides the media block entirely (e.g. soccer). Data from `lib/data/hobbies.ts`. |
| `company-logo.tsx` | Smart logo tile: local image → Simple Icons CDN → letter-monogram. Supports `bgOverride` (exact hex tile background) and `lightBg` (white background for dark wordmarks). Used by Experience and Education. |

## Data sources

| File | What it drives |
| ---- | -------------- |
| `src/lib/data/narrative.ts` | Story blocks for the narrative timeline (prose + photo). Blocks come in pairs — each pair fills one two-column row. |
| `src/lib/data/experience.ts` | Employment history, most-recent first. |
| `src/lib/data/education.ts` | Schools + per-year course catalog. Course banners live in `public/images/courses/{year}/`. |
| `src/lib/data/achievements.ts` | Awards + activities. |
| `src/lib/data/hobbies.ts` | Hobby cards. `imageSrc` is optional. |

## Adding content

- **New job:** prepend an entry to `EXPERIENCE` in `experience.ts`. The first entry automatically sits left of the center rail.
- **Logo theming:** use `lightLogoBg: true` (white tile) for dark wordmarks, or `bgOverride: "#hex"` for logos that need a specific brand background (e.g. Caterpillar's yellow mark on dark).
- **New course:** push to the correct `YearBlock.courses` array in `education.ts`. Drop a banner into `public/images/courses/{year}/`.
- **New hobby:** push to `HOBBIES` in `hobbies.ts`. Omit `imageSrc` to show no image; add a `videoSrc` later for a looping clip.
- **Narrative chapter:** insert a `{ kind: "prose" | "photo", ... }` object at the right position in `NARRATIVE`. Blocks are paired sequentially — pair a photo with the prose that belongs beside it.
