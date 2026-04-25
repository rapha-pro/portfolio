import { Navbar } from "@/components/navbar"
import Hero from "@/components/hero"
import About from "@/components/about"
import { ProjectsSection } from "@/components/projects/projects-section"

/**
 * Purpose:
 *   Landing page. Mounts Navbar -> Hero -> About -> Projects -> Contact.
 *
 * Returns:
 *   The full <main> tree.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <Hero />

      <About />

      <ProjectsSection />

      <section
        id="contact"
        className="mx-auto min-h-[60vh] max-w-6xl px-6 py-24 pb-40"
      >
        <h2 className="text-3xl font-bold text-brand md:text-4xl">Contact</h2>
        <p className="mt-4 max-w-2xl text-muted">Coming soon.</p>
      </section>
    </main>
  )
}
