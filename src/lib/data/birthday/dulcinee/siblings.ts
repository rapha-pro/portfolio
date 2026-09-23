import type { SiblingsConfig } from "../types"

/**
 * A word from her siblings, shown one at a time after the verse: the name
 * on top, their message under it, and a framed photo of the two of them.
 *
 * Photos: drop the files in public/images/birthday/dulcinee/siblings/ and
 * put the file name here without the extension ("samy" finds samy.jpg,
 * samy.jpeg, samy.png...). A missing file simply leaves the frame empty,
 * so the page still works before the pictures arrive. A path starting with
 * "/" is used as it is.
 *
 * message takes one string, or a list of strings for several paragraphs.
 * Set the whole export to null to skip the chapter.
 */
export const SIBLINGS: SiblingsConfig = {
    kicker: "A word from your precious family",
    entries: [
        {
            name: "Samy",
            photo: "samy",
            message:
                "Ma chère combi Becky, en ce jour très spécial du 23 septembre, le Seigneur voulait se voir étant une étoile, un réconfort, une aide et une personne très spéciale dans la vie de ceux qui l'entourent, et il a décidé de te faire naître. Je suis énormément reconnaissant de t'avoir dans ma vie. Comme je te l'ai toujours dit, tu es une grande bénédiction dans ma vie, et ma prière est que tu le sois avec toutes les personnes avec qui tu entreras en contact. Que le Seigneur te bénisse et qu'il te fasse chaque jour prendre conscience de qui tu es : Sa Terre épouse. I love you very much et je prie que cette journée se passe merveilleusement bien. Joyeuse réjouissance 💫🌈🥳🥳🩷🩷",
        },
        {
            name: "Laurent",
            photo: "laurent",
            message: [
                "💖 Bonne note de réjouissances à toi, ma petite sœur BECKY ! 🎉🥰",
                "Aujourd’hui est un jour particulier, car tu célèbres tes 20 ans. Deux décennies de vie, de sourires, de souvenirs et de belles étapes franchies. ❤️",
                "Tu n’es pas seulement ma petite sœur, tu es une personne que je porte profondément dans mon cœur. 🥹❤️",
                "Que cette nouvelle année de ta vie soit remplie de bonheur, d’amour, de paix, de réussite et de belles surprises. Que Dieu guide chacun de tes pas, protège ton cœur et t’accorde la force de réaliser tous tes rêves. 🙏🏽✨",
                "BECKY, ma petite sœur je t’aime énormément et je suis heureux de te voir grandir ❤️",
                "Bonne note de réjouissances à toi, ma petite sœur adorée. ❤️🎉 Que du bonheur pour toi aujourd’hui et pour toutes les années à venir ! 🥰🎊",
            ],
        },
        {
            name: "Mon foyer 🥺",
            photo: "emma",
            message: [
                "Cc ma juju ❤️",
                "Tout ceci, c'est vraiment pour te donner une expérience mémorable de ce jour mémorable. Le 23 septembre est l'un des jours les plus importants de ma vie sur terre, parce qu'il renvoie à la personne qui occupe un siège important dans ma vie : ma Sœur de L'ÉTERNITÉ, ma jumelle d'Amour, ma meilleure amie, et encore plus. Ma Joie en te regardant, c'est de réaliser qu'autant que tu l'es pour moi, je le suis aussi pour toi. Nous partageons la même mission, la même cause, le même combat (celui d'anéantir la mort), et nous partagerons la même Victoire quand nous aurons achevé la course et ramené à la Vie chaque Écriture qui nous concerne. Que notre lien soit Résurrection, que notre Force soit la Joie de L'ÉTERNEL, et que notre Amour ne se limite jamais à la gémellité, mais toujours à la Fraternité de Chez Nous. Aujourd'hui comme demain, n'oublie jamais QUE PAPA T'AIME, et qu'en dessous, ta SŒUR, ta jumelle Emma t'aime ❤️ Enjoy your day my lovely twin 👯‍♀️💖💖💖",
                "Tu es une preuve de L'AMOUR DE DIEU Pour Moi ❤️",
            ],
        },
        {
            name: "Dany",
            photo: "dany",
            message: "Joyeux anniversaire Becky, Que Dieu te bénisse, Je t'aime très fort 🎂",
        },
    ],
}
