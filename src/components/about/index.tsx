"use client"

import { motion } from "framer-motion"

import { NarrativeTimeline } from "./narrative-timeline"
import {
  IconBriefcase,
  IconGrad,
  IconSparkles,
  IconTrophy,
  TabSwitcher,
  type TabDef,
} from "./tab-switcher"
import { ExperienceTab } from "./experience-tab"
import { EducationTab } from "./education-tab"
import { AchievementsTab } from "./achievements-tab"
import { HobbiesTab } from "./hobbies-tab"

/**
 * Purpose:
 *   The About section. Owns the <section id="about"> landmark, the two
 *   sub-sections — narrative story (zig-zag timeline) and
 *   Experience/Education/Achievements/Hobbies tabs — and the heading block
 *   between them.
 *
 * Returns:
 *   The full <section id="about">.
 */
export default function About() {
  const tabs: readonly TabDef[] = [
    {
      key: "experience",
      label: "Experience",
      icon: <IconBriefcase />,
      content: <ExperienceTab />,
    },
    {
      key: "education",
      label: "Education",
      icon: <IconGrad />,
      content: <EducationTab />,
    },
    {
      key: "achievements",
      label: "Achievements",
      icon: <IconTrophy />,
      content: <AchievementsTab />,
    },
    {
      key: "hobbies",
      label: "Hobbies",
      icon: <IconSparkles />,
      content: <HobbiesTab />,
    },
  ] as const

  return (
    <section
      id="about"
      className="relative w-full px-4 py-24 md:px-8 lg:px-16"
    >
      {/* Section heading */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20% 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-16 flex max-w-3xl flex-col items-center text-center"
      >
        <p className="mb-3 text-[11px] font-mono uppercase tracking-[0.22em] text-accent">
          About me
        </p>
        <h2 className="text-3xl font-bold text-brand md:text-5xl">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--accent), #6d28d9)",
            }}
          >
            From pilot dreams
          </span>{" "}
          to production pipelines.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          A short story of how I got here — and where the curiosity is
          pointing next.
        </p>
      </motion.header>

      {/* Narrative — zig-zag timeline */}
      <NarrativeTimeline className="mb-24" />

      {/* Tabbed arc: Experience / Education / Achievements / Hobbies */}
      <TabSwitcher tabs={tabs} defaultTab="experience" />
    </section>
  )
}
