/**
 * Purpose:
 *   A small line drawn sword, set after the Hebrews line in the prayer and
 *   at the very end of the story. Sized in em, so it follows whatever text
 *   it sits beside.
 *
 * Returns:
 *   The icon.
 */
export function SwordIcon() {
    return (
        <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-[1.05em] w-[1.05em] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.8 3.2 12 12" />
            <path d="M9.4 11.4 13.6 15.6" />
            <path d="M12 12 9 15" />
            <circle cx="7.6" cy="16.4" r="1.5" />
        </svg>
    )
}
