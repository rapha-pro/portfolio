# `components/hero/`

The landing hero section — first thing a visitor sees. Composed of a two-
column layout with atmospheric background effects, scroll-parallax orbs, a
GSAP entrance timeline, and a 3D skill cube on the right.

All text content lives in `src/lib/data/hero-copy.ts`; all skills come from
`src/lib/data/skills.ts`. Keeps this folder focused on layout + motion.

## Files

| File | Role |
| ---- | ---- |
| `index.tsx` | Default export `Hero`. Owns the `<section id="home">`, mouse-parallax handler, and the GSAP entrance timeline that staggers in each column. Composes all the subcomponents below. |
| `hero-background.tsx` | Atmospheric backdrop — accent gradient blobs, `<ParticleField />`, grid overlay, and the floating orb pills that track cursor movement for parallax. |
| `status-badge.tsx` | "Open to opportunities" glass chip with a sparkles icon. |
| `identity-block.tsx` | Greeting kicker + first/last name with gradient underline + typewriter role line (uses `react-simple-typewriter`). |
| `bio-card.tsx` | Four-paragraph bio inside a `<GlassCard />`, ending in a "reach out in Contact" line. Pulls copy from `HERO_COPY.bio`. |
| `action-bar.tsx` | Primary + secondary magnetic CTAs (Get in touch, Resume) and the row of animated social icon pills (`SocialIconButton`). |
| `skill-marquee.tsx` | Horizontal auto-scrolling marquee of the non-cube skill chips. Duplicates its items for a seamless `translateX(-50%)` loop. |
| `photo-card.tsx` | Full-bleed portrait inside a `<TiltCard />` + `<GlassCard />` frame, with ambient accent lighting and a caption chip. |
| `skill-cube-panel.tsx` | Renders the 3D `<SkillCube />` (from `components/three/`) plus a summary chip row beneath it. |

## Data sources

- `src/lib/data/hero-copy.ts` — all visible text: name, greeting, bio
  paragraphs, typewriter roles, photo caption.
- `src/lib/data/skills.ts` — skill catalog shared with the marquee + the
  `<SkillCube />`. `CUBE_SKILLS` flags the six faces; `FLOATING_SKILLS` feeds
  the marquee.
- `src/lib/data/socials.ts` — social links rendered in the action bar.
