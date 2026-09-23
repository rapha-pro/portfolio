@AGENTS.md

# Portfolio (Next.js)

Stunning, animation-heavy personal portfolio. The goal is world-class visual polish: smooth GSAP/Framer Motion transitions, 3D Three.js elements, glass-morphism, and a cohesive design token system. Every change should feel intentional and premium.

---

## Stack

| Layer           | Library / Version                                              |
| --------------- | -------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router)                                        |
| Language        | TypeScript 5                                                   |
| Styling         | Tailwind CSS 4 (utility-first, CSS variables for theming)      |
| Animation       | Framer Motion 12 + GSAP 3 + `@gsap/react`                      |
| 3D              | Three.js r184                                                  |
| UI components   | HeroUI 3 + Aceternity UI patterns                              |
| Icons           | Lucide React                                                   |
| Theme           | `next-themes` (dark/light), AccentProvider (violet/cyan/amber) |
| Package manager | pnpm                                                           |

---

## Design system

### Color tokens (globals.css)

All colors are CSS variables scoped to `:root` (light) and `.dark` (dark mode). Three accent themes are applied via a class on `<html>`:

| Class                      | Accent color |
| -------------------------- | ------------ |
| `.accent-violet` (default) | `#8b5cf6`    |
| `.accent-cyan`             | `#06b6d4`    |
| `.accent-amber`            | `#f59e0b`    |

Key semantic tokens:

- `--bg` / `--bg-raised` — page background surfaces
- `--fg` / `--fg-muted` / `--fg-subtle` — text hierarchy
- `--accent` / `--accent-glow` / `--accent-soft` — current accent
- `--glass` / `--glass-strong` / `--glass-highlight` — backdrop-blur surfaces
- `--border-app` — universal border color

Tailwind shorthand utilities: `text-brand`, `text-muted`, `text-subtle`, `text-accent`, `border-app`, `bg-[var(--bg)]`.

### Typography

- Body: **Plus Jakarta Sans** (variable, loaded via `next/font/google`)
- Mono / code: **JetBrains Mono**

### Glass morphism

Use `<GlassCard>` (`src/components/ui/glass-card.tsx`) for elevated surfaces. It applies `backdrop-blur`, the `--glass` background, and a subtle border.

### Animation conventions

- Entry animations: Framer Motion `whileInView` / `useInView` with `once: true`. Standard spring: `{ duration: 0.6-0.7, ease: [0.22, 1, 0.36, 1] }`.
- Hover effects: subtle scale / tilt via `<TiltCard>` or `whileHover`.
- Page-level choreography (hero reveals, section headers): GSAP timelines.
- Never use CSS `transition` for anything animated by Framer Motion or GSAP.

---

## Project structure

```
src/
  app/
    layout.tsx        — Root HTML, fonts, <Providers>
    page.tsx          — Mounts Navbar → Hero → About → Projects → Contact
    providers.tsx     — AccentProvider + ThemeProvider
  components/
    navbar/           — Desktop + mobile nav, AccentPicker, ThemeToggle
    hero/             — 3D background, skill cube, bio card, marquee
    about/            — Narrative timeline + tabbed arc (see below)
    ui/               — Reusable primitives (GlassCard, TiltCard, MagneticButton, …)
    birthday/         — Personal birthday experiences (see below)
  lib/
    data/             — All site content as typed TS constants (no CMS)
    data/birthday/    — One folder per birthday person (copy, PIN, music, theme, timing)
    birthday/         — Server helpers for birthday pages (media folder resolver)
public/
  images/
    about me/         — Narrative + hobby photos (paths must be URL-encoded)
    courses/junior/   — Junior-year course banners
    experience/       — Company logo images
    logos/            — Skill/tech logos
    projects/         — Project screenshots
```

---

## About section (`src/components/about/`)

### Narrative timeline

