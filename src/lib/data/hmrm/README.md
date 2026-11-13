# `lib/data/hmrm/`

Everything you can change about the HMRM headquarters pages without touching
components. `raphaelonana.dev/mrmpf_hmrm_design` starts the guided tour on its
first room; each room lives at `/mrmpf_hmrm_design/<room id>` and the whole
building at `/mrmpf_hmrm_design/menu`.

| To change...                                  | Edit                         |
| --------------------------------------------- | ---------------------------- |
| Floors, rooms, names, subtitles, descriptions | `building.ts`                |
| Which photos a room shows                     | `building.ts` (`photos`)     |
| Tour order (which floor comes first)          | `building.ts` (`TOUR_ORDER`) |
| The highlighted room                          | `building.ts` (`featured`)   |
| Title, small words, tab title, link preview   | `copy.ts`                    |
| Colors                                        | `theme.ts`                   |

## Photos

Photos live in `public/images/hmrm_headquarter_design/`. A room's `photos`
lists folders (every image inside, sorted by file name) or single files:

```ts
photos: ["office_floor", "meeting rooms"] // two folders
photos: ["main hall/welcome.jpg"] // one file
photos: [] // no photos yet
```

Rooms without photos yet: `aire-de-jeux`, and `stationnement` (its `parking`
folder is linked but empty).

## Writing copy

No dashes or em dashes as punctuation (hyphens inside words such as
"Rez-de-chaussée" are spelling).
