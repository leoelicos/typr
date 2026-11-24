import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type Ref,
  type SyntheticEvent,
} from 'react'
import { formatDuration, integer } from '../lib/format.ts'
import { charName } from '../lib/keyboard.ts'
import { round } from '../lib/scoring.ts'
import { completedWords, sessionStats, type SessionState } from '../lib/session.ts'
import type { CaretStyle } from '../lib/settings.ts'
import { Icon } from './Icon.tsx'
import './TypingTest.css'

interface WordProps {
  word: string
  start: number
  /** The slice of typed text covering this word and its trailing space. */
  typed: string
  hasSpace: boolean
  active: boolean
}

/** One word of the prompt. Memoised so a keystroke only re-renders the active word. */
const Word = memo(function Word({ word, start, typed, hasSpace, active }: WordProps) {
  const chars = hasSpace ? `${word} ` : word
  return (
    <span className="word" data-active={active || undefined}>
      {Array.from(chars, (ch, i) => {
        const t = typed[i]
        const state = t === undefined ? 'pending' : t === ch ? 'correct' : 'incorrect'
        return (
          <span
            key={i}
            className="char"
            data-index={start + i}
            data-state={state}
            data-space={ch === ' ' || undefined}
          >
            {ch}
          </span>
        )
      })}
    </span>
  )
})

export interface TypingTestProps {
  state: SessionState
  now: number
  caret: CaretStyle
  inputRef: Ref<HTMLInputElement>
  onInput: (value: string) => void
  onRestart: () => void
}

