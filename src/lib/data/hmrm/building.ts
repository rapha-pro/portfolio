import type { HqFloor } from "./types"

/**
 * The building, from the rooftop down, rooms left to right (three per
 * floor, four on Level 3; the grid adapts to the count). `photos` lists folders (every image inside, by file name) or single
 * files, relative to public/images/hmrm_headquarter_design/. An empty list
 * shows the room without photos.
 */
export const FLOORS: HqFloor[] = [
    {
        id: "toit",
        name: "Toit",
        theme: "Plein air",
        rooms: [
            {
                id: "terrasse",
                name: "Terrasse événementielle",
                cardName: "Terrasse",
                subtitle: "Fêtes, cultes en plein air",
                description:
                    "Une terrasse sur le toit pour les fêtes, les rencontres et les cultes en plein air.",
                photos: ["event terrace"],
            },
            {
                id: "jardin",
                name: "Jardin",
                cardName: "Jardin",
                subtitle: "Calme, verdure, plein air",
                description:
                    "Un jardin calme et vert sur le toit, pour prier et se recueillir à ciel ouvert.",
                photos: ["garden"],
            },
            {
                id: "aire-de-jeux",
                name: "Aire de jeux extérieure",
                cardName: "Aire de jeux",
                subtitle: "Espace clôturé pour enfants",
                description:
                    "Une aire de jeux clôturée sur le toit, où les enfants jouent dehors en toute sécurité.",
                photos: [],
            },
        ],
    },
    {
        id: "niveau-3",
        name: "Niveau 3",
        theme: "Équipes",
        rooms: [
            {
                id: "salle-multimedia",
                name: "Salle Multimédia",
                cardName: "Salle Multimédia",
                subtitle: "Direct, podcast",
                description:
                    "La régie de diffusion en direct, une petite cabine de podcast et des postes de montage, pour partager les cultes en ligne.",
                photos: ["multimedia"],
            },
            {
                id: "studio-enregistrement",
                name: "Studio d'enregistrement",
                cardName: "Studio",
                subtitle: "Enregistrer les chansons",
                description: "Un studio pour enregistrer les chansons et la musique de l'église.",
                photos: ["studio"],
            },
            {
                id: "bureaux",
                name: "Bureaux des équipes",
                cardName: "Bureaux",
                subtitle: "Et salles de réunion",
                description:
                    "Des postes partagés pour les bénévoles et des salles de réunion pour 4, 8 et 20 personnes, chacune avec un écran TV et la visioconférence.",
                photos: ["office_floor", "meeting rooms"],
            },
            {
                id: "bibliotheque",
                name: "Bibliothèque d'étude",
                cardName: "Bibliothèque",
                subtitle: "Étudiants, étude biblique",
                description:
                    "Des places de travail au calme pour les étudiants et une salle réservée à l'étude biblique.",
                photos: ["librairie"],
            },
        ],
    },
    {
        id: "niveau-2",
        name: "Niveau 2",
        theme: "Familles",
        rooms: [
            {
                id: "espace-enfants",
                name: "Espace enfants",
                cardName: "Espace enfants",
                subtitle: "Jeux, école du dimanche",
                description:
                    "Des salles par tranche d'âge pour jouer et pour l'école du dimanche, avec un seul point d'accueil pour la sécurité des enfants.",
                photos: ["kids room"],
            },
            {
                id: "salle-des-mamans",
                name: "Salle des mamans",
                cardName: "Salle des mamans",
                subtitle: "Allaitement, écran en direct",
                description:
                    "Des fauteuils confortables, une table à langer et un lavabo pour s'occuper de bébé, avec un écran qui diffuse le culte en direct.",
                photos: ["mothers room"],
            },
            {
                id: "salle-de-priere",
                name: "Salle de prière",
                cardName: "Salle de prière",
                subtitle: "Ouverte 24h/24, insonorisée",
                description:
                    "Une salle insonorisée à la lumière tamisée, ouverte jour et nuit pour venir prier à tout moment.",
                photos: ["prayer room"],
            },
        ],
    },
    {
        id: "rez-de-chaussee",
        name: "Rez-de-chaussée",
        theme: "Accueil",
        rooms: [
            {
                id: "accueil-cafe",
                name: "Accueil et café",
                cardName: "Accueil et café",
                subtitle: "Comptoir d'accueil, café",
                description:
                    "Le comptoir d'accueil à l'entrée, un bar à café et un coin salon pour se retrouver avant et après le culte.",
                photos: ["main hall"],
            },
            {
                id: "grande-salle",
                name: "Grande salle",
                cardName: "Grande salle",
                subtitle: "Culte, conférences",
                description:
                    "Le cœur du bâtiment, pour le culte du dimanche, les conférences, les mariages et les concerts. Des chaises empilables, une cloison mobile pour la diviser en deux, l'éclairage de scène et la sonorisation intégrés.",
                photos: ["conference room"],
                featured: true,
            },
            {
                id: "cuisine",
                name: "Cuisine et salle à manger",
                cardName: "Cuisine et repas",
                subtitle: "Cantine, réceptions",
                description:
                    "Une cuisine professionnelle et une salle à manger pour les réceptions, les repas communautaires et une cantine en semaine.",
                photos: ["kitchen"],
            },
        ],
    },
    {
        id: "sous-sol",
        name: "Sous-sol",
        theme: "Services",
        rooms: [
            {
                id: "sport-piscine",
                name: "Salle de sport et piscine",
                cardName: "Sport et piscine",
                subtitle: "Piscine de baptême aussi",
                description:
                    "Une salle de sport et une petite piscine qui sert aussi aux baptêmes.",
                photos: ["gym and pool"],
            },
            {
                id: "rangement-technique",
                name: "Rangement et technique",
                cardName: "Rangement et technique",
                subtitle: "Chaises, matériel, serveurs",
                description:
                    "Le rangement des chaises et du matériel, et la salle technique avec les serveurs.",
                photos: ["storage"],
            },
            {
                id: "stationnement",
                name: "Stationnement",
                cardName: "Stationnement",
                subtitle: "Et dépôt de banque alimentaire",
                description:
                    "Le stationnement du bâtiment, avec un dépôt pour une banque alimentaire.",
                photos: ["parking"],
            },
        ],
    },
]

/**
 * The guided tour, floor by floor: it starts at the front door and ends with
 * the basement. Within a floor, rooms follow their left to right order.
 */
export const TOUR_ORDER: string[] = ["rez-de-chaussee", "niveau-2", "niveau-3", "toit", "sous-sol"]
