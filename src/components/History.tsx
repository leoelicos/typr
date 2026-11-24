import { useRef } from 'react'
import { clearHistory, describeKind, summarize, type HistoryEntry } from '../lib/history.ts'
import { formatDate, integer, oneDecimal } from '../lib/format.ts'
import { round } from '../lib/scoring.ts'
import { Icon } from './Icon.tsx'
import './History.css'

function Sparkline({ values }: { values: readonly number[] }) {
  if (values.length < 2) return null
  const w = 240
  const h = 56
  const max = Math.max(...values, 1)
  const min = Math.min(...values)
  const span = Math.max(1, max - min)
  const pts = values.map(
    (v, i) =>
      `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 4 - ((v - min) / span) * (h - 8)).toFixed(1)}`,
  )
  return (
    <svg
      className="sparkline"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline points={pts.join(' ')} pathLength={1} />
    </svg>
  )
}

export function History({ history }: { history: readonly HistoryEntry[] }) {
  const confirmRef = useRef<HTMLDialogElement>(null)
  const summary = summarize(history)
  const recent = history.slice(0, 15)
  const trendValues = history
    .slice(0, 30)
    .map((e) => e.wpm)
    .toReversed()

  return (
    <section className="history wrap" id="history" aria-labelledby="history-title">
      <div className="section-head">
        <p className="eyebrow">Your progress</p>
        <h2 id="history-title">History</h2>
        <p className="section-sub">Saved privately in this browser. Nothing leaves your device.</p>
      </div>

      {history.length === 0 ? (
        <div className="card history-empty">
          <p>No tests yet. Finish one and your results will appear here with your trend.</p>
        </div>
      ) : (
        <>
          <dl className="history-summary">
            <div className="card">
              <dt>Tests</dt>
              <dd>{integer.format(summary.tests)}</dd>
            </div>
            <div className="card">
              <dt>Best wpm</dt>
              <dd>{integer.format(round(summary.bestWpm))}</dd>
            </div>
            <div className="card">
              <dt>Avg wpm (last 10)</dt>
              <dd>{integer.format(round(summary.averageWpm))}</dd>
            </div>
            <div className="card">
              <dt>Avg accuracy (last 10)</dt>
              <dd>{oneDecimal.format(round(summary.averageAccuracy, 1))}%</dd>
            </div>
            <div className="card history-trend">
              <dt>Trend</dt>
              <dd>
                {summary.trend === null ? (
                  <span className="dd-sub">Needs 13+ tests</span>
                ) : (
                  <span data-direction={summary.trend >= 0 ? 'up' : 'down'}>
                    {summary.trend >= 0 ? '▲' : '▼'} {oneDecimal.format(Math.abs(summary.trend))}{' '}
                    wpm
                    <span className="sr-only">
                      {summary.trend >= 0 ? ' faster' : ' slower'} than your previous 10 tests
                    </span>
                  </span>
                )}
                <Sparkline values={trendValues} />
              </dd>
            </div>
          </dl>

          <div className="card table-card">
            {/* Focusable so keyboard users can scroll the table on narrow screens. */}
            {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
            <section className="table-scroll" tabIndex={0} aria-labelledby="history-caption">
              <table className="history-table">
                <caption id="history-caption">
                  Last {recent.length} test{recent.length === 1 ? '' : 's'}, newest first
                </caption>
                <thead>
                  <tr>
                    <th scope="col">When</th>
                    <th scope="col">Test</th>
                    <th scope="col" className="num">
                      wpm
                    </th>
                    <th scope="col" className="num">
                      Raw
                    </th>
                    <th scope="col" className="num">
                      Accuracy
                    </th>
                    <th scope="col" className="num">
                      Consistency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((e) => (
                    <tr key={e.id}>
                      <th scope="row">
                        <time dateTime={e.date}>{formatDate(e.date)}</time>
                      </th>
                      <td>{describeKind(e)}</td>
                      <td className="num strong">{integer.format(round(e.wpm))}</td>
                      <td className="num">{integer.format(round(e.rawWpm))}</td>
                      <td className="num">{oneDecimal.format(round(e.accuracy, 1))}%</td>
                      <td className="num">{integer.format(round(e.consistency))}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          <button
            type="button"
            className="button button--ghost button--danger"
            onClick={() => confirmRef.current?.showModal()}
          >
            <Icon name="trash" /> Clear history
          </button>

          <dialog
            ref={confirmRef}
            className="dialog dialog--confirm"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
          >
            <form method="dialog">
              <h2 id="confirm-title">Clear all history?</h2>
              <p id="confirm-desc">
                This permanently deletes {summary.tests} saved result
                {summary.tests === 1 ? '' : 's'} from this browser.
              </p>
              <div className="dialog-actions">
                <button type="submit" className="button" value="cancel" autoFocus>
                  Keep history
                </button>
                <button
                  type="submit"
                  className="button button--danger-solid"
                  value="clear"
                  onClick={() => clearHistory()}
                >
                  Delete everything
                </button>
              </div>
            </form>
          </dialog>
        </>
      )}
    </section>
  )
}
