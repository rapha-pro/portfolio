import { Mail, type LucideIcon } from "lucide-react"

/**
 * Social / contact link descriptor.
 */
export type Social = {
  icon: LucideIcon
  href: string
  label: string
}

/**
 * Edit once; consumed by hero action bar, footer, contact section.
 * Items with href="#" are hidden by default (stub entries).
 */
export const SOCIALS: readonly Social[] = [
  { icon: Mail,     href: "#contact", label: "Email"    },
  // { icon: Github,   href: "#",        label: "GitHub"   },
  // { icon: Linkedin, href: "#",        label: "LinkedIn" },
] as const
