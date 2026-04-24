# `components/navbar/`

The top navigation. Two fully separate implementations swap based on screen
width: a condensing glass bar on desktop, and a floating bottom dock on
mobile. Both share the same nav items, the accent picker, the theme toggle,
and the brand logo.

## Files

| File | Role |
| ---- | ---- |
| `index.tsx` | Default export `Navbar`. Renders both variants and hides one via Tailwind `hidden md:flex` / `md:hidden` classes so hydration is deterministic. Also owns the scroll-spy IntersectionObserver that lights up the active section in both variants. |
| `navbar-desktop.tsx` | Top pill bar. Condenses on scroll (shrinks, blurs, adds shadow) via a `useMotionValue` + `useTransform`. Uses a shared `layoutId="nav-active"` pill to slide under the active link. |
| `navbar-mobile.tsx` | Floating bottom dock (not full-width — rounded glass pill with safe-area padding). Shared `layoutId="dock-active"` sliding indicator. |
| `nav-items.ts` | Shared list of `{ id, label, icon }` used by both variants. Single source of truth for link order + icons. |
| `brand-logo.tsx` | Custom SVG monogram used as the brand mark. Accent-coloured, animates on hover. |
| `accent-picker.tsx` | Exposes two variants: `Swatches` (the three accent dots shown inline on desktop) and `Dropdown` (collapsed picker shown on mobile). Both write to `AccentProvider` + localStorage. |
| `theme-toggle.tsx` | Sun/moon icon button with a cross-fade animation, wrapped around `next-themes`. |

## Accent + theme providers

The providers that back the accent picker and the theme toggle live in
`src/components/providers/`:
- `accent-provider.tsx` — exposes `{ accent, setAccent }` and toggles a CSS
  class (`accent-violet` | `accent-cyan` | `accent-amber`) on `<html>`.
- The dark/light toggle is handled by `next-themes` in `app/providers.tsx`.
