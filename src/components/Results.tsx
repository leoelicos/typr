import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { describeKind, type HistoryEntry } from '../lib/history.ts'
import { formatDuration, integer, oneDecimal } from '../lib/format.ts'
import { useCountUp } from '../lib/hooks.ts'
import { charName, keyForChar } from '../lib/keyboard.ts'
import { round } from '../lib/scoring.ts'
import { sessionStats, type SessionState } from '../lib/session.ts'
import { Icon } from './Icon.tsx'
import { Keyboard } from './Keyboard.tsx'
import { WpmChart } from './WpmChart.tsx'
import './Results.css'

export interface ResultsProps {
  state: SessionState
  /** Best previous result of the same kind (before this one was saved). */
  previousBest: HistoryEntry | undefined
  reducedMotion: boolean
  onNext: () => void
  onRepeat: () => void
}

function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          style={
            {
              '--i': i,
              '--x': `${((i * 37) % 100) - 50}vw`,
              '--r': `${(i * 73) % 360}deg`,
              '--d': `${(i % 7) * 60}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function Results({ state, previousBest, reducedMotion, onNext, onRepeat }: ResultsProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [copied, setCopied] = useState(false)
  const stats = sessionStats(state, state.endedAt ?? 0)
  const wpm = round(stats.wpm)
  const isBest = wpm > 0 && (!previousBest || stats.wpm > previousBest.wpm)
  const animatedWpm = useCountUp(wpm, reducedMotion)
  const kind = {
    mode: state.config.mode,
    amount: state.config.mode === 'time' ? state.config.duration : state.config.wordCount,
    source: state.config.source,
  }

  // Move focus to the results so keyboard and screen reader users land here.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  // Heat map: mistakes per physical key, normalised.
  const missed = Object.entries(state.missedKeys).toSorted((a, b) => b[1] - a[1])
  const maxMiss = missed[0]?.[1] ?? 0
  const heat: Record<string, number> = {}
  for (const [char, n] of missed) {
    const k = keyForChar(char)
    if (k) heat[k.code] = Math.max(heat[k.code] ?? 0, n / maxMiss)
  }

  const copy = async () => {
    const text = `typr · ${wpm} wpm · ${round(stats.accuracy)}% accuracy · ${describeKind(kind)}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const delta = previousBest ? stats.wpm - previousBest.wpm : null

  return (
    <section className="results" aria-labelledby="results-title">
      {isBest && previousBest && !reducedMotion ? <Confetti /> : null}
      <div className="results-head">
        <h2 id="results-title" ref={headingRef} tabIndex={-1}>
          Results
        </h2>
        <p className="results-kind">{describeKind(kind)}</p>
      </div>

      <div className="results-grid">
        <div className="result-hero card" data-spot>
          <p className="result-hero-label">Words per minute</p>
          <p className="result-hero-value">
            <span aria-hidden="true">{integer.format(Math.round(animatedWpm))}</span>
            <span className="sr-only">{wpm}</span>
          </p>
          {isBest ? (
            <p className="badge badge--best">
              <Icon name="trophy" width={16} height={16} />
              {previousBest ? 'New personal best' : 'First result. Your benchmark is set'}
            </p>
          ) : delta !== null ? (
            <p className="badge">
              {oneDecimal.format(Math.abs(delta))} wpm {delta >= 0 ? 'above' : 'below'} your best of{' '}
              {integer.format(round(previousBest?.wpm ?? 0))}
            </p>
          ) : null}
        </div>

        <dl className="result-stats">
          <div className="card">
            <dt>Accuracy</dt>
            <dd>{oneDecimal.format(round(stats.accuracy, 1))}%</dd>
          </div>
          <div className="card">
            <dt>Raw wpm</dt>
            <dd>{integer.format(round(stats.rawWpm))}</dd>
          </div>
          <div className="card">
            <dt>Consistency</dt>
            <dd>{integer.format(round(stats.consistency))}%</dd>
          </div>
          <div className="card">
            <dt>Time</dt>
            <dd>{formatDuration(stats.elapsedMs)}</dd>
          </div>
          <div className="card result-chars">
            <dt>Characters</dt>
            <dd>
              <span className="ok" title="Correct">
                {stats.chars.correct}
                <span className="sr-only"> correct</span>
              </span>
              <span aria-hidden="true">/</span>
              <span className="bad" title="Incorrect">
                {stats.chars.incorrect}
                <span className="sr-only"> incorrect</span>
              </span>
              {state.config.mode === 'words' ? (
                <>
                  <span aria-hidden="true">/</span>
                  <span title="Missed">
                    {stats.chars.missed}
                    <span className="sr-only"> missed</span>
                  </span>
                </>
              ) : null}
            </dd>
          </div>
          <div className="card">
            <dt>Keystrokes</dt>
            <dd>
              {state.keystrokes}
              <span className="dd-sub">
                <span className="sr-only">, </span>
                {state.errors} wrong
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="results-actions">
        <button type="button" className="button button--primary" onClick={onNext}>
          Next test <Icon name="arrow" />
        </button>
        <button type="button" className="button" onClick={onRepeat}>
          <Icon name="repeat" /> Repeat this text
        </button>
        <button type="button" className="button button--ghost" onClick={copy}>
          <Icon name="copy" /> {copied ? 'Copied' : 'Copy result'}
        </button>
        <output className="sr-only" aria-live="polite">
          {copied ? 'Result copied to clipboard' : ''}
        </output>
      </div>

      <div className="results-panels">
        <section className="card panel" aria-labelledby="speed-title">
          <h3 id="speed-title">Speed over time</h3>
          <WpmChart samples={state.samples} />
        </section>
        <section className="card panel" aria-labelledby="keys-title">
          <h3 id="keys-title">Mistakes by key</h3>
          {missed.length ? (
            <>
              <Keyboard heat={heat} className="keyboard--compact" />
              <p className="missed-list">
                Most missed:{' '}
                {missed.slice(0, 5).map(([char, n], i) => (
                  <span key={char}>
                    {i ? ', ' : ''}
                    <kbd>{char === ' ' ? 'space' : char}</kbd>
                    <span className="sr-only"> ({charName(char)})</span> ×{n}
                  </span>
                ))}
              </p>
            </>
          ) : (
            <p className="flawless">Flawless. Not a single wrong key.</p>
          )}
        </section>
      </div>
    </section>
  )
}
