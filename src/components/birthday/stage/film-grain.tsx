/**
 * Purpose:
 *   Full-screen film grain and vignette laid over everything. The grain
 *   moves by transform only, so it costs no repaints.
 *
 * Returns:
 *   Two decorative, non-interactive layers.
 */
export function FilmGrain() {
    return (
        <>
            <div aria-hidden className="bd-vignette pointer-events-none absolute inset-0 z-40" />
            <div aria-hidden className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
                <div className="bd-grain" />
            </div>
        </>
    )
}
