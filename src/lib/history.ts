import type { TestConfig } from './session.ts'
import { createPersistentStore, isRecord, num, oneOf } from './store.ts'
import { SOURCE_LABELS } from './text.ts'

export interface HistoryEntry {
  id: string
  /** ISO timestamp. */
  date: string
  mode: TestConfig['mode']
  /** Seconds (time mode) or words (words mode). */
  amount: number
  source: TestConfig['source']
  wpm: number
  rawWpm: number
  accuracy: number
  consistency: number
  elapsedMs: number
}

export const HISTORY_LIMIT = 100
export const HISTORY_KEY = 'typr:history:v2'

function sanitizeEntry(raw: unknown): HistoryEntry | null {
  if (!isRecord(raw) || typeof raw['id'] !== 'string' || typeof raw['date'] !== 'string')
    return null
  return {
    id: raw['id'],
    date: raw['date'],
    mode: oneOf(raw['mode'], ['time', 'words'], 'time'),
    amount: num(raw['amount'], 0),
    source: oneOf(raw['source'], ['words', 'home-row', 'quote'], 'words'),
    wpm: num(raw['wpm'], 0),
    rawWpm: num(raw['rawWpm'], 0),
    accuracy: num(raw['accuracy'], 0),
    consistency: num(raw['consistency'], 0),
    elapsedMs: num(raw['elapsedMs'], 0),
  }
}

export function sanitizeHistory(raw: unknown): HistoryEntry[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map(sanitizeEntry)
    .filter((e): e is HistoryEntry => e !== null)
    .slice(0, HISTORY_LIMIT)
}

export const historyStore = createPersistentStore(HISTORY_KEY, sanitizeHistory)

export function addHistory(entry: HistoryEntry): void {
  historyStore.set((prev) => [entry, ...prev].slice(0, HISTORY_LIMIT))
}

export function clearHistory(): void {
  historyStore.set([])
}

/** Tests are only comparable with the same mode, length and text source. */
export function sameKind(
  a: Pick<HistoryEntry, 'mode' | 'amount' | 'source'>,
  b: typeof a,
): boolean {
  return a.mode === b.mode && a.amount === b.amount && a.source === b.source
}

export function personalBest(
  history: readonly HistoryEntry[],
  kind: Pick<HistoryEntry, 'mode' | 'amount' | 'source'>,
): HistoryEntry | undefined {
  let best: HistoryEntry | undefined
  for (const e of history) if (sameKind(e, kind) && (!best || e.wpm > best.wpm)) best = e
  return best
}

export function describeKind(e: Pick<HistoryEntry, 'mode' | 'amount' | 'source'>): string {
  const length = e.mode === 'time' ? `${e.amount}s` : `${e.amount} words`
  return `${length} · ${SOURCE_LABELS[e.source]}`
}

export interface HistorySummary {
  tests: number
  bestWpm: number
  averageWpm: number
  averageAccuracy: number
  /** Average of the last 10 minus average of the 10 before (positive = improving). */
  trend: number | null
}

export function summarize(history: readonly HistoryEntry[]): HistorySummary {
  const avg = (xs: readonly number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)
  const recent = history.slice(0, 10).map((e) => e.wpm)
  const previous = history.slice(10, 20).map((e) => e.wpm)
  return {
    tests: history.length,
    bestWpm: history.reduce((m, e) => Math.max(m, e.wpm), 0),
    averageWpm: avg(recent),
    averageAccuracy: avg(history.slice(0, 10).map((e) => e.accuracy)),
    trend: previous.length >= 3 ? avg(recent) - avg(previous) : null,
  }
}
