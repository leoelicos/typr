import {
  addHistory,
  clearHistory,
  historyStore,
  personalBest,
  sanitizeHistory,
  summarize,
  type HistoryEntry,
} from './history.ts'
import { DEFAULT_SETTINGS, sanitizeSettings } from './settings.ts'

function entry(patch: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: Math.random().toString(36),
    date: '2026-11-24T06:00:00.000Z',
    mode: 'time',
    amount: 30,
    source: 'words',
    wpm: 60,
    rawWpm: 62,
    accuracy: 97,
    consistency: 80,
    elapsedMs: 30_000,
    ...patch,
  }
}

describe('settings sanitising', () => {
  it('falls back to defaults for garbage', () => {
    expect(sanitizeSettings(null)).toEqual(DEFAULT_SETTINGS)
    expect(sanitizeSettings('nope')).toEqual(DEFAULT_SETTINGS)
  })
  it('keeps valid values and drops invalid ones', () => {
    const s = sanitizeSettings({
      theme: 'light',
      accent: 'hotpink',
      showKeyboard: false,
      test: { mode: 'words', wordCount: 50, duration: 7 },
    })
    expect(s.theme).toBe('light')
    expect(s.accent).toBe(DEFAULT_SETTINGS.accent)
    expect(s.showKeyboard).toBe(false)
    expect(s.test.mode).toBe('words')
    expect(s.test.wordCount).toBe(50)
    expect(s.test.duration).toBe(DEFAULT_SETTINGS.test.duration)
  })
})

describe('history', () => {
  afterEach(() => clearHistory())

  it('drops malformed entries', () => {
    expect(sanitizeHistory([entry(), { id: 3 }, null, 'x'])).toHaveLength(1)
    expect(sanitizeHistory({})).toEqual([])
  })

  it('stores newest first and persists to localStorage', () => {
    addHistory(entry({ id: 'a' }))
    addHistory(entry({ id: 'b' }))
    expect(historyStore.get().map((e) => e.id)).toEqual(['b', 'a'])
    expect(JSON.parse(localStorage.getItem('typr:history:v2')!)).toHaveLength(2)
  })

  it('finds personal bests only among comparable tests', () => {
    const list = [
      entry({ wpm: 80, amount: 60 }),
      entry({ wpm: 70 }),
      entry({ wpm: 75, source: 'quote' }),
    ]
    expect(personalBest(list, { mode: 'time', amount: 30, source: 'words' })?.wpm).toBe(70)
    expect(personalBest(list, { mode: 'words', amount: 25, source: 'words' })).toBeUndefined()
  })

  it('summarises progress and trend', () => {
    const list = [
      ...Array.from({ length: 10 }, () => entry({ wpm: 70 })),
      ...Array.from({ length: 10 }, () => entry({ wpm: 60 })),
    ]
    const s = summarize(list)
    expect(s.tests).toBe(20)
    expect(s.bestWpm).toBe(70)
    expect(s.averageWpm).toBe(70)
    expect(s.trend).toBe(10)
    expect(summarize([entry()]).trend).toBeNull()
  })
})
