import {
  accuracy,
  computeStats,
  consistency,
  countChars,
  round,
  wordsPerMinute,
} from './scoring.ts'

describe('countChars', () => {
  it('counts correct, incorrect and missed characters', () => {
    expect(countChars('hello world', 'hellp')).toEqual({ correct: 4, incorrect: 1, missed: 6 })
  })
  it('handles empty input', () => {
    expect(countChars('abc', '')).toEqual({ correct: 0, incorrect: 0, missed: 3 })
  })
  it('treats a perfect run as all correct', () => {
    expect(countChars('abc', 'abc')).toEqual({ correct: 3, incorrect: 0, missed: 0 })
  })
})

describe('wordsPerMinute', () => {
  it('uses the 5-characters-per-word standard', () => {
    // 250 chars in 60s = 50 words per minute
    expect(wordsPerMinute(250, 60_000)).toBe(50)
    // 50 chars in 15s = 10 words in a quarter minute = 40 wpm
    expect(wordsPerMinute(50, 15_000)).toBe(40)
  })
  it('returns 0 with no time or no characters (no Infinity / NaN)', () => {
    expect(wordsPerMinute(10, 0)).toBe(0)
    expect(wordsPerMinute(0, 1000)).toBe(0)
    expect(wordsPerMinute(10, -5)).toBe(0)
  })
})

describe('accuracy', () => {
  it('is the share of keystrokes that were right', () => {
    expect(accuracy(100, 5)).toBe(95)
  })
  it('is 100 before any keystroke', () => {
    expect(accuracy(0, 0)).toBe(100)
  })
  it('never goes negative', () => {
    expect(accuracy(2, 5)).toBe(0)
  })
})

describe('computeStats', () => {
  it('derives net and raw speed from the current text', () => {
    const stats = computeStats({
      target: 'the cat sat',
      typed: 'the cot sat',
      keystrokes: 12,
      errors: 2,
      elapsedMs: 6_000,
    })
    expect(stats.chars).toEqual({ correct: 10, incorrect: 1, missed: 0 })
    expect(stats.wpm).toBeCloseTo(20) // 10 chars / 5 / 0.1min
    expect(stats.rawWpm).toBeCloseTo(22)
    expect(stats.accuracy).toBeCloseTo((10 / 12) * 100)
  })
})

describe('consistency', () => {
  it('is 100 for perfectly steady speed', () => {
    expect(consistency([60, 60, 60, 60])).toBe(100)
  })
  it('drops for erratic speed', () => {
    expect(consistency([10, 120, 5, 140])).toBeLessThan(30)
  })
  it('is clamped to 0..100', () => {
    expect(consistency([0, 0, 500])).toBeGreaterThanOrEqual(0)
    expect(consistency([0])).toBe(100)
    expect(consistency([0, 0])).toBe(0)
  })
})

describe('round', () => {
  it('rounds and avoids -0 / NaN', () => {
    expect(round(1.256, 2)).toBe(1.26)
    expect(Object.is(round(-0.2), 0)).toBe(true)
    expect(round(Number.NaN)).toBe(0)
  })
})
