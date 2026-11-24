import { useId } from 'react'
import { integer } from '../lib/format.ts'
import { round } from '../lib/scoring.ts'
import type { Sample } from '../lib/session.ts'
import './WpmChart.css'

const W = 640
const H = 220
const PAD = { top: 16, right: 16, bottom: 28, left: 40 }

function niceMax(v: number): number {
  if (v <= 0) return 20
  const step = v > 150 ? 50 : v > 60 ? 20 : 10
  return Math.ceil((v * 1.1) / step) * step
}

/** Speed over time: net WPM (accent), per-second raw (muted) and mistakes (red crosses). */
export function WpmChart({ samples }: { samples: readonly Sample[] }) {
  const id = useId()
  if (samples.length < 2) {
    return <p className="chart-empty">Type for at least two seconds to see your speed graph.</p>
  }

  const maxY = niceMax(Math.max(...samples.map((s) => Math.max(s.wpm, s.raw))))
  const maxX = samples.length
  const x = (sec: number) =>
    PAD.left + ((sec - 1) / Math.max(1, maxX - 1)) * (W - PAD.left - PAD.right)
  const y = (v: number) => PAD.top + (1 - v / maxY) * (H - PAD.top - PAD.bottom)
  const line = (key: 'wpm' | 'raw') =>
    samples
      .map((s, i) => `${i ? 'L' : 'M'}${x(s.second).toFixed(1)},${y(s[key]).toFixed(1)}`)
      .join('')
  const area = `${line('wpm')}L${x(maxX).toFixed(1)},${y(0)}L${x(1).toFixed(1)},${y(0)}Z`
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxY * t))
  const xEvery = Math.max(1, Math.ceil(maxX / 8))
  const peak = samples.reduce((m, s) => Math.max(m, s.wpm), 0)
  const errorSeconds = samples.filter((s) => s.errors > 0).length

  return (
    <figure className="chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby={`${id}-t ${id}-d`}
        preserveAspectRatio="none"
      >
        <title id={`${id}-t`}>Words per minute over time</title>
        <desc id={`${id}-d`}>
          {`${samples.length} seconds. Net speed peaked at ${integer.format(round(peak))} words per minute. Mistakes in ${errorSeconds} of those seconds.`}
        </desc>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t} className="chart-grid">
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
            <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end">
              {t}
            </text>
          </g>
        ))}
        {samples
          .filter((s) => s.second % xEvery === 0 || s.second === 1)
          .map((s) => (
            <text key={s.second} className="chart-x" x={x(s.second)} y={H - 8} textAnchor="middle">
              {s.second}s
            </text>
          ))}
        <path className="chart-area" d={area} fill={`url(#${id}-fill)`} />
        <path className="chart-line chart-line--raw" d={line('raw')} pathLength={1} />
        <path className="chart-line chart-line--wpm" d={line('wpm')} pathLength={1} />
        {samples
          .filter((s) => s.errors > 0)
          .map((s) => (
            <g
              key={s.second}
              className="chart-error"
              transform={`translate(${x(s.second)},${y(Math.max(s.raw, s.wpm)) - 10})`}
            >
              <path d="M-3.5,-3.5L3.5,3.5M3.5,-3.5L-3.5,3.5" />
            </g>
          ))}
      </svg>
      <figcaption className="chart-legend">
        <span className="legend-item legend-item--wpm">Net wpm</span>
        <span className="legend-item legend-item--raw">Raw wpm (per second)</span>
        <span className="legend-item legend-item--error">Mistakes</span>
      </figcaption>
      <details className="chart-data">
        <summary>Show data table</summary>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">Speed and mistakes for each second</caption>
            <thead>
              <tr>
                <th scope="col">Second</th>
                <th scope="col">Net wpm</th>
                <th scope="col">Raw wpm</th>
                <th scope="col">Mistakes</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((s) => (
                <tr key={s.second}>
                  <th scope="row">{s.second}</th>
                  <td>{integer.format(round(s.wpm))}</td>
                  <td>{integer.format(round(s.raw))}</td>
                  <td>{s.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
