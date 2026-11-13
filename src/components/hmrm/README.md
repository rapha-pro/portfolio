# `components/hmrm/`

The HMRM headquarters proposal: a private, French, mobile first page for
church members. The building is drawn floor by floor; each room opens its own
page with real photos of how it could look and a short description. All
content comes from `src/lib/data/hmrm/` through props.

Routes, in `src/app/(private)/mrmpf_hmrm_design/`:

| File              | Role                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| `layout.tsx`      | noindex metadata, dark viewport, font, palette as `--hq-*` variables. |
| `page.tsx`        | The guided tour starts here, on its first room (the entrance).        |
| `[room]/page.tsx` | One static page per room, each a step of the tour.                    |
| `menu/page.tsx`   | The whole building as a grid, reached from the Menu button.           |

## Files

| File                    | Role                                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `building-grid.tsx`     | Title and one row per floor (rooftop on top), three room cards each; the main hall is highlighted.          |
| `room-page.tsx`         | Server: loads a room and its photos, renders `room-view`. Used by the tour start and room pages.            |
| `room-view.tsx`         | A room: photos, floor, name, subtitle, description, previous and next room, back to the building.           |
| `room-gallery.tsx`      | Slideshow: 4 s per photo with a gold bar, then the next room of the tour; arrows, swipe, thumbnails, pause. |
| `tour-auto-advance.tsx` | On a room without photos: 8 s reading time with a gold bar, then the next room; pause button.               |
| `hmrm.css`              | All styles, prefixed `.hq-`, inside `@layer components`.                                                    |
| `shared/fonts.ts`       | The serif (Cormorant Garamond).                                                                             |

## Behavior notes

- Entrances are CSS keyframes (floors set down one by one from the basement
  up, the room photo settling in), so content shows before JavaScript loads
  on slow phones. Framer Motion only handles hover and press on the cards.
- Reduced motion turns the entrances off.
