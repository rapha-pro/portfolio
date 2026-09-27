/**
 * About-section narrative story.
 *
 * An ordered list of "blocks". Each block is either prose (rendered as a
 * column of paragraphs) or a photo (rendered as a captioned image). The
 * NarrativeStory component alternates block placement left/right to create
 * a DeepMind-style zig-zag layout.
 *
 */

export type NarrativeProseBlock = {
    kind: "prose"
    kicker?: string // Optional accent kicker above the paragraphs (e.g. "2020 · Canada").
    heading?: string // Optional heading line.
    paragraphs: readonly string[] // One or more paragraphs.
}

export type NarrativePhotoBlock = {
    kind: "photo"
    src: string
    alt: string
    caption: string // Short italic caption shown below the image.
    aspectRatio?: string // Tailwind aspect-ratio value e.g. "4/3" (default) or "5/4" for taller images.
    objectPosition?: string // CSS object-position for the crop, e.g. "center 85%" to show more of the bottom (default "center").
}

export type NarrativeBlock = NarrativeProseBlock | NarrativePhotoBlock

/**
 * The story reads top-to-bottom. Blocks alternate sides, but a photo and
 * the paragraph next to it can share a row if they're consecutive (the
 * layout takes care of pairing).
 */
export const NARRATIVE: readonly NarrativeBlock[] = [
    {
        kind: "photo",
        src: "/images/about%20me/about_me_intro.jpg",
        alt: "Raphaël — a snapshot",
        caption: "A little bit about me, above and beyond",
        aspectRatio: "5/4",
        objectPosition: "center 85%",
    },
    {
        kind: "prose",
        kicker: "Start · New Brunswick",
        heading: "Crossing the Ocean",
        paragraphs: [
            "I landed in Canada about six years ago, right in the middle of the Covid pandemic. A few weeks after lockdown lifted, I enrolled in a new high school in New Brunswick, a quiet little town on the east coast. It was fascinating to see how different the system was. Students moved between classrooms for each subject, while back home country, students stay in one fixed class all year and it is the teachers who move between rooms.",
            "The most striking difference was the fully digital learning environment. Everything ran through Microsoft Teams and OneNote with no physical textbooks in sight, which felt genuinely futuristic. On the flip side, the academic content was considerably lighter than what I had covered back home. I arrived in Grade 11 already having studied topics the North American curriculum reaches in first/second-year university. Adjusting to the new pace took some time.",
        ],
    },
    {
        kind: "prose",
        kicker: "2021 · Ottawa",
        heading: "Ottawa, Here We Go",
        paragraphs: [
            "The family moved to the capital the following year, and I transferred into a more rigorous school. I doubled down on math including calculus, advanced functions, and physics, and took my first formal computer science course. At that point, Python was the only language I knew.",
            "For my final project, I had to build a Trivia web app requiring HTML, CSS, JavaScript, and Django, none of which I had ever touched. With some trial and error and a bit of sibling mentorship, I got it working and placed in the top three of my class. A year later, I was invited back to mentor younger students on web development with Django.",
        ],
    },
    {
        kind: "photo",
        src: "/images/about%20me/infront_of_classroom.jpg",
        alt: "Standing in front of a classroom at Carleton University, leading a tour",
        caption: "Carleton University — Leading a tour.",
        aspectRatio: "5/4",
    },
    {
        kind: "prose",
        kicker: "2022 · Carleton",
        heading: "University, Finally!",
        paragraphs: [
            "I was undecided between Aerospace Engineering and Artificial Intelligence going into university. I ultimately chose Carleton for Computer Science, AI/ML stream, with a minor in Mathematics and Statistics. Freshman year was a steep learning curve. University moves at a completely different pace from high school: you have the freedom to skip classes, skip assignments, and study on your own schedule, with no one watching over you. But with a lot of freedom comes a lot of responsibility.",
            "Second year went deeper into core computer science concepts: systems programming, pointers, memory allocation, data structures and algorithms, skip lists, red-black trees, and combinatorics, each year getting harder than the last. The one thing university taught me, especially in third year, was time management. If you do not learn to manage your time, university will force you to.",
        ],
    },
    {
        kind: "photo",
        src: "/images/about%20me/comp%202804.jpg",
        alt: "Working on a discrete math problem on a whiteboard",
        caption:
            "COMP 2804 · Second year — in discrete math office hours working through problem sets with friends on a whiteboard.",
        aspectRatio: "5/4",
    },
    {
        kind: "prose",
        heading: "Today",
        paragraphs: [
            "I have been blessed to make the Dean's List and Golden Key Honor Society every year since my first semester. My co-ops took me through Ford, where I learned the critical importance of testing in embedded systems, then Caterpillar for DevOps pipelines, the Government of Canada where I got my first real foothold into the field of Data, and by God's grace, Toronto Dominion Bank for a last co-op. Whether it is satellite software, production ML, or cloud infrastructure, I am always eager for opportunities to push what I can build.",
        ],
    },
] as const
