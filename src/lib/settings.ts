import { DEFAULT_CONFIG, DURATIONS, WORD_COUNTS, type TestConfig } from './session.ts'
import { bool, createPersistentStore, isRecord, oneOf } from './store.ts'

export const THEMES = ['system', 'dark', 'light'] as const
export const ACCENTS = ['ember', 'lagoon', 'iris', 'lime'] as const
export const MOTIONS = ['system', 'reduce', 'full'] as const
export const CARETS = ['line', 'block', 'underline'] as const
export const TEXT_SIZES = ['sm', 'md', 'lg', 'xl'] as const

export type ThemePref = (typeof THEMES)[number]
export type Accent = (typeof ACCENTS)[number]
export type MotionPref = (typeof MOTIONS)[number]
export type CaretStyle = (typeof CARETS)[number]
export type TextSize = (typeof TEXT_SIZES)[number]

export interface Settings {
  theme: ThemePref
  accent: Accent
  motion: MotionPref
  caret: CaretStyle
  textSize: TextSize
  showKeyboard: boolean
  fingerColours: boolean
  highlightNextKey: boolean
  /** Screen reader announcements of time remaining. */
  announceTime: boolean
  test: TestConfig
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  accent: 'ember',
  motion: 'system',
  caret: 'line',
  textSize: 'md',
  showKeyboard: true,
  fingerColours: false,
  highlightNextKey: true,
  announceTime: true,
  test: DEFAULT_CONFIG,
}

export const ACCENT_LABELS: Record<Accent, string> = {
  ember: 'Ember',
  lagoon: 'Lagoon',
  iris: 'Iris',
  lime: 'Lime',
}

function sanitizeTest(raw: unknown): TestConfig {
  const d = DEFAULT_CONFIG
  if (!isRecord(raw)) return d
  const duration = (DURATIONS as readonly number[]).includes(raw['duration'] as number)
    ? (raw['duration'] as number)
    : d.duration
  const wordCount = (WORD_COUNTS as readonly number[]).includes(raw['wordCount'] as number)
    ? (raw['wordCount'] as number)
    : d.wordCount
  return {
    mode: oneOf(raw['mode'], ['time', 'words'], d.mode),
    duration,
    wordCount,
    source: oneOf(raw['source'], ['words', 'home-row', 'quote'], d.source),
    punctuation: bool(raw['punctuation'], d.punctuation),
    numbers: bool(raw['numbers'], d.numbers),
  }
}

export function sanitizeSettings(raw: unknown): Settings {
  const d = DEFAULT_SETTINGS
  if (!isRecord(raw)) return d
  return {
    theme: oneOf(raw['theme'], THEMES, d.theme),
    accent: oneOf(raw['accent'], ACCENTS, d.accent),
    motion: oneOf(raw['motion'], MOTIONS, d.motion),
    caret: oneOf(raw['caret'], CARETS, d.caret),
    textSize: oneOf(raw['textSize'], TEXT_SIZES, d.textSize),
    showKeyboard: bool(raw['showKeyboard'], d.showKeyboard),
    fingerColours: bool(raw['fingerColours'], d.fingerColours),
    highlightNextKey: bool(raw['highlightNextKey'], d.highlightNextKey),
    announceTime: bool(raw['announceTime'], d.announceTime),
    test: sanitizeTest(raw['test']),
  }
}

export const SETTINGS_KEY = 'typr:settings:v2'
export const settingsStore = createPersistentStore(SETTINGS_KEY, sanitizeSettings)

export function updateSettings(patch: Partial<Settings>): void {
  settingsStore.set((prev) => ({ ...prev, ...patch }))
}

export function updateTest(patch: Partial<TestConfig>): void {
  settingsStore.set((prev) => ({ ...prev, test: { ...prev.test, ...patch } }))
}