export function TypingTest({ state, now, caret, inputRef, onInput, onRestart }: TypingTestProps) {
  const { target, typed, phase, config } = state
  const textRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)
  const [focused, setFocused] = useState(false)

  // Split once per target; keep each word's absolute start index.
  const words: { word: string; start: number }[] = []
  {
    let start = 0
    for (const word of target.split(' ')) {
      words.push({ word, start })
      start += word.length + 1
    }
  }

  // Position the caret on the next character and scroll so it sits on line 2.
  const measureRef = useRef<() => void>(() => {})
  useLayoutEffect(() => {
    const measure = () => {
      const text = textRef.current
      const caretEl = caretRef.current
      if (!text || !caretEl) return
      const index = Math.min(typed.length, target.length - 1)
      const el = text.querySelector<HTMLElement>(`[data-index="${index}"]`)
      if (!el) return
      const atEnd = typed.length >= target.length
      // Snap to line boxes: an inline span's own box is shorter than the line-height.
      const lineHeight = parseFloat(getComputedStyle(text).lineHeight) || el.offsetHeight
      const line = Math.round((el.offsetTop + el.offsetHeight / 2 - lineHeight / 2) / lineHeight)
      const x = el.offsetLeft + (atEnd ? el.offsetWidth : 0)
      caretEl.style.setProperty('--x', `${x}px`)
      caretEl.style.setProperty('--y', `${line * lineHeight}px`)
      caretEl.style.setProperty('--w', `${el.offsetWidth}px`)
      caretEl.style.setProperty('--h', `${lineHeight}px`)
      // Keep the active line second from the top once past the first line.
      const offset = Math.max(0, line - 1) * lineHeight
      text.style.transform = `translateY(${-offset}px)`
    }
    measureRef.current = measure
    measure()
  }, [typed.length, target])

  // Re-measure when line wrapping changes (resize, font size setting).
  useEffect(() => {
    const text = textRef.current
    if (!text || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measureRef.current())
    ro.observe(text)
    return () => ro.disconnect()
  }, [])

  const stats = sessionStats(state, now)
  const elapsed = stats.elapsedMs
  const remaining = Math.max(0, config.duration * 1000 - elapsed)
  const totalWords = words.length
  const done = completedWords(state)
  const progress =
    config.mode === 'time'
      ? Math.min(1, elapsed / (config.duration * 1000))
      : Math.min(1, typed.length / target.length)

  const nextChar = target[typed.length]
  const upcoming = target.slice(typed.length).split(' ').slice(0, 6).join(' ')
  const hasError = typed.length > 0 && typed[typed.length - 1] !== target[typed.length - 1]

  const onChange = (e: ChangeEvent<HTMLInputElement>) => onInput(e.currentTarget.value)

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onRestart()
      return
    }
    // Keep the insertion point at the end: the prompt is typed strictly in order.
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault()
    }
  }

  const keepCaretAtEnd = (e: SyntheticEvent<HTMLInputElement>) => {
    const el = e.currentTarget
    const end = el.value.length
    if (el.selectionStart !== end || el.selectionEnd !== end) el.setSelectionRange(end, end)
  }

  return (
    <div className="typing" data-phase={phase}>
      <div className="typing-top">
        <dl className="live-stats">
          <div className="live-stat live-stat--primary">
            <dt className="live-stat-label">{config.mode === 'time' ? 'Time left' : 'Words'}</dt>
            <dd className="live-stat-value">
              {config.mode === 'time'
                ? formatDuration(
                    phase === 'idle' ? config.duration * 1000 : Math.ceil(remaining / 1000) * 1000,
                  )
                : `${done}/${totalWords}`}
            </dd>
          </div>
          <div className="live-stat">
            <dt className="live-stat-label">wpm</dt>
            <dd className="live-stat-value">{integer.format(round(stats.wpm))}</dd>
          </div>
          <div className="live-stat">
            <dt className="live-stat-label">Accuracy</dt>
            <dd className="live-stat-value">{integer.format(round(stats.accuracy))}%</dd>
          </div>
        </dl>
        <div className="live-actions">
          <button type="button" className="icon-button live-restart" onClick={onRestart}>
            <Icon name="restart" />
            <span className="sr-only">Restart with new text</span>
            <span className="tooltip" aria-hidden="true">
              New test <kbd>Esc</kbd>
            </span>
          </button>
        </div>
      </div>

      <div className="progress" aria-hidden="true">
        <span className="progress-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div
        className="typing-surface"
        data-focused={focused || undefined}
        data-caret={caret}
        data-error={hasError || undefined}
      >
        <label htmlFor="typing-input" className="sr-only">
          Typing test. Type the text exactly; Escape starts a new test.
        </label>
        <input
          ref={inputRef}
          id="typing-input"
          className="typing-input"
          type="text"
          value={typed}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onSelect={keepCaretAtEnd}
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="next"
          aria-describedby="typing-upcoming"
          disabled={phase === 'finished'}
        />
        <p id="typing-upcoming" className="sr-only">
          {nextChar === undefined
            ? 'Finished.'
            : `Next: ${charName(nextChar)}. Upcoming text: ${upcoming}`}
        </p>

        <div className="typing-viewport" aria-hidden="true">
          <div className="typing-text" ref={textRef}>
            {words.map(({ word, start }, i) => {
              const end = start + word.length + 1
              const caretInWord = typed.length >= start && typed.length < end
              return (
                <Word
                  key={start}
                  word={word}
                  start={start}
                  typed={typed.length > start ? typed.slice(start, end) : ''}
                  hasSpace={i < words.length - 1}
                  active={caretInWord}
                />
              )
            })}
            <span
              ref={caretRef}
              className="caret"
              data-idle={phase === 'idle' || undefined}
              data-style={caret}
            />
          </div>
        </div>

        <div className="typing-blur-hint" aria-hidden="true">
          <span>Click here or just start typing</span>
        </div>
      </div>

      <p className="typing-hint">
        {phase === 'idle' ? (
          <>
            Start typing to begin. The timer starts on your first key. <kbd>Esc</kbd> for new text.
          </>
        ) : (
          <>
            <kbd>Esc</kbd> restart · <kbd>Tab</kbd> move focus away
          </>
        )}
      </p>
    </div>
  )
}
