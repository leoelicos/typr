import {
  completedWords,
  createSession,
  DEFAULT_CONFIG,
  sessionReducer,
  sessionStats,
  wordIndexAt,
  type SessionAction,
  type SessionState,
  type TestConfig,
} from './session.ts'

const words: TestConfig = { ...DEFAULT_CONFIG, mode: 'words', wordCount: 5 }
const timed: TestConfig = { ...DEFAULT_CONFIG, mode: 'time', duration: 15 }

function run(state: SessionState, ...actions: SessionAction[]): SessionState {
  return actions.reduce(sessionReducer, state)
}

/** Types `text` one character at a time, 100ms apart, starting at t0. */
function typeChars(state: SessionState, text: string, t0 = 1000, step = 100): SessionState {
  let s = state
  let value = s.typed
  for (const [i, ch] of Array.from(text).entries()) {
    value += ch
    s = sessionReducer(s, { type: 'input', value, now: t0 + i * step })
  }
  return s
}

describe('session reducer', () => {
  it('generates text up front and starts idle', () => {
    const s = createSession(words, 42)
    expect(s.phase).toBe('idle')
    expect(s.target.split(' ')).toHaveLength(5)
    expect(s.startedAt).toBeNull()
  })

  it('starts the clock on the first keystroke', () => {
    const s0 = createSession(words, 1)
    const s1 = run(s0, { type: 'input', value: s0.target[0]!, now: 500 })
    expect(s1.phase).toBe('running')
    expect(s1.startedAt).toBe(500)
    expect(s1.keystrokes).toBe(1)
    expect(s1.errors).toBe(0)
  })

  it('counts a mistake even after it is corrected (accuracy is honest)', () => {
    const s0 = createSession(words, 1)
    const first = s0.target[0]!
    const wrong = first === 'x' ? 'y' : 'x'
    const s = run(
      s0,
      { type: 'input', value: wrong, now: 0 },
      { type: 'input', value: '', now: 100 },
      { type: 'input', value: first, now: 200 },
    )
    expect(s.typed).toBe(first)
    expect(s.keystrokes).toBe(2)
    expect(s.errors).toBe(1)
    expect(s.missedKeys[first]).toBe(1)
    expect(sessionStats(s, 200).accuracy).toBe(50)
  })

  it('handles multi-character deletions (e.g. Ctrl+Backspace)', () => {
    const s0 = createSession(words, 3)
    const s1 = typeChars(s0, s0.target.slice(0, 6))
    const s2 = run(s1, { type: 'input', value: s1.typed.slice(0, 2), now: 5000 })
    expect(s2.typed).toBe(s0.target.slice(0, 2))
    expect(s2.keystrokes).toBe(6)
  })

  it('never accepts more characters than the target', () => {
    const s0 = createSession(words, 5)
    const s = run(s0, { type: 'input', value: `${s0.target}EXTRA`, now: 0 })
    expect(s.typed.length).toBe(s0.target.length)
  })

  it('finishes a words test when the last character is typed', () => {
    const s0 = createSession(words, 7)
    const s = typeChars(s0, s0.target)
    expect(s.phase).toBe('finished')
    expect(s.endedAt).not.toBeNull()
    const stats = sessionStats(s, 0)
    expect(stats.accuracy).toBe(100)
    expect(stats.chars.correct).toBe(s0.target.length)
    expect(completedWords(s)).toBe(5)
  })

  it('ignores input once finished', () => {
    const s0 = createSession(words, 7)
    const done = typeChars(s0, s0.target)
    expect(run(done, { type: 'input', value: 'zzz', now: 99_999 })).toBe(done)
  })

  it('finishes a timed test exactly at the limit on tick', () => {
    const s0 = createSession(timed, 9)
    const s1 = run(s0, { type: 'input', value: s0.target[0]!, now: 1000 })
    const s2 = run(s1, { type: 'tick', now: 1000 + 14_900 })
    expect(s2.phase).toBe('running')
    const s3 = run(s2, { type: 'tick', now: 1000 + 16_200 })
    expect(s3.phase).toBe('finished')
    expect(s3.endedAt).toBe(1000 + 15_000)
    expect(s3.samples).toHaveLength(15)
  })

  it('settles an expired timed test when input arrives late', () => {
    const s0 = createSession(timed, 9)
    const s1 = run(s0, { type: 'input', value: s0.target[0]!, now: 0 })
    const s2 = run(s1, { type: 'input', value: s0.target.slice(0, 2), now: 20_000 })
    expect(s2.phase).toBe('finished')
    expect(s2.typed.length).toBe(1)
  })

  it('records one sample per second with per-second raw speed', () => {
    const s0 = createSession(timed, 11)
    // 10 chars in the first second (100ms apart), then a tick at 2.05s
    const s1 = typeChars(s0, s0.target.slice(0, 10), 0, 100)
    const s2 = run(s1, { type: 'tick', now: 2050 })
    expect(s2.samples.map((x) => x.second)).toEqual([1, 2])
    expect(s2.samples[0]!.raw).toBe((10 / 5) * 60)
    expect(s2.samples[1]!.raw).toBe(0)
  })

  it('extends the text in timed mode so you never run out', () => {
    const s0 = createSession(timed, 13)
    const before = s0.target.length
    const s = typeChars(s0, s0.target.slice(0, before - 50), 0, 1)
    expect(s.target.length).toBeGreaterThan(before)
    expect(s.target.startsWith(s0.target)).toBe(true)
  })

  it('reset with the same seed repeats the exact text', () => {
    const s0 = createSession(words, 21)
    const s1 = typeChars(s0, 'abc')
    const s2 = run(s1, { type: 'reset', seed: 21 })
    expect(s2.target).toBe(s0.target)
    expect(s2.typed).toBe('')
    expect(s2.phase).toBe('idle')
  })
})

describe('wordIndexAt', () => {
  it('counts spaces before the index', () => {
    expect(wordIndexAt('one two three', 0)).toBe(0)
    expect(wordIndexAt('one two three', 4)).toBe(1)
    expect(wordIndexAt('one two three', 100)).toBe(2)
  })
})
