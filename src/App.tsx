import { useEffect, useRef } from 'react'
import { Announcer } from './components/Announcer.tsx'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { History } from './components/History.tsx'
import { Keyboard } from './components/Keyboard.tsx'
import { Results } from './components/Results.tsx'
import { SettingsDialog } from './components/SettingsDialog.tsx'
import { TestConfigBar } from './components/TestConfigBar.tsx'
import { TypingTest } from './components/TypingTest.tsx'
import { addHistory, historyStore, personalBest, type HistoryEntry } from './lib/history.ts'
import { useAppearance, usePressedKeys, useSpotlight, useTypingSession } from './lib/hooks.ts'
import { keyForChar } from './lib/keyboard.ts'
import { round } from './lib/scoring.ts'
import { sessionStats, type SessionState } from './lib/session.ts'
import { settingsStore, updateSettings, updateTest } from './lib/settings.ts'
import { useStore } from './lib/store.ts'

/** Seconds-left marks announced to screen readers (smallest first). */
const TIME_MARKS = [5, 10, 30]

function resultId(state: SessionState): string {
  return `${state.seed.toString(36)}-${Math.round(state.startedAt ?? 0).toString(36)}`
}

function toEntry(state: SessionState): HistoryEntry {
  const stats = sessionStats(state, state.endedAt ?? 0)
  return {
    id: resultId(state),
    date: new Date().toISOString(),
    mode: state.config.mode,
    amount: state.config.mode === 'time' ? state.config.duration : state.config.wordCount,
    source: state.config.source,
    wpm: stats.wpm,
    rawWpm: stats.rawWpm,
    accuracy: stats.accuracy,
    consistency: stats.consistency,
    elapsedMs: stats.elapsedMs,
  }
}

export default function App() {
  const settings = useStore(settingsStore)
  const history = useStore(historyStore)
  const { theme, reducedMotion } = useAppearance(settings)
  const { state, now, input, restart } = useTypingSession(settings.test)
  const { pressed, capsLock } = usePressedKeys()
  useSpotlight()
  const inputRef = useRef<HTMLInputElement>(null)
  const settingsRef = useRef<HTMLDialogElement>(null)

  const finished = state.phase === 'finished'
  const currentId = finished ? resultId(state) : null
  const kind = {
    mode: state.config.mode,
    amount: state.config.mode === 'time' ? state.config.duration : state.config.wordCount,
    source: state.config.source,
  }
  const previousBest = personalBest(
    history.filter((e) => e.id !== currentId),
    kind,
  )

  const focusInput = () =>
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }))

  // Land in the typing box on first load: it is the whole point of the page.
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [])

  // Save each finished test exactly once (localStorage is the external system here).
  const savedRef = useRef<string | null>(null)
  useEffect(() => {
    if (state.phase !== 'finished' || state.keystrokes === 0) return
    const id = resultId(state)
    if (savedRef.current === id) return
    savedRef.current = id
    addHistory(toEntry(state))
  }, [state])

  // Screen reader announcements are derived from state, so each changes exactly once:
  // sparse time warnings while typing, then a one-line result summary.
  let announcement: { text: string; id: number } | null = null
  if (finished && state.keystrokes > 0) {
    const stats = sessionStats(state, state.endedAt ?? 0)
    const isBest = !!previousBest && stats.wpm > previousBest.wpm
    announcement = {
      id: state.seed,
      text:
        `Test complete. ${round(stats.wpm)} words per minute, ${round(stats.accuracy)} percent accuracy.` +
        (isBest ? ' New personal best!' : ''),
    }
  } else if (settings.announceTime && state.phase === 'running' && state.startedAt !== null) {
    if (state.config.mode === 'time') {
      const left = Math.ceil((state.config.duration * 1000 - (now - state.startedAt)) / 1000)
      const mark = TIME_MARKS.find((m) => left <= m && left > m - 5 && m < state.config.duration)
      if (mark !== undefined) announcement = { id: mark, text: `${mark} seconds left` }
    }
  }

  // Any printable key while nothing is focused jumps into the typing box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('dialog[open]')) return
      const active = document.activeElement
      const idle = !active || active === document.body
      if (state.phase === 'finished' && e.key === 'Escape' && idle) {
        restart()
        requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }))
        return
      }
      if (!idle || state.phase === 'finished') return
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, restart])

  const nextChar = state.target[state.typed.length]
  const next =
    settings.highlightNextKey && !finished && nextChar !== undefined
      ? keyForChar(nextChar)
      : undefined

  return (
    <>
      <a className="skip-link" href="#typing-input">
        Skip to typing test
      </a>
      <Header
        theme={theme}
        onToggleTheme={() => updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' })}
        onOpenSettings={() => settingsRef.current?.showModal()}
      />
      <main id="main" tabIndex={-1}>
        <section className="practice wrap" id="practice" aria-labelledby="practice-title">
          <div className="hero">
            <p className="eyebrow">Typing trainer</p>
            <h1 id="practice-title">
              Find your <span className="hero-accent">flow</span>.
            </h1>
          </div>

          <TestConfigBar
            config={settings.test}
            onChange={(patch) => {
              updateTest(patch)
            }}
          />

          <div className="stage">
            {finished ? (
              <Results
                key={currentId}
                state={state}
                previousBest={previousBest}
                reducedMotion={reducedMotion}
                onNext={() => {
                  restart()
                  focusInput()
                }}
                onRepeat={() => {
                  restart({ sameText: true })
                  focusInput()
                }}
              />
            ) : (
              <TypingTest
                state={state}
                now={now}
                caret={settings.caret}
                inputRef={inputRef}
                onInput={input}
                onRestart={() => {
                  restart()
                  focusInput()
                }}
              />
            )}
          </div>

          {settings.showKeyboard && !finished ? (
            <Keyboard
              pressed={pressed}
              capsLock={capsLock}
              next={next}
              fingerColours={settings.fingerColours}
            />
          ) : null}
        </section>

        <History history={history} />
      </main>
      <Footer />
      <SettingsDialog ref={settingsRef} settings={settings} />
      <Announcer message={announcement} />
    </>
  )
}