- Blocks come from `lib/data/narrative.ts` as `NarrativeBlock[]`.
- **Pairing rule:** consecutive blocks share one two-column row (left + right). Even index → left column; odd index → right column. This eliminates whitespace — a photo always sits beside its prose.
- `ProseBlock` renders text directly with **no card background** (no `GlassCard` wrapper).
- `PhotoBlock` wraps images in `TiltCard + GlassCard` for the framed photo look.
- To add a chapter: append a `{ kind: "photo" }` + `{ kind: "prose" }` pair to `NARRATIVE`.

### Experience tab

- **Desktop:** zig-zag center-rail layout. Even entries → left, odd → right. Center column (64 px) holds a glowing company-initial node + period label.
- **Mobile:** collapses to single column with left rail (absolute-positioned).
- Data: `lib/data/experience.ts` → `EXPERIENCE[]`.
- Logo logic: `localSrc` → Simple Icons CDN → letter monogram. Use `bgOverride: "#hex"` for logos designed on specific brand backgrounds (e.g. Caterpillar yellow on `#1C1C1C`).

### Education tab

- Schools stack + year selector (Freshman/Sophomore/Junior/Senior).
- Course banners: `public/images/courses/{year}/filename.ext`.

### Hobbies tab

- `imageSrc` is **optional** — omit to hide the media block (no image placeholder).
- Images live in `public/images/about me/` — use URL-encoded paths (`/images/about%20me/file.jpg`).

---

## Birthday pages (`/[slug]`)

- Private, noindex pages such as `/mystery`, served by `src/app/(birthday)/[slug]/page.tsx` (static, `dynamicParams = false`, only slugs in `src/lib/data/birthday/index.ts` exist).
- Content per person lives in `src/lib/data/birthday/<name>/`; web-ready photos and videos in `public/images/birthday/<name>/`, generated by `pnpm birthday:media <name>` from full-size originals in the git-ignored `media-originals/birthday/<name>/`. Components in `src/components/birthday/` are generic and receive everything through props.
- Self-contained design: own palette (`theme.ts` mapped to `--bd-*` variables), styles in `components/birthday/birthday.css` (`.bd-` prefix, `@layer components`), Cormorant Garamond serif. It does not use the portfolio accent system.
- Dev only: `?chapter=room|verse|siblings|wishes|finale` opens a chapter directly. See the READMEs in both birthday folders.

---

## Data files (`src/lib/data/`)

| File              | What it contains                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `narrative.ts`    | Story blocks: `NarrativeProseBlock \| NarrativePhotoBlock`. Blocks pair sequentially in the timeline.                                        |
| `experience.ts`   | `ExperienceEntry[]` — jobs most-recent first. Fields: company, role, kind, location, period, bullets, logo, accent, lightLogoBg, bgOverride. |
| `education.ts`    | `SCHOOLS[]` + `YEARS[]` (4-year course catalog).                                                                                             |
| `hobbies.ts`      | `Hobby[]` — imageSrc/videoSrc are optional.                                                                                                  |
| `achievements.ts` | `AWARDS[]` + `ACTIVITIES[]`.                                                                                                                 |
| `skills.ts`       | Canonical skill list (cube faces + full marquee).                                                                                            |
| `hero-copy.ts`    | Name, bio paragraphs, typewriter roles, photo caption.                                                                                       |
| `socials.ts`      | Email, GitHub, LinkedIn links.                                                                                                               |

---

## Coding conventions

- **Every exported function needs a JSDoc** with Purpose, Args, Returns — but don't over-comment line by line.
- Data-driven: content changes are one-object edits in `lib/data/*.ts`. No JSX changes for content.
- **Modular components:** each visual concern is its own file. No 200-line copy-paste blocks.
- File naming: `kebab-case.tsx` for components, `camelCase.ts` for data/utilities.
- Prefer Framer Motion for all scroll/entry/hover animations; use GSAP for complex timeline choreography.
- CSS variables (not Tailwind hardcoded colors) for anything that must respect the theme or accent.
- Every section directory has a `README.md` describing its file structure.

## Guide

- Do not fake any information you do not know. Stick to what was given to you, if you do not know, then ask
- No dashes or em-dashes anywhere in user-facing content: project descriptions, narratives, hobby stories, copy files, or any `.txt` content file. Use commas, colons, semicolons, or restructure the sentence instead.

---
