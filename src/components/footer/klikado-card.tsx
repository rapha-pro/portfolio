"use client"

/**
 * Purpose:
 *   Clickable footer card linking to Klikado, my 4 in 1 toolkit: text
 *   formatter, video downloader, link shortener, and QR codes.
 *
 * Args: none
 *
 * Returns:
 *   An anchor card styled to match the footer card system.
 */
export function KlikadoCard() {
    return (
        <a
            href="https://klikado.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-[190px] flex-col gap-1.5 rounded-xl border border-app bg-[var(--glass)] p-3 backdrop-blur-sm transition-all hover:border-[color:var(--accent)]"
        >
            <span className="flex items-center gap-1.5">
                {/* Klikado mark: brand colours, not theme colours */}
                <svg width={20} height={20} viewBox="0 0 40 40" aria-hidden className="shrink-0">
                    <rect x="3" y="3" width="16" height="16" rx="5" fill="#4F46E5" />
                    <rect x="21" y="3" width="16" height="16" rx="5" fill="#FB7185" />
                    <rect x="3" y="21" width="16" height="16" rx="5" fill="#FB7185" />
                    <rect x="21" y="21" width="16" height="16" rx="5" fill="#4F46E5" />
                </svg>
                <span className="text-xs font-semibold text-brand transition-colors group-hover:text-accent">
                    Klikado
                </span>
                <svg
                    width={10}
                    height={10}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-auto opacity-40 transition-opacity group-hover:opacity-100"
                    aria-hidden
                >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
            </span>
            <span className="text-[11px] leading-snug text-subtle">
                Format text, download videos, shorten links, make QR codes.
            </span>
        </a>
    )
}
