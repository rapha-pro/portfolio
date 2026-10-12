import type { ReactNode } from "react"

/**
 * Purpose:
 *   Block of write-up text for a project detail page, with an optional heading.
 *
 * Args:
 *   - title : heading shown above the block; omit for an untitled intro
 *   - children : paragraphs, lists, or tables
 *
 * Returns:
 *   An optional heading followed by a vertically spaced body in muted body text.
 */
export function ReportSection({ title, children }: { title?: string; children: ReactNode }) {
    return (
        <div>
            {title && <h2 className="mb-3 text-lg font-semibold text-brand">{title}</h2>}
            <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-muted">
                {children}
            </div>
        </div>
    )
}

/**
 * Purpose:
 *   A results table reproduced from a report, with a caption above and an
 *   optional note below. One row can be highlighted as the chosen result.
 *
 * Args:
 *   - caption : table title, e.g. "Table 2: Test accuracies"
 *   - headers : column labels
 *   - rows : cell strings, one array per row
 *   - highlightRow : index of the row to highlight
 *   - note : short takeaway shown under the table
 *
 * Returns:
 *   A horizontally scrollable bordered table.
 */
export function ReportTable({
    caption,
    headers,
    rows,
    highlightRow,
    note,
}: {
    caption: string
    headers: string[]
    rows: string[][]
    highlightRow?: number
    note?: string
}) {
    return (
        <div>
            <p className="mb-3 text-sm font-semibold text-brand">{caption}</p>
            <div className="w-full overflow-x-auto rounded-xl border border-app">
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr className="border-b border-app bg-[var(--glass)]">
                            {headers.map((h) => (
                                <th
                                    key={h}
                                    className="whitespace-nowrap px-4 py-3 text-left font-semibold text-brand"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr
                                key={i}
                                className={[
                                    "border-b border-app last:border-0",
                                    highlightRow === i
                                        ? "bg-[color:var(--accent-soft)] font-medium text-brand"
                                        : "text-muted",
                                ].join(" ")}
                            >
                                {row.map((cell, j) => (
                                    <td key={j} className="whitespace-nowrap px-4 py-2.5 font-mono">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {note && <p className="mt-3 text-[13px] text-muted">{note}</p>}
        </div>
    )
}

/**
 * Purpose:
 *   Accuracy grid where each cell is tinted by its value, so the best region
 *   of a hyperparameter search stands out at a glance.
 *
 * Args:
 *   - caption : title shown above the grid
 *   - rowLabel : name of the row parameter, shown in the corner cell
 *   - rows : row labels
 *   - cols : column labels
 *   - values : accuracy in [0, 1], values[row][col]
 *   - best : [row, col] of the cell to outline as the chosen setting
 *   - note : short takeaway shown under the grid
 *
 * Returns:
 *   A scrollable table whose cell backgrounds mix the accent colour by value.
 */
export function AccuracyHeatmap({
    caption,
    rowLabel,
    rows,
    cols,
    values,
    best,
    note,
}: {
    caption: string
    rowLabel: string
    rows: string[]
    cols: string[]
    values: number[][]
    best?: [number, number]
    note?: string
}) {
    const flat = values.flat()
    const min = Math.min(...flat)
    const max = Math.max(...flat)

    return (
        <div>
            <p className="mb-3 text-sm font-semibold text-brand">{caption}</p>
            <div className="w-full overflow-x-auto rounded-xl border border-app">
                <table className="w-full border-collapse text-[13px]">
                    <thead>
                        <tr className="border-b border-app bg-[var(--glass)]">
                            <th className="px-3 py-3 text-left font-semibold text-brand">
                                {rowLabel}
                            </th>
                            {cols.map((c) => (
                                <th
                                    key={c}
                                    className="whitespace-nowrap px-3 py-3 text-center font-semibold text-brand"
                                >
                                    {c}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {values.map((row, i) => (
                            <tr key={rows[i]} className="border-b border-app last:border-0">
                                <td className="px-3 py-2.5 font-mono text-muted">{rows[i]}</td>
                                {row.map((v, j) => {
                                    const strength = max === min ? 1 : (v - min) / (max - min)
                                    const isBest = best?.[0] === i && best?.[1] === j
                                    return (
                                        <td
                                            key={j}
                                            className="px-3 py-2.5 text-center font-mono text-brand"
                                            style={{
                                                background: `color-mix(in srgb, var(--accent) ${Math.round(
                                                    strength * 55
                                                )}%, transparent)`,
                                                outline: isBest
                                                    ? "2px solid var(--accent)"
                                                    : undefined,
                                                outlineOffset: isBest ? "-2px" : undefined,
                                                fontWeight: isBest ? 700 : undefined,
                                            }}
                                        >
                                            {v.toFixed(3)}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {note && <p className="mt-3 text-[13px] text-muted">{note}</p>}
        </div>
    )
}

/**
 * Purpose:
 *   Small line chart for a sequence of measured values, with one point
 *   marked as the chosen value (e.g. the elbow of a k-means curve).
 *
 * Args:
 *   - caption : title shown above the chart
 *   - xLabel : axis label for x
 *   - yLabel : axis label for y
 *   - points : [x, y] pairs in order
 *   - marked : x value of the point to highlight
 *   - note : short takeaway shown under the chart
 *
 * Returns:
 *   A responsive inline SVG drawn with theme colours.
 */
export function ReportLineChart({
    caption,
    xLabel,
    yLabel,
    points,
    marked,
    note,
}: {
    caption: string
    xLabel: string
    yLabel: string
    points: [number, number][]
    marked?: number
    note?: string
}) {
    const W = 640
    const H = 300
    const pad = { l: 56, r: 20, t: 20, b: 48 }
    const xs = points.map((p) => p[0])
    const ys = points.map((p) => p[1])
    const xMin = Math.min(...xs)
    const xMax = Math.max(...xs)
    const yMax = Math.ceil(Math.max(...ys) * 2) / 2
    const sx = (x: number) => pad.l + ((x - xMin) / (xMax - xMin)) * (W - pad.l - pad.r)
    const sy = (y: number) => pad.t + (1 - y / yMax) * (H - pad.t - pad.b)
    const path = points.map(([x, y], i) => `${i ? "L" : "M"}${sx(x)},${sy(y)}`).join(" ")
    const ticks = Array.from({ length: 5 }, (_, i) => (yMax / 4) * i)

    return (
        <div>
            <p className="mb-3 text-sm font-semibold text-brand">{caption}</p>
            <div className="rounded-xl border border-app bg-[var(--glass)] p-3">
                <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="h-auto w-full"
                    role="img"
                    aria-label={caption}
                >
                    {ticks.map((t) => (
                        <g key={t}>
                            <line
                                x1={pad.l}
                                x2={W - pad.r}
                                y1={sy(t)}
                                y2={sy(t)}
                                stroke="var(--glass-border)"
                                strokeWidth={1}
                            />
                            <text
                                x={pad.l - 10}
                                y={sy(t) + 4}
                                textAnchor="end"
                                fontSize={12}
                                fill="var(--fg-subtle)"
                            >
                                {t.toFixed(1)}
                            </text>
                        </g>
                    ))}
                    {points.map(([x]) => (
                        <text
                            key={x}
                            x={sx(x)}
                            y={H - pad.b + 20}
                            textAnchor="middle"
                            fontSize={12}
                            fill="var(--fg-subtle)"
                        >
                            {x}
                        </text>
                    ))}
                    <text
                        x={(pad.l + W - pad.r) / 2}
                        y={H - 6}
                        textAnchor="middle"
                        fontSize={12}
                        fill="var(--fg-muted)"
                    >
                        {xLabel}
                    </text>
                    <text
                        x={14}
                        y={(pad.t + H - pad.b) / 2}
                        textAnchor="middle"
                        fontSize={12}
                        fill="var(--fg-muted)"
                        transform={`rotate(-90 14 ${(pad.t + H - pad.b) / 2})`}
                    >
                        {yLabel}
                    </text>
                    <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2.5} />
                    {points.map(([x, y]) => {
                        const isMarked = x === marked
                        return (
                            <circle
                                key={x}
                                cx={sx(x)}
                                cy={sy(y)}
                                r={isMarked ? 7 : 4}
                                fill={isMarked ? "var(--accent)" : "var(--bg)"}
                                stroke="var(--accent)"
                                strokeWidth={2}
                            />
                        )
                    })}
                </svg>
            </div>
            {note && <p className="mt-3 text-[13px] text-muted">{note}</p>}
        </div>
    )
}
