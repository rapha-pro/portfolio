import { AnimatedGithub } from "@/components/ui/icons/animated-github"
import { AnimatedLinkedin } from "@/components/ui/icons/animated-linkedin"
import { AnimatedMail } from "@/components/ui/icons/animated-mail"
import type { AnimatedIconComponent } from "@/components/ui/social-icon-button"

/**
 * Social / contact link descriptor.
 *
 * `icon` is an *animated* SVG component (not a plain lucide icon) because
 * lucide-react in this project doesn't ship GitHub/LinkedIn marks, and
 * because hand-rolling them lets us add micro-interactions on hover.
 */
export type Social = {
  icon: AnimatedIconComponent
  href: string
  label: string
}

/**
 * Edit once; consumed by the hero ActionBar, contact section, footer.
 * Replace the placeholder hrefs with real profile URLs.
 */
export const SOCIALS: readonly Social[] = [
  {
    icon: AnimatedMail,
    href: "mailto:nathonana01@gmail.com",
    label: "Email",
  },
  {
    icon: AnimatedGithub,
    href: "https://github.com/nathonana",
    label: "GitHub",
  },
  {
    icon: AnimatedLinkedin,
    href: "https://www.linkedin.com/in/rapha%C3%ABl-onana/",
    label: "LinkedIn",
  },
] as const
