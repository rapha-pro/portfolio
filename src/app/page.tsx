import { Navbar } from "@/components/navbar"
import Hero from "@/components/hero"

/**
 * Purpose:
 *   Landing page. Mounts the navbar + hero; the remaining sections are
 *   placeholders so anchor links and scroll-spy have real scroll targets.
 *
 * Returns:
 *   The full <main> tree.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <Hero />

      <section
        id="about"
        className="mx-auto min-h-[60vh] max-w-6xl px-6 py-24"
      >
        <h2 className="text-3xl font-bold text-brand md:text-4xl">About</h2>
        <p className="mt-4 max-w-2xl text-muted">Coming soon.</p>
      </section>

      <section
        id="projects"
        className="mx-auto min-h-[60vh] max-w-6xl px-6 py-24"
      >
        <h2 className="text-3xl font-bold text-brand md:text-4xl">Projects</h2>
        <p className="mt-4 max-w-2xl text-muted">Coming soon.</p>
      </section>

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
