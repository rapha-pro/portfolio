/**
 * Education data: schools + per-year course catalog.
 *
 * The Education tab renders SCHOOLS as the overview cards and YEARS as a
 * sub-selector that reveals a grid of Course cards. Grades are revealed on
 * hover (or tap on touch).
 *
 * Editing:
 *   - To add a course, append to the YEARS[...].courses array.
 *   - If a banner/logo for a course is presents, it drops in
 *     /public/images/courses/ and reference the filename in `banner`.
 *   - Tint `accent` for each course to color-code the card header.
 *   - Grades default to "In progress" when `grade` is omitted.
 */

export type School = {
    name: string
    degree: string
    location: string
    period: string
    result?: string
    description: string
    logo: string | null
    lightLogoBg?: boolean // True when the logo renders on a light card background.
}

export const SCHOOLS: readonly School[] = [
    {
        name: "Carleton University",
        degree: "Bachelor of Computer Science — AI/ML stream, minor in Math & Stats",
        location: "Ottawa, ON",
        period: "2022 – Present",
        result: "11.75 / 12",
        description:
            "Fourth-year student specializing in Artificial Intelligence and Machine Learning, with a minor in Mathematics and Statistics. Dean's Honour List every term; member of Golden Key.",
        logo: "/images/carleton-logo.png",
        lightLogoBg: true,
    },
    {
        name: "Merivale High School",
        degree: "Ontario Secondary School Diploma",
        location: "Ottawa, ON",
        period: "2020 – 2022",
        result: "Ontario Scholar",
        description:
            "Graduated as an Ontario Scholar with honours standing across math, physics, and my first computer-science course. Where it started.",
        logo: null,
    },
] as const

export type Course = {
    code: string // Carleton course code, e.g. "COMP 1405".
    title: string // Full course title.
    language?: string // Language(s) or stack used — e.g. "Python", "Java, SQL".
    grade?: string // Grade received; leave empty for "In progress".
    description?: string // Optional one-paragraph description (Carleton calendar).
    banner?: string // Optional banner image under /public/images/courses/.
    accent: string
}

export type YearKey = "freshman" | "sophomore" | "junior" | "senior"

export type YearBlock = {
    key: YearKey
    label: string
    period: string
    inProgress?: boolean // True when courses are currently in progress (suppresses grade reveal).
    courses: readonly Course[]
}

/**
 * Four-year arc, most recent first. The first entry is the year selected
 * by default in the Education tab. Descriptions follow the Carleton
 * undergraduate calendar.
 */
