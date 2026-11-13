/**
 * Shared types for the HMRM headquarters design pages served at
 * raphaelonana.dev/mrmpf_hmrm_design (the building) and
 * raphaelonana.dev/mrmpf_hmrm_design/<room id> (one room).
 *
 * Everything here must stay plain serializable data (no functions): it is
 * passed from server pages to client components as props.
 */

export type HqRoom = {
    id: string // URL segment of the room page, e.g. "grande-salle"
    name: string // full name on the room page
    cardName: string // shorter name on the building card
    subtitle: string // a few words under the name, on the card and the room page
    description: string // a short paragraph on the room page
    photos: string[] // files or whole folders, relative to the photo folder, in order
    featured?: boolean // drawn highlighted on the building (the main hall)
}

export type HqFloor = {
    id: string
    name: string // e.g. "Rez-de-chaussée"
    theme: string // e.g. "Accueil"
    rooms: HqRoom[] // left to right
}

export type HqTheme = {
    background: string
    surface: string
    ink: string
    inkMuted: string
    inkSubtle: string
    light: string // warm gold: the accent and the featured room
}

export type HqProfile = {
    pageTitle: string // browser tab and link preview title
    pageDescription: string // link preview description
    photoFolder: string // under public/, e.g. "images/hmrm_headquarter_design"
}

export type HqCopy = {
    brand: string
    eyebrow: string
    title: string
    titleAccent: string
    lead: string
    menu: string // link from a room to the building menu
    startTour: string // link from the menu to the first room
    step: string // "Étape", before "3 / 15"
    finish: string // label of the last room's next button
    finishLink: string // where it goes (the menu)
    swipe: string // hint under a gallery of several photos
    previousPhoto: string // gallery arrow labels
    nextPhoto: string
    pause: string // slideshow button labels
    play: string
    previous: string
    next: string
}

export type HqConfig = {
    profile: HqProfile
    theme: HqTheme
    copy: HqCopy
    floors: HqFloor[] // from the rooftop down, as the building is drawn
    tourOrder: string[] // floor ids, in guided tour order
}

/** A photo ready to render. */
export type HqPhoto = {
    src: string // URL encoded path
    alt: string
}

/** A room with its floor, its place in the guided tour and its neighbours in it. */
export type HqRoomStop = {
    floor: Pick<HqFloor, "id" | "name" | "theme">
    room: HqRoom
    step: number // 1 based position in the tour
    total: number // rooms in the tour
    previous: Pick<HqRoom, "id" | "cardName"> | null
    next: Pick<HqRoom, "id" | "cardName"> | null
}
