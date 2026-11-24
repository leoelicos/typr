import { computeStats, consistency, type Stats } from './scoring.ts'
import { generateText, type TextSource } from './text.ts'

export type TestMode = 'time' | 'words'
export type Phase = 'idle' | 'running' | 'finished'

export interface TestConfig {
  mode: TestMode
  /** Seconds, for time mode. */
  duration: number
  /** Number of words, for words mode. */
  wordCount: number
  source: TextSource
  punctuation: boolean
  numbers: boolean
}

export const DURATIONS = [15, 30, 60, 120, 300] as const
export const WORD_COUNTS = [10, 25, 50, 100] as const

export const DEFAULT_CONFIG: TestConfig = {
  mode: 'time',
  duration: 30,
  wordCount: 25,
  source: 'words',
  punctuation: false,
  numbers: false,
}

export interface Sample {
  /** Whole second this sample closes. */
  second: number
  /** Cumulative net WPM at this second. */
  wpm: number
  /** Raw WPM typed within this second alone. */
  raw: number
  /** Mistakes made within this second alone. */
  errors: number
  /** Cumulative keystrokes at this second (bookkeeping for the next sample). */
  keystrokes: number
  /** Cumulative errors at this second. */
  totalErrors: number
}

export interface SessionState {
  config: TestConfig
  seed: number
  /** How many times the target was extended (time mode generates text on demand). */
  extensions: number
  target: string
  typed: string
  phase: Phase
  startedAt: number | null
  endedAt: number | null
  /** Every character inserted, including ones later deleted. */
  keystrokes: number
  /** Inserted characters that did not match the target at that position. */
  errors: number
  /** Expected character -> number of times it was mistyped. */
  missedKeys: Record<string, number>
  samples: Sample[]
}

export type SessionAction =
  | { type: 'input'; value: string; now: number }
  | { type: 'tick'; now: number }
  | { type: 'reset'; seed: number; config?: TestConfig }

const INITIAL_WORDS_FOR_TIME = 120
const EXTEND_WHEN_REMAINING = 80
const EXTEND_BY_WORDS = 60

function targetFor(config: TestConfig, seed: number): string {
  const count = config.mode === 'words' ? config.wordCount : INITIAL_WORDS_FOR_TIME
  return generateText({ ...config, count, seed })
}

export function createSession(config: TestConfig, seed: number): SessionState {
  return {
    config,
    seed,
    extensions: 0,
    target: targetFor(config, seed),
    typed: '',
    phase: 'idle',
    startedAt: null,
    endedAt: null,
    keystrokes: 0,
    errors: 0,
    missedKeys: {},
    samples: [],
  }
}

function commonPrefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length)
  let i = 0
  while (i < max && a[i] === b[i]) i++
  return i
}

function closeSamples(state: SessionState, elapsedMs: number): Sample[] {
  const due = Math.floor(elapsedMs / 1000)
  if (due <= state.samples.length) return state.samples
  const samples = [...state.samples]
  while (samples.length < due) {
    const second = samples.length + 1
    const prev = samples[samples.length - 1]
    const prevKeystrokes = prev?.keystrokes ?? 0
    const prevErrors = prev?.totalErrors ?? 0
    const stats = computeStats({ ...state, elapsedMs: second * 1000 })
    samples.push({
      second,
      wpm: stats.wpm,
      raw: ((state.keystrokes - prevKeystrokes) / 5) * 60,
      errors: state.errors - prevErrors,
      keystrokes: state.keystrokes,
      totalErrors: state.errors,
    })
  }
  return samples
}

function finish(state: SessionState, endedAt: number): SessionState {
  const startedAt = state.startedAt ?? endedAt
  const elapsed = endedAt - startedAt
  const withSamples = { ...state, samples: closeSamples(state, elapsed) }
  return { ...withSamples, phase: 'finished', endedAt }
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'reset':
      return createSession(action.config ?? state.config, action.seed)

    case 'tick': {
      if (state.phase !== 'running' || state.startedAt === null) return state
      const elapsed = action.now - state.startedAt
      const limit = state.config.duration * 1000
      if (state.config.mode === 'time' && elapsed >= limit) {
        return finish(state, state.startedAt + limit)
      }
      const samples = closeSamples(state, elapsed)
      return samples === state.samples ? state : { ...state, samples }
    }

    case 'input': {
      if (state.phase === 'finished') return state
      // Time mode may have run out between ticks: settle that first.
      if (
        state.phase === 'running' &&
        state.startedAt !== null &&
        state.config.mode === 'time' &&
        action.now - state.startedAt >= state.config.duration * 1000
      ) {
        return finish(state, state.startedAt + state.config.duration * 1000)
      }

      const value = action.value.slice(0, state.target.length)
      if (value === state.typed) return state

      const prefix = commonPrefixLength(state.typed, value)
      const added = value.slice(prefix)
      let { keystrokes, errors } = state
      let missedKeys = state.missedKeys
      for (let i = 0; i < added.length; i++) {
        const index = prefix + i
        const expected = state.target[index] ?? ''
        keystrokes++
        if (added[i] !== expected) {
          errors++
          if (missedKeys === state.missedKeys) missedKeys = Object.assign({}, missedKeys)
          missedKeys[expected] = (missedKeys[expected] ?? 0) + 1
        }
      }

      const starting = state.phase === 'idle' && added.length > 0
      let next: SessionState = {
        ...state,
        typed: value,
        keystrokes,
        errors,
        missedKeys,
        phase: starting ? 'running' : state.phase,
        startedAt: starting ? action.now : state.startedAt,
      }

      if (next.phase === 'running' && next.startedAt !== null) {
        next = { ...next, samples: closeSamples(next, action.now - next.startedAt) }
      }

      // Time mode: keep text flowing so nobody runs out of words.
      if (
        next.config.mode === 'time' &&
        next.target.length - next.typed.length < EXTEND_WHEN_REMAINING
      ) {
        const extensions = next.extensions + 1
        const more = generateText({
          ...next.config,
          count: EXTEND_BY_WORDS,
          seed: next.seed + extensions,
        })
        next = { ...next, extensions, target: `${next.target} ${more}` }
      }

      if (next.config.mode === 'words' && next.typed.length >= next.target.length) {
        return finish(next, action.now)
      }
      return next
    }
  }
}

/** Live or final stats for a session at a given moment. */
export function sessionStats(state: SessionState, now: number): Stats & { consistency: number } {
  const end = state.endedAt ?? now
  const elapsedMs = state.startedAt === null ? 0 : Math.max(0, end - state.startedAt)
  // In time mode, untyped target is open-ended, so "missed" is only meaningful for words mode.
  const target =
    state.config.mode === 'time' ? state.target.slice(0, state.typed.length) : state.target
  const stats = computeStats({ ...state, target, elapsedMs })
  return { ...stats, consistency: consistency(state.samples.map((s) => s.raw)) }
}

/** Index of the word containing `index` in a single-space separated string. */
export function wordIndexAt(text: string, index: number): number {
  let count = 0
  const end = Math.min(index, text.length)
  for (let i = 0; i < end; i++) if (text[i] === ' ') count++
  return count
}

/** Number of words fully typed (a word completes when the following space, or the end, is typed). */
export function completedWords(state: SessionState): number {
  if (state.typed.length >= state.target.length) return state.target.split(' ').length
  return wordIndexAt(state.typed, state.typed.length)
}