export const YEARS: readonly YearBlock[] = [
    {
        key: "senior",
        label: "Senior",
        period: "2026 – 2027",
        inProgress: true,
        courses: [
            {
                code: "COMP 3106",
                title: "Introduction to Artificial Intelligence",
                language: "Python",
                description:
                    "Principles and tools of AI: knowledge representation, reinforcement learning, nature based computing, heuristic search through the state space, and adversarial problem solving modeled as two person and multi person games.",
                banner: "/images/courses/senior/comp%203106%20intro%20to%20AI.png",
                accent: "#8B5CF6",
            },
            {
                code: "COMP 4107",
                title: "Neural Networks",
                language: "Python",
                description:
                    "An introduction to neural networks and deep learning: network architectures, methods for improving optimization and generalization, and neural networks for unsupervised learning.",
                accent: "#F43F5E",
            },
            {
                code: "COMP 4010",
                title: "Reinforcement Learning",
                language: "Python",
                description:
                    "Designing and programming agents that perform complex tasks in interactive environments: Markov decision processes, dynamic programming, Monte Carlo and temporal difference methods, function approximation, policy gradients, and deep reinforcement learning.",
                accent: "#0EA5E9",
            },
            {
                code: "COMP 4900",
                title: "Generative AI & LLMs",
                accent: "#10B981",
            },
            {
                code: "COMP 4114",
                title: "Quantum Computing and Information",
                description:
                    "The ideas behind quantum computing and information: mathematical foundations, quantum theory, architecture and gates, basic quantum algorithms, applications to cryptography, and quantum error correction.",
                banner: "/images/courses/senior/comp%204114%20quantum.jpg",
                accent: "#F59E0B",
            },
            {
                code: "MATH 2404",
                title: "Ordinary Differential Equations I",
                description:
                    "First order equations, linear second and higher order equations, linear systems, and stability of second order systems.",
                banner: "/images/courses/senior/Math%202404%20-%20Differential%20equations.png",
                accent: "#F59E0B",
            },
            {
                code: "SPAN 2010",
                title: "Second Year Spanish I",
                description:
                    "Further study of Spanish toward a more advanced level of proficiency in a range of situations, with equal emphasis on oral and written language.",
                banner: "/images/courses/senior/Span%202010%20-%20Second%20year%20Spanish%20I.png",
                accent: "#EF4444",
            },
        ],
    },
    {
        key: "junior",
        label: "Junior",
        period: "2024 – 2025",
        courses: [
            {
                code: "COMP 3000",
                title: "Operating Systems",
                language: "C, kernel",
                grade: "A",
                banner: "/images/courses/junior/3000_operating_systems.png",
                description:
                    "Operating system implementation, stressing fundamental design issues and how they relate to modern computer architectures. Assignments modify and extend a multitasking operating system.",
                accent: "#0EA5E9",
            },
            {
                code: "COMP 3004",
                title: "Object-Oriented Software Engineering",
                language: "C++",
                grade: "A+",
                banner: "/images/courses/junior/comp3004_banner.png",
                description:
                    "Theory and practice of developing object oriented systems: computer ethics, development processes, requirements, class, scenario and state modeling, UML, design patterns and traceability, through a team project.",
                accent: "#7C3AED",
            },
            {
                code: "COMP 3005",
                title: "Database Management Systems",
                language: "SQL, Postgres",
                grade: "A+",
                banner: "/images/courses/junior/comp3005_banner.png",
                description:
                    "Database management systems and design: entity relationship modelling, normalization, relational schemas, SQL, file organization, indexing, hashing, join algorithms, query processing and optimization, and concurrency control.",
                accent: "#10B981",
            },
            {
                code: "COMP 3007",
                title: "Programming Paradigms",
                language: "Haskell",
                grade: "A+",
                banner: "/images/courses/junior/comp3007_banner.png",
                description:
                    "An introduction to alternative programming paradigms such as functional, constraint based, concurrent, and logic programming.",
                accent: "#5E5086",
            },
            {
                code: "COMP 3105",
                title: "Machine Learning",
                language: "Python",
                grade: "A+",
                banner: "/images/courses/junior/3105_Machine Learning_cover.png",
                description:
                    "Methods for learning relationships from empirical data: supervised and unsupervised learning, specific algorithms and their applications, evaluating ML systems, and data ethics.",
                accent: "#F7931E",
            },
            {
                code: "COMP 3804",
                title: "Design and Analysis of Algorithms",
                grade: "A+",
                banner: "/images/courses/junior/3804_algorithms_design_cover.jpg",
                description:
                    "Design and analysis of algorithms: divide and conquer, dynamic programming, linear programming, greedy algorithms, graph algorithms, and NP completeness.",
                accent: "#EF4444",
            },
            {
                code: "MATH 3007",
                title: "Complex Analysis",
                grade: "A+",
                banner: "/images/courses/junior/Math_3007_complex_analysis.jpg",
                description:
                    "Analytic functions, contour integration, residue calculus, and conformal mapping.",
                accent: "#F59E0B",
            },
            {
                code: "STAT 3504",
                title: "Analysis of Variance & Experimental Design",
                language: "R",
                grade: "A+",
                banner: "/images/courses/junior/stat3504_banner.png",
                description:
                    "Single and multifactor analysis of variance, contrasts and multiple comparisons, analysis of covariance, nested, crossed and repeated measures designs, randomized block, Latin square and factorial experiments.",
                accent: "#0EA5E9",
            },
        ],
    },
    {
        key: "sophomore",
        label: "Sophomore",
        period: "2023 – 2024",
        courses: [
            {
                code: "COMP 2401",
                title: "Systems Programming",
                language: "C",
                grade: "A+",
                description:
                    "Introduction to system level programming and fundamental OS concepts: process and memory management, synchronization, inter process communication, file systems, networking, pointers, heap and stack memory, and system calls.",
                accent: "#64748B",
            },
            {
                code: "COMP 2402",
                title: "Abstract Data Types & Algorithms",
                language: "Java",
                grade: "A+",
                description:
                    "Design and implementation of abstract data types and complexity analysis of data structures such as stacks, queues, lists, trees and graphs, with attention to abstraction, interface specification and hierarchical design.",
                accent: "#DC2626",
            },
            {
                code: "COMP 2406",
                title: "Web Development & Databases",
                language: "Node.js, Express, MongoDB",
                grade: "A+",
                description:
                    "Internet application development with an emphasis on the fundamentals behind web applications: scripting and functional languages, virtual machines, database query languages, remote procedure calls, and performance and security in distributed applications.",
                accent: "#10B981",
            },
            {
                code: "COMP 2404",
                title: "Intro to Software Engineering",
                language: "C++",
                grade: "A+",
                description:
                    "Object oriented software development with an emphasis on maintainable, reusable software: abstraction, modularity, encapsulation, and an introduction to design patterns.",
                accent: "#7C3AED",
            },
            {
                code: "COMP 2804",
                title: "Discrete Structures II",
                grade: "A+",
                description:
                    "A second course in discrete mathematics: counting, sequences and sums, discrete probability, basic statistics, recurrence relations and randomized algorithms, illustrated through examples from computing.",
                accent: "#8B5CF6",
            },
            {
                code: "MATH 2007",
                title: "Calculus III",
                grade: "A+",
                description:
                    "Techniques of integration, improper integrals, polar coordinates, parametric equations, indeterminate forms, sequences and series, and Taylor's formula and series.",
                accent: "#F59E0B",
            },
        ],
    },
    {
        key: "freshman",
        label: "Freshman",
        period: "2022 – 2023",
        courses: [
            {
                code: "COMP 1405",
                title: "Intro to Computer Science I",
                language: "Python",
                grade: "A+",
                description:
                    "Introduction to computer science and programming: algorithm design, control structures, variables and types, linear collections, functions, debugging and testing, with a focus on procedural programming, computational thinking, and problem decomposition.",
                accent: "#3B82F6",
            },
            {
                code: "COMP 1406",
                title: "Intro to Computer Science II",
                language: "Java",
                grade: "A+",
                description:
                    "A second programming course emphasizing problem solving and computational thinking in an object oriented language: abstraction, mutable data structures, inheritance, polymorphism, recursion, program efficiency, testing and debugging.",
                accent: "#DC2626",
            },
            {
                code: "COMP 1805",
                title: "Discrete Maths I",
                grade: "A",
                description:
                    "Introduction to discrete mathematics: propositional logic, predicate calculus, set theory, complexity of algorithms, proof techniques, recurrences, induction, finite automata and graph theory, illustrated through examples from computing.",
                accent: "#8B5CF6",
            },
            {
                code: "MATH 1007",
                title: "Calculus I",
                grade: "A+",
                description:
                    "Limits and differentiation of the elementary functions, applications such as max and min problems and curve sketching, and an introduction to integration up to the fundamental theorem of calculus.",
                accent: "#F59E0B",
            },
            {
                code: "MATH 1107",
                title: "Linear Algebra I",
                grade: "A+",
                description:
                    "Systems of linear equations, vector spaces, bases, matrix transformations, kernel and range, matrix algebra and determinants, complex numbers, eigenvalues, diagonalization and applications.",
                accent: "#F59E0B",
            },
            {
                code: "STAT 2507",
                title: "Stats & Modelling",
                language: "SAS",
                grade: "A+",
                description:
                    "A data driven introduction to statistics: descriptive statistics, probability, random variables and distributions, sampling distributions, the Central Limit Theorem, interval estimation and hypothesis testing, using a statistical software package.",
                accent: "#0EA5E9",
            },
        ],
    },
] as const
