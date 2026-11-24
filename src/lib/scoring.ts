/**
 * Pure scoring maths. Conventions follow the typing-test standard:
 *  - a "word" is 5 characters (spaces included)
 *  - net WPM counts only characters that are currently correct
 *  - raw WPM counts every character currently typed
 *  - accuracy counts every keystroke ever made, so fixed mistakes still count
 */
export const CHARS_PER_WORD = 5

export interface CharCounts {
  correct: number
  incorrect: number
  /** Characters of the target that were never typed (only meaningful once finished). */
  missed: number
}

export interface Stats {
  wpm: number
  rawWpm: number
  /** 0-100 */
  accuracy: number
  chars: CharCounts
  elapsedMs: number
}

export function countChars(target: string, typed: string): CharCounts {
  let correct = 0
  const len = Math.min(typed.length, target.length)
  for (let i = 0; i < len; i++) if (typed[i] === target[i]) correct++
  return {
    correct,
    incorrect: typed.length - correct,
    missed: Math.max(0, target.length - typed.length),
  }
}

export function wordsPerMinute(chars: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || chars <= 0) return 0
  return chars / CHARS_PER_WORD / (elapsedMs / 60_000)
}

export function accuracy(keystrokes: number, errors: number): number {
  if (keystrokes <= 0) return 100
  return Math.max(0, ((keystrokes - errors) / keystrokes) * 100)
}

export interface StatsInput {
  target: string
  typed: string
  keystrokes: number
  errors: number
  elapsedMs: number
}

export function computeStats({ target, typed, keystrokes, errors, elapsedMs }: StatsInput): Stats {
  const chars = countChars(target, typed)
  return {
    wpm: wordsPerMinute(chars.correct, elapsedMs),
    rawWpm: wordsPerMinute(typed.length, elapsedMs),
    accuracy: accuracy(keystrokes, errors),
    chars,
    elapsedMs,
  }
}

/**
 * Consistency: 100 minus the coefficient of variation of per-second raw speed.
 * A perfectly steady typist scores 100; erratic bursts trend towards 0.
 */
export function consistency(samples: readonly number[]): number {
  const values = samples.filter((v) => Number.isFinite(v))
  if (values.length < 2) return 100
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  if (mean === 0) return 0
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length
  const cv = Math.sqrt(variance) / mean
  return Math.max(0, Math.min(100, (1 - cv) * 100))
}

/** Round for display without -0 or NaN surprises. */
export function round(value: number, digits = 0): number {
  if (!Number.isFinite(value)) return 0
  const f = 10 ** digits
  const r = Math.round(value * f) / f
  return Object.is(r, -0) ? 0 : r
}
