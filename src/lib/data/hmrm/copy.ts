import type { HqCopy, HqProfile } from "./types"

/** Link preview, tab title and where the room photos live. */
export const HQ_PROFILE: HqProfile = {
    pageTitle: "Siège MRMPF",
    pageDescription:
        "Une proposition pour le futur siège de l'église. Touchez une pièce pour y entrer.",
    photoFolder: "images/hmrm_headquarter_design",
}

/** Every word of the pages that is not a floor or a room. */
export const HQ_COPY: HqCopy = {
    brand: "MRMPF · HMRM",
    eyebrow: "Proposition pour le futur siège",
    title: "Siège",
    titleAccent: "MRMPF",
    lead: "Touchez une pièce pour y entrer.",
    menu: "Menu",
    startTour: "Commencer la visite",
    step: "Étape",
    finish: "Fin de la visite",
    finishLink: "Voir tout le bâtiment",
    swipe: "La visite avance toute seule. Glissez ou touchez les flèches pour choisir une photo, ou le bouton pause pour vous arrêter.",
    previousPhoto: "Photo précédente",
    nextPhoto: "Photo suivante",
    pause: "Arrêter le défilement",
    play: "Relancer le défilement",
    previous: "Précédente",
    next: "Suivante",
}
