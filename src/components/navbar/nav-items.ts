import {
  Home as HomeIcon,
  User as UserIcon,
  Briefcase as BriefcaseIcon,
  Mail as MailIcon,
  type LucideIcon,
} from "lucide-react"

/** A single nav destination. */
export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

/**
 * Single source of truth for navbar routes. Order = render order.
 * Edit here once; both desktop + mobile navbars pick it up.
 */
export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { href: "#home",     label: "Home",     icon: HomeIcon },
  { href: "#about",    label: "About",    icon: UserIcon },
  { href: "#projects", label: "Projects", icon: BriefcaseIcon },
  { href: "#contact",  label: "Contact",  icon: MailIcon },
]
