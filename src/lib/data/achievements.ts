/**
 * Achievements & activities data.
 *
 * Two small collections rendered side-by-side inside the Achievements tab.
 * Each entry is self-contained; add or remove one by editing the array.
 */

export type Award = {
  title: string
  /** Organisation or institution that granted the award. */
  organization: string
  /** Free-text period ("2022 – Present", "2024"). */
  period: string
  /** Optional one-line description. */
  description?: string
}

export type Activity = {
  title: string
  organization: string
  period: string
  description: string
}

/** Awards / recognitions — most recent first. */
export const AWARDS: readonly Award[] = [
  {
    title: "Dean's Honour List",
    organization: "Carleton University",
    period: "2022 – Present",
    description:
      "Granted every term for maintaining academic excellence — minimum 10/12 GPA over a full study load.",
  },
  {
    title: "Member · Golden Key Honour Society",
    organization: "Carleton University",
    period: "2023 – Present",
    description:
      "The Golden Key invites the top 15% of students in each academic stream into its international honour society.",
  },
] as const

/** Community / mentorship / volunteering. */
export const ACTIVITIES: readonly Activity[] = [
  {
    title: "Volunteer Software-Project Mentor",
    organization: "Merivale High School",
    period: "2023",
    description:
      "Mentored a group of Grade 12 students through their capstone software project — guided them through Django, helped structure their web app, and shared tips on how to debug without rage-quitting.",
  },
] as const
